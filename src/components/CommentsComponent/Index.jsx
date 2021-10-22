import React, {useState} from 'react'
import './Style.css'
import Like from '../../assets/icons/like.svg'
import { Modal, Avatar, Backdrop, IconButton } from '@material-ui/core'
import { Clear, ArrowDropUp, MoreHoriz,PersonAdd } from '@material-ui/icons'
import { toast } from 'react-toastify'
import db from '../../firebase'
import OutsideClickHandler from 'react-outside-click-handler'
import Comment from '../Comment/Index'
import { useStateValue } from './../../StateProvider';


const Index = ({ 
    username, postId, 
    pictureUrl, comId, 
    repliedID, repliedMessage, 
    repliedUser, timestamp, 
    refreshToken, clickedLikeCommentByUsersArray,
    likeComment, comment, likeCommentControl
}) => {
    
    const [{user}, dispatch] = useStateValue();
    const [openCommentDelete, setOpenCommentDelete] = useState(false)
    const [idClickedMoreHorizOfCommit, setIdClickedMoreHorizOfCommit] = useState(0)
    const [isAutoFocus, setIsAutoFocus] = useState(false)
    const [isSendReplyMessage, setIsSendReplyMessage] = useState()
    const [openLikeUsers, setOpenLikeUsers] = useState(false)
    const [isClickedLikeCommentBtn, setIsClickedLikeCommentBtn] = useState(false)
    const [replyComId, setReplyComId] = useState(0);
    const [isClickedMoreHorizOfCommit, setIsclickedMoreHorizOfCommit] = useState(false)



    const handleCommentLike = () => {
        
        let check=false;
        
        for (let i=0; i<Object.keys(likeCommentControl).length; i++){
            if(user.uid === Object.keys(likeCommentControl)[i]){
                check=true;
            }
            else {
                check=false;
            }
        }


        db.collection('posts').doc(postId).collection('comments').doc(comId).update({
            likeCommentControl: check ? {
                [user.uid]:{
                    comment_id: comId,
                    clickedLikeComment: likeCommentControl[user.uid]===undefined?true:!likeCommentControl[user.uid].clickedLikeComment
                }
            }:
            {...likeCommentControl,
                [user.uid]:{
                    comment_id: comId,
                    clickedLikeComment: likeCommentControl[user.uid]===undefined?true:!likeCommentControl[user.uid].clickedLikeComment
                }
            },
            likeComment: (likeCommentControl[user.uid]===undefined?true:!likeCommentControl[user.uid].clickedLikeComment)?likeComment+1:likeComment-1,
            clickedLikeCommentByUsersArray: (likeCommentControl[user.uid]===undefined?false:likeCommentControl[user.uid].clickedLikeComment)?
            [...clickedLikeCommentByUsersArray?.filter((e) => e.userRefreshToken!==user.uid)]:
            [...clickedLikeCommentByUsersArray, {
                userPhoto: user.photoURL,
                userUsername: user.displayName,
                userRefreshToken: user.uid
            }]
        })
        // setUsersWhoClickForCommit([...clickedLikeCommentByUsersArray])
    }

    const handleDelete = () => {
        setOpenCommentDelete(false)
        console.log("deleted comment id: ", comId)
        db.collection('posts').doc(postId).collection('comments').doc(comId).delete()
        .then(() => {
            toast.success("Comment was successfully deleted!")
        }).catch(() => {
            toast.error("Something went wrong.")
        })
    }

    
    return (
        <div className="commend">
            <Avatar className='commend_sender_avatar' src={pictureUrl}/>
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
                                    <div className="delete__btn__comment" onClick={handleDelete}>Delete</div>
                                </div>
                            </div>
                        </div>
                    </Modal>
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
                                <p>All(for comments)</p>
                                <Clear className="closeModal__btn" onClick={() => setOpenLikeUsers(false)} />
                            </div>
                            <div className="users_who_click_like">
                                {
                                    clickedLikeCommentByUsersArray?.map(({userPhoto, userUsername}) =>
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
                    <OutsideClickHandler onOutsideClick={() => setIsclickedMoreHorizOfCommit(false)}>
                        {(isClickedMoreHorizOfCommit&&idClickedMoreHorizOfCommit===comId)&&
                                <div className="delete__comment__div">
                                    <p onClick={() => {
                                        setOpenCommentDelete(true)
                                        setIsclickedMoreHorizOfCommit(false)
                                    }}>Delete</p>
                                    <ArrowDropUp className='arrow-delete-comment'/>
                                </div>

                        }
                        {username === user.displayName &&
                            <IconButton 
                                className='delete__comment__open__icon'
                                onClick={() => {
                                    setIsclickedMoreHorizOfCommit(!isClickedMoreHorizOfCommit)
                                    setIdClickedMoreHorizOfCommit(comId)
                                }}
                                style={{
                                    position: 'absolute',
                                    right: '0',
                                    top: '-10px'
                                }}
                            >
                                <MoreHoriz className="post-morehoriz-btn"/>
                            </IconButton>
                        }
                    </OutsideClickHandler>
                    <div className="comment__body">
                        <p className="username">{username}</p>
                    
                        <div className="replied_com">
                            <p><b>{repliedID&&repliedUser}</b></p>
                            <p><i>{repliedID&&repliedMessage}</i></p>
                        </div>
                    
                        <p className="commend__text">{comment}</p>
                    </div>
                    <div className="like_commed">
                        <div className="like"
                            onClick={handleCommentLike}
                            style={{color: `${likeCommentControl[user.uid]?.clickedLikeComment?"#0571ED":"#65676b"}`}}
                        >Like</div>
                        <div 
                            className="reply" 
                            onClick={() => {
                                setReplyComId(comId)
                                setIsSendReplyMessage(false);   
                                setIsAutoFocus(true)
                            }}
                        >Reply</div>
                        <div className="time">
                            {new Date().getMinutes() - new Date(timestamp)?.getMinutes()!==0?
                            <p>
                                {
                                    new Date().getMinutes() - new Date(timestamp)?.getMinutes()>0?
                                    new Date().getMinutes() - new Date(timestamp)?.getMinutes():
                                    new Date().getHours() - new Date(timestamp)?.getHours() > 0?
                                    new Date().getHours() - new Date(timestamp)?.getHours() :
                                    new Date().getDate() - new Date(timestamp)?.getDate()
                                } {
                                new Date().getMinutes() - new Date(timestamp)?.getMinutes()>0?
                                "m":
                                new Date().getHours() - new Date(timestamp)?.getHours() > 0?
                                "h" : 'd'
                                }
                            </p>:<p>now</p>
                            }       

                        </div>
                        {
                        likeComment>0&&
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
                            <p>{likeComment}</p>
                            </div>
                        }
                    </div>
                    {
                        comId === replyComId && <Comment 
                            postId={postId} 
                            username={username} 
                            repliedMessage={comment}
                            repliedID={comId} 
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

export default Index
