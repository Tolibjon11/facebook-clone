import { Avatar, IconButton, Modal, Backdrop } from '@material-ui/core'
import React,{useState, useEffect} from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import './Style.css'
import Like from '../../assets/icons/like.svg'
import { ThumbUpAltOutlined, ThumbUp, ChatBubbleOutline, NearMe, MoreHoriz, DeleteOutline, ArrowDropUp, Clear, PersonAdd } from '@material-ui/icons'
import Comment from '../Comment/Index'
import db from '../../firebase'
import { toast } from 'react-toastify'
import { useStateValue } from './../../StateProvider';

const Index = ({profilePic, image, username, timestamp, message, id, like, clickedLike, clickedLikeByUsersArray}) => {

    const [comments, setComments] = useState([]);
    const [{user}, despatch] = useStateValue()
    const [replyComId, setReplyComId] = useState(0);
    const [isSendReplyMessage, setIsSendReplyMessage] = useState()
    const [isAutoFocus, setIsAutoFocus] = useState(false)
    const [amountComments, setAmountComments] = useState(2);
    const [isClickedMoreHoriz, setIsClickedMoreHoriz] = useState(false)
    const [isClickedMoreHorizOfCommit, setIsclickedMoreHorizOfCommit] = useState(false)
    const [open, setOpen] = useState(false)
    const [openCommentDelete, setOpenCommentDelete] = useState(false)
    const [openLikeUsers, setOpenLikeUsers] = useState(false)
    const [idClickedMoreHorizOfCommit, setIdClickedMoreHorizOfCommit] = useState(0)
    const [isClickedLikeCommentBtn, setIsClickedLikeCommentBtn] = useState(false)
    const [usersWhoClickForCommit, setUsersWhoClickForCommit] = useState([])

    function arrayRemove(arr, value) { 
    
        return arr.filter(function(ele){ 
            return ele !== value; 
        });
    }

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
    

    const handleLike = (userUsername, userPhoto, userRefreshToken) =>{
        

        db.collection('posts').doc(id).update({
            clickedLike: !clickedLike,
            like: clickedLike?like-1:like+1,
            clickedLikeByUsersArray: clickedLike? 
            [...clickedLikeByUsersArray.filter((e) => e.userRefreshToken!==userRefreshToken)] : 
            [...clickedLikeByUsersArray, {
                userPhoto: userPhoto,
                userUsername: userUsername, 
                userRefreshToken:userRefreshToken
            }]
        })
    }


    const handleCommentLike = (id_comment, likeComment, clickedLikeComment, clickedLikeCommentByUsersArray, token, username, pictureUrl) => {
        
        db.collection('posts').doc(id).collection('comments').doc(id_comment).update({
            clickedLikeComment: !clickedLikeComment,
            likeComment: clickedLikeComment?likeComment-1:likeComment+1,
            clickedLikeCommentByUsersArray: !clickedLikeComment?
            [...clickedLikeCommentByUsersArray.filter((e) => e.userRefreshToken!==token)]:
            [...clickedLikeCommentByUsersArray, {
                userPhoto: pictureUrl,
                userUsername: username,
                userRefreshToken: token
            }]
        })
        setUsersWhoClickForCommit([...clickedLikeCommentByUsersArray])
        console.log('comment uchun like bosgan users: ', usersWhoClickForCommit)
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

    const handleDeleteComment = (id_comment) => {
        setOpenCommentDelete(false)
        db.collection('posts').doc(id).collection('comments').doc(id_comment).delete()
        .then(() => {
            toast.success("Comment was successfully deleted!")
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
                            <DeleteOutline style={{color: '#414244'}}/>
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
                                <p>All(for {isClickedLikeCommentBtn?'comments':'posts'})</p>
                                <Clear className="closeModal__btn" onClick={() => setOpenLikeUsers(false)} />
                            </div>
                            <div className="users_who_click_like">
                                {
                                    isClickedLikeCommentBtn?
                                    usersWhoClickForCommit?.map(({userPhoto, userUsername}) =>
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
                                    ):
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
                        className="post-option" onClick={() => handleLike(user.displayName, user.photoURL, user.refreshToken)}>
                        {
                            clickedLike?
                            <ThumbUp style={{color: '#0571ed'}}/>:
                            <ThumbUpAltOutlined style={{color: "#65676b"}}/>
                        }
                        <p style={{color: `${clickedLike?'#0571ED':"#65676b"}`}}>Like</p>
                        
                    </button>
                    <div className="post-option">
                        <ChatBubbleOutline />
                        <p>Comment</p>
                    </div>
                    <div className="post-option">
                        <NearMe />
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
                                comments.slice(0, amountComments).map((com) =>

                                    <div className="commend">
                                        <Avatar className='commend_sender_avatar' src={com.data.pictureUrl}/>
                                        <div style={{position:'relative'}}> 
                                        <Modal
                                            aria-labelledby="transition-modal-title"
                                            aria-describedby="transition-modal-description"
                                            open={openCommentDelete}

                                            onClose={() => setOpenCommentDelete(false)}
                                            closeAfterTransition
                                            BackdropComponent={Backdrop}
                                            BackdropProps={{
                                              timeout: 500,
                                            }}
                                        >
                                            <div className="delete-comment-modal">
                                                <div className="deleteComment-header">
                                                    <p>Delete Comment</p>
                                                    <Clear 
                                                        className='close__icon' 
                                                        onClick={() => {
                                                            setOpenCommentDelete(false)
                                                        }}
                                                    />
                                                </div>
                                                <div className="deleteComment-body">
                                                    <p>Are you sure you want to delete this comment?</p>
                                                    <div className="confrim_or_reject__delete">
                                                        <div className="cancel__btn__comment" onClick={() => setOpenCommentDelete(false)}>Cancel</div>
                                                        <div className="delete__btn__comment" onClick={() => handleDeleteComment(com.id)}>Delete</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Modal>
                                        {(isClickedMoreHorizOfCommit&&idClickedMoreHorizOfCommit===com.id)&&
                                            <OutsideClickHandler onOutsideClick={() => setIsclickedMoreHorizOfCommit(false)}>
                                                <div className="delete__comment__div">
                                                    <p onClick={() => {
                                                        setOpenCommentDelete(true)
                                                        setIsclickedMoreHorizOfCommit(false)
                                                    }}>Delete</p>
                                                    <ArrowDropUp className='arrow-delete-comment'/>
                                                </div>
                                            </OutsideClickHandler>
                                        }
                                        {com.data.username === user.displayName &&
                                            <IconButton 
                                                className='delete__comment__open__icon'
                                                onClick={() => {
                                                    setIsclickedMoreHorizOfCommit(!isClickedMoreHorizOfCommit)
                                                    setIdClickedMoreHorizOfCommit(com.id)
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    right: '-50px',
                                                    top: '16x`px'
                                                }}
                                            >
                                                <MoreHoriz className="post-morehoriz-btn"/>
                                            </IconButton>
                                        }
                                            <div className="comment__body">
                                                <p className="username">{com.data.username}</p>

                                                <div className="replied_com">
                                                    <p><b>{com.data.repliedID&&com.data.repliedUser}</b></p>
                                                    <p><i>{com.data.repliedID&&com.data.repliedMessage}</i></p>
                                                </div>

                                                <p className="commend__text">{com.data.comment}</p>
                                            </div>
                                            <div className="like_commed">
                                                <div className="like" 
                                                    onClick={() => handleCommentLike(
                                                        com.id, 
                                                        com.data.likeComment, 
                                                        com.data.clickedLikeComment, 
                                                        com.data.clickedLikeCommentByUsersArray,
                                                        com.data.refreshToken,
                                                        com.data.username, com.data.pictureUrl
                                                    )}
                                                    style={{color:`${com.data.clickedLikeComment?'#0571ED':'#65676B'}`}} 
                                                >Like</div>
                                                <div 
                                                    className="reply" 
                                                    onClick={() => {
                                                        setReplyComId(com.id)
                                                        setIsSendReplyMessage(false);   
                                                        setIsAutoFocus(true)
                                                    }}
                                                >Reply</div>
                                                <div className="time">
                                                    {new Date().getMinutes() - new Date(com.data.timestamp)?.getMinutes()!==0?
                                                    <p>
                                                        {
                                                            new Date().getMinutes() - new Date(com.data.timestamp)?.getMinutes()>0?
                                                            new Date().getMinutes() - new Date(com.data.timestamp)?.getMinutes():
                                                            new Date().getHours() - new Date(com.data.timestamp)?.getHours() > 0?
                                                            new Date().getHours() - new Date(com.data.timestamp)?.getHours() :
                                                            new Date().getDate() - new Date(com.data.timestamp)?.getDate()
                                                        } {
                                                        new Date().getMinutes() - new Date(com.data.timestamp)?.getMinutes()>0?
                                                        "m":
                                                        new Date().getHours() - new Date(com.data.timestamp)?.getHours() > 0?
                                                        "h" : 'd'
                                                        }
                                                    </p>:<p>now</p>
                                                    }       

                                                </div>
                                                {
                                                com.data.likeComment>0&&
                                                    <div className="like-comment_" onClick={() => {
                                                        setIsClickedLikeCommentBtn(true)
                                                        setOpenLikeUsers(true)
                                                    }}>
                                                    <img 
                                                        style={{
                                                            width:'18px',
                                                            height: '18px',
                                                        }}
                                                        src={Like}
                                                        alt="" 
                                                    />
                                                    <p>{com.data.likeComment}</p>
                                                    </div>
                                                }
                                            </div>
                                            {
                                                com.id === replyComId && <Comment 
                                                    postId={id} 
                                                    username={com.data.username} 
                                                    repliedMessage={com.data.comment}
                                                    repliedID={com.id} 
                                                    reply={true} 
                                                    replySend = {setIsSendReplyMessage}
                                                    isSend={isSendReplyMessage}
                                                    autoFocusInput = {isAutoFocus}
                                                />

                                            }
                                            
                                        </div>  
                                    </div>

                                )
                                        
                            }
                            {
                                amountComments > 5 && <div className='expand_more_info_amount_comment'>
                                {amountComments < comments.length?
                                <p 
                                    className='expand_more' 
                                    onClick={() => setAmountComments(amountComments+4)}
                                    style={{display: `${amountComments > comments.length ? "none":'block'}`,}}
                                >View more comments</p>:<p className='expand_more' onClick={() =>setAmountComments(2)}>Short comments</p>
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
