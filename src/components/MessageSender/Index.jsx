import { Avatar, Modal, Backdrop, IconButton, LinearProgress } from '@material-ui/core'
import React, {useState, useEffect} from 'react'
import './Style.css'
import { Videocam, PhotoLibrary, Clear, AddAPhoto, InsertEmoticon } from '@material-ui/icons'
import { useStateValue } from './../../StateProvider';
import db from '../../firebase'
import { storage } from '../../firebase';
import firebase from 'firebase'
import Picker from 'emoji-picker-react'


const Index = () => {
    const [input, setInput] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const [showImage, setShowImage] = useState(null);
    const [{ user }, dispatch] = useStateValue();
    const [showPicker, setShowPicker] = useState(false);
    const [open, setOpen] = useState(false)
    const [progress, setProgress] = useState(0);


    const onEmojiClick = (event, emojiObject) => {
        setInput(prevInput => prevInput + emojiObject.emoji);
        setShowPicker(false);
    }

    useEffect(() => {
        setShowImage(null)
        setShowPicker(false)
        setInput("")
    }, [open])


    const handleChange = (e) => {
             if (e.target.files[0]){

                 setImageUrl(e.target.files[0])

                 storage.ref(`images/${e.target.files[0].name}`).put(e.target.files[0]).on("state_changed",() => {
                     storage.ref("images").child(e.target.files[0].name).getDownloadURL().then(url => setShowImage(url))
                 })
            }
        }

    const handleSubmitWithCaption = (e) => {
        // e.preventDefault();

        db.collection('posts').add({
            message: input,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            username: user.displayName,
            profilePic: user.photoURL,
            image: imageUrl,
            like:0,
            likeControlArray:{},
            clickedLikeByUsersArray:[]
        })
        setInput("");
        setShowImage(null)
        setOpen(false)
    }


    const handleUploadImageWithCaption = () => {
        setShowImage(null);
        setInput("")
            const uploadTask = storage.ref(`images/${imageUrl.name}`).put(imageUrl);
        
            uploadTask.on(
                "state_changed",
                snapshot => {
                    //progress function
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes)*100
                    );
                    setProgress(progress);
                },
                error => {
                    // Error function ...
                    console.log(error)
                    alert(error.message)
                },
                () => {
                    // complete function
                    storage.ref("images")
                        .child(imageUrl.name)
                        .getDownloadURL().then(url => {
                            db.collection('posts').add({
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                message: input,
                                image: url,
                                username: user.displayName,
                                profilePic: user.photoURL,
                                like:0,
                                likeControlArray:{},
                                clickedLikeByUsersArray:[]
                            })
                            setOpen(false)
                            setProgress(0);
                            setInput('');
                            // setImageUrl(null)   ;
                        })
                }
            )
    }

    const handleUpload = () => {
        showImage ? handleUploadImageWithCaption() : handleSubmitWithCaption();
    }


    return (
        <div className='messageSender'>
            <div className="messageSender-top" >
                <Avatar src={user.photoURL}/>
                <form>
                    
                    
                    <div
                      style={{
                          width: '100%',
                          cursor: 'pointer',
                          fontSize:'20px',
                          padding: "10px"
                      }}
                      onClick={() => {
                          setOpen(true)
                        }}
                    >
                        {`What's on your mind, ${user.displayName}?`}
                    </div>
                </form>
            </div>
            <div className="messageSender-bottom">
                <div className="messageSender-option">
                    <Videocam style={{color: "red"}}/>
                    <h3>Live Video</h3>
                </div>
                <div className="messageSender-option" style={{cursor:'pointer'}} onClick={() => setOpen(true)}>
                    <PhotoLibrary style={{color: "green"}}/>
                    <h3>Photo/Video</h3>
                </div>
                <div className="messageSender-option">
                    <InsertEmoticon style={{color: "orange"}}/>
                    <h3>Feelings/Activity</h3>
                </div>
            </div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                
                onClose={() => setOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
            >
                <div className="modal__card">
                    <div className="modalCard__header">
                        <p>Create post</p>
                        <Clear 
                            className='close__icon' 
                            onClick={() => {
                                setOpen(false)
                                setShowImage(null);
                                setInput("");
                            }}
                        />
                    </div>
                    <div className="modalCard__body">
                        <div className="top" style={{position:'relative'}}>
                            <Avatar className='avatar' src={user.photoURL}/>
                            <p>{user.displayName}</p>
                            {
                                    showPicker && <Picker 
                                        className='picker'
                                        pickerStyle={{with: '100px', position: 'absolute',right:'0',bottom:'0', zIndex:'999'}}
                                        onEmojiClick={onEmojiClick}
                                    />
                                }
                        </div>
                        <div className="middle">
                            <div className="pickerEmoji-container">
                                <input
                                    className='messageSender-input'
                                    placeholder={`What's on your mind, ${user.displayName}?`}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)} 
                                    id='myTextArea'
                                />
                                <InsertEmoticon
                                    className='emoji-icon'
                                    src='http://icons.getbootstrap.com/assets/icons/emoji-smile.svg'
                                    alt=''
                                    onClick={() => setShowPicker(val =>!val)}
                                />
                                
                            </div>
                        <div className="image__div">
                            <p style={{display: `${showImage && 'none'}`}}>See image you choose here...</p>
                            <img src={showImage} alt="" />
                        </div>
                        </div>
                        
                        <div className="bottom">
                            
                            <LinearProgress variant="determinate" value={progress} />
                            <div className="add__img">
                                <AddAPhoto />
                                <h2>Add Photos/Videos</h2>
                                <p>or drag and drop</p>
                                <input type="file" onChange={handleChange} />
                            </div>
                            <IconButton className="do__post" onClick={handleUpload}><div>Post</div></IconButton>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Index
