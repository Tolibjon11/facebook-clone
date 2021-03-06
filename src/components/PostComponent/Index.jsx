import { Avatar, IconButton, Modal, Backdrop } from '@material-ui/core'
import React,{useState, useEffect} from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import './Style.css'
import Like from '../../assets/icons/like.svg'
import { ThumbUpAltOutlined, ThumbUp, ChatBubbleOutline, NearMe, MoreHoriz, DeleteOutline, ArrowDropUp, Clear, PersonAdd, FlashOnTwoTone } from '@material-ui/icons'
import Comment from '../Comment/Index'
import CommentsComponent from '../CommentsComponent/Index'
import db from '../../firebase'
import { toast } from 'react-toastify'
import { useStateValue } from './../../StateProvider';

const Index = ({profilePic, image, username, timestamp, message, id, like, index, clickedLikeByUsersArray, likeControlArray}) => {

    const [comments, setComments] = useState([]);
    const [{user}, despatch] = useStateValue()
    const [amountComments, setAmountComments] = useState(2);
    const [isClickedMoreHoriz, setIsClickedMoreHoriz] = useState(false)
    const [open, setOpen] = useState(false)
    const [openLikeUsers, setOpenLikeUsers] = useState(false)
    const [isClickedLikeCommentBtn, setIsClickedLikeCommentBtn] = useState(false)
    const [usersWhoClickForCommit, setUsersWhoClickForCommit] = useState([]);
    
    
    useEffect(() => {
        if(id){
            var unsubcribe = db.collection('posts')
            .doc(id).collection('comments')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => setComments(snapshot.docs.map((doc) =>({id:doc.id, data:doc.data()}))))
        }
        return () => {
            unsubcribe();
        }
        
    }, [id])


    const handleLike = (userUsername, userPhoto) => {


        let check=false;
        
        for (let i=0; i<Object.keys(likeControlArray).length; i++){
            if(user.uid === Object.keys(likeControlArray)[i]){
                check=true;
            }
            else check=false
        }


        db.collection('posts').doc(id).update({
            likeControlArray: check ? {
                [user.uid]: {
                    post_id: id,
                    clickLikePost: likeControlArray[user.uid]===undefined?true:!likeControlArray[user.uid].clickLikePost
                }
            }:
            {...likeControlArray,
                [user.uid]: {
                    post_id: id,
                    clickLikePost: likeControlArray[user.uid]===undefined?true:!likeControlArray[user.uid].clickLikePost
                }
            },
            like: (likeControlArray[user.uid]===undefined?true:!likeControlArray[user.uid].clickLikePost)?like+1:like-1,
            clickedLikeByUsersArray: (likeControlArray[user.uid]===undefined?false:likeControlArray[user.uid].clickLikePost)? 
            [...clickedLikeByUsersArray.filter((e) => e.userRefreshToken!==user.uid)] : 
            [...clickedLikeByUsersArray, {
                userPhoto: userPhoto,
                userUsername: userUsername, 
                userRefreshToken:user.uid
            }]
        })
    }
    

    const handleDeletePost = () => {
        setOpen(false)
        db.collection('posts').doc(id).delete()
        .then(() => {
            toast.success("Post was successfully deleted!")
        }).catch(() => {
            toast.error("Something went wrong.")
        })
    }




    return (
        <div className='post'>
            <div className="post-top">
                <Avatar src={profilePic} className='post-avatar'/>
                <div className="post-topInfo">
                    <h3>{username}</h3>
                    <p>{new Date(timestamp)?.toGMTString()}</p>
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
                    <div className="delete-post">
                        <div className="deletePost__header">
                            <p>Are you sure you want to delete this post?</p>
                        </div>
                        <div className="deletePost__body">
                            <div className="yes-btn" onClick={handleDeletePost}>Yes</div>
                            <div className="no-btn" onClick={() => setOpen(false)}>No</div>
                        </div>
                    </div>
                </Modal>
                {user.displayName===username&&
                    <IconButton 
                        className='post-morehoriz' style={{marginLeft:'auto', marginTop:'-10px'}}
                        onClick={() => setIsClickedMoreHoriz(!isClickedMoreHoriz)}
                    >
                        <MoreHoriz className="post-morehoriz-btn"/>
                    </IconButton>
                }
                <OutsideClickHandler onOutsideClick={()=>setIsClickedMoreHoriz(false)}>
                    <div 
                        className="delete-div"
                        style={{display:`${isClickedMoreHoriz?"flex":'none'}`}}
                    >
                        <div className="delete-container" onClick={() => {
                            setOpen(true)
                            setIsClickedMoreHoriz(false)
                        }}>
                            <DeleteOutline className='delete__post__btn' style={{color: '#414244'}}/>
                            <p>Delete Post</p>
                            <ArrowDropUp className='close-delete-div'/>
                        </div>
                    </div>
                </OutsideClickHandler>
            </div>
            <div className="post-bottom">
                <p>{message}</p>
            </div>
            <div className="post-image">
                <img src={image} alt="" />
            </div>

            <div className="post__under">
                <div className="info__like__comment">
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={openLikeUsers}
                        onClose={() => setOpenLikeUsers(false)}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500,
                        }}
                    >
                        <div className="delete-post users_click_like">
                            <div className="deletePost__header users_click_like_header">
                                <p>All(for posts)</p>
                                <Clear className="closeModal__btn" onClick={() => setOpenLikeUsers(false)} />
                            </div>
                            <div className="users_who_click_like">
                                {
                                    clickedLikeByUsersArray?.map(({userPhoto, userUsername}) =>
                                    <div className='info_user_who_click_like'>
                                        <div className="user__img">
                                            <img src={userPhoto} alt="" style={{width: '50px', borderRadius:'50%'}} />
                                            <img src={Like} alt='' style={{position:'absolute', width:'17px', right:'2px', bottom:'0'}} />
                                        </div>
                                        <p>{userUsername}</p>
                                        <div className="add__friend__btn">
                                            <PersonAdd style={{color:'#1D1F23'}}/>
                                            <p>Add Friend</p>
                                        </div>
                                    </div>
                                    )
                                }
                            </div>
                        </div>
                    </Modal>
                    <div className="like_" onClick={() => {
                        setOpenLikeUsers(!openLikeUsers)
                        setIsClickedLikeCommentBtn(false)
                    }} title='see who likes'>
                        <img style={{width:'18px',height: '18px'}} src={Like} alt="" />
                        <p>{like}</p>
                    </div>
                    <div className="comment">
                        <p onClick={()=>{
                            setAmountComments(comments.length)
                        }}>{comments.length} Comment</p>
                    </div>
                </div>
                <div className="post-options">
                    <button 
                        className="post-option" onClick={() => handleLike(user.displayName, user.photoURL)}>
                        {
                            likeControlArray[user.uid]?.clickLikePost?
                            <ThumbUp style={{color: '#0571ed'}} className="post_option_btn"/>:
                            <ThumbUpAltOutlined className="post_option_btn" style={{color: "#65676b"}}/>
                        }
                        <p style={{color: `${likeControlArray[user.uid]?.clickLikePost?'#0571ED':"#65676b"}`}}>Like</p>
                        
                    </button>
                    <div className="post-option">
                        <ChatBubbleOutline className="post_option_btn" />
                        <p>Comment</p>
                    </div>
                    <div className="post-option">
                        <NearMe className="post_option_btn" />
                        <p>Share</p>
                    </div>
                </div>
                
                    <div className="write__comments">
                        <div className="comments">
                        {
                            (amountComments > 1 && amountComments<6 && comments.length>2) && <p className='expand_more' onClick={() => setAmountComments(amountComments+4)}>View more comments</p>
                        }
                        <Comment postId={id} />
                            {
                                
                                // comments.map((com) => com.data.repliedID && setRepliedIdComments({...com.data})),
                                comments.slice(0, amountComments).map((com, index) =>

                                    <CommentsComponent 
                                        username={com.data.username}
                                        postId={id}
                                        pictureUrl={com.data.pictureUrl}
                                        comId={com.id}
                                        comment={com.data.comment}
                                        repliedUser={com.data.repliedUser}
                                        repliedMessage={com.data.repliedMessage}
                                        repliedID={com.data.repliedID}
                                        timestamp={com.data.timestamp}
                                        refreshToken={com.data.refreshToken}
                                        clickedLikeCommentByUsersArray={com.data.clickedLikeCommentByUsersArray}
                                        likeComment={com.data.likeComment}
                                        likeCommentControl={com.data.likeCommentControl}
                                    />

                                )
                                        
                            }
                            {
                                amountComments > 5 && 
                                <div className='expand_more_info_amount_comment'>
                                {
                                amountComments < comments.length?
                                    <p 
                                        className='expand_more' 
                                        onClick={() => setAmountComments(amountComments+4)}
                                        style={{display: `${amountComments > comments.length ? "none":'block'}`,}}
                                    >
                                        View more comments
                                    </p>
                                    :
                                    <p 
                                        className='expand_more' onClick={() =>setAmountComments(2)}
                                        style={{display:`${comments.length===0&&"none"}`}}
                                    >
                                        Short comments
                                    </p>
                                }
                                <p 
                                    className='info_amount_comment'
                                    style={{display: `${amountComments > comments.length ? "none":'block'}`,}}
                                >{amountComments}/{comments.length} comments</p>
                                </div>
                            }

                        </div>
                    </div>
                  
            </div>
        </div>
    )
}

export default Index
