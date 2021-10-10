import { Avatar } from '@material-ui/core'
import React,{useState, useEffect} from 'react'
import './Style.css'
import Like from '../../assets/icons/like.svg'
import { ThumbUp, ChatBubbleOutline, NearMe, AccountCircle, ExpandMore, Height } from '@material-ui/icons'
import Comment from '../Comment/Index'
import db from '../../firebase'

const Index = ({profilePic, image, username, timestamp, message, id}) => {

    const [likeCount, setLikeCount] = useState(0)
    const [comments, setComments] = useState([]);
    const [replyComId, setReplyComId] = useState(0);
    const [isSendReplyMessage, setIsSendReplyMessage] = useState()
    const [isAutoFocus, setIsAutoFocus] = useState(false)
    const [amountComments, setAmountComments] = useState(2);
    const [showCommentsDiv, setShowCommentsDiv] = useState(false);

    


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




    return (
        <div className='post'>
            <div className="post-top">
                <Avatar src={profilePic} className='post-avatar'/>
                <div className="post-topInfo">
                    <h3>{username}</h3>
                    <p>{new Date(timestamp)?.toGMTString()}</p>
                </div>
            </div>
            <div className="post-bottom">
                <p>{message}</p>
            </div>
            <div className="post-image">
                <img src={image} alt="" />
            </div>

            <div className="post__under">
                <div className="info__like__comment">
                    <div className="like">
                        <img 
                            style={{
                                width:'18px',
                                height: '18px',
                            }}
                            src={Like}
                            alt="" 
                        />
                        <p>{likeCount}</p>
                    </div>
                    <div className="comment">
                        <p onClick={()=>{
                            setShowCommentsDiv(!showCommentsDiv)
                            setAmountComments(2)
                        }}>{comments.length} Comment</p>
                    </div>
                </div>
                <div className="post-options">
                    <div className="post-option">
                        <ThumbUp />
                        <p>Like</p>
                    </div>
                    <div className="post-option">
                        <ChatBubbleOutline />
                        <p>Comment</p>
                    </div>
                    <div className="post-option">
                        <NearMe />
                        <p>Share</p>
                    </div>
                    {/* <div className="post-option">
                        <AccountCircle />
                        <ExpandMore />
                    </div> */}
                </div>
                {showCommentsDiv&&
                    <div className="write__comments">
                        <div className="comments">
                        {
                            (amountComments < 3 && comments.length!==0) && <p className='expand_more' onClick={() => setAmountComments(amountComments+4)}>View more comments</p>
                        }
                        <Comment postId={id} />
                            {
                                // comments.map((com) => com.data.repliedID && setRepliedIdComments({...com.data})),
                                comments.slice(0, amountComments).map((com) =>

                                    <div className="commend">
                                        <Avatar className='commend_sender_avatar' src={com.data.pictureUrl}/>
                                        <div> 
                                            <div className="comment__body">
                                                <p className="username">{com.data.username}</p>

                                                <div className="replied_com">
                                                    <p><b>{com.data.repliedID&&com.data.repliedUser}</b></p>
                                                    <p><i>{com.data.repliedID&&com.data.repliedMessage}</i></p>
                                                </div>

                                                <p className="commend__text">{com.data.comment}</p>
                                            </div>
                                            <div className="like_commed">
                                                <div className="like">Like</div>
                                                <div 
                                                    className="reply" 
                                                    onClick={() => {
                                                        setReplyComId(com.id)
                                                        setIsSendReplyMessage(false);   
                                                        setIsAutoFocus(true)
                                                    }}
                                                >Reply</div>
                                                <div className="time">{
                                                    new Date().getMinutes() - new Date(com.data.timestamp)?.getMinutes()
                                                } min</div>
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
                                amountComments > 2 && <div className='expand_more_info_amount_comment'>
                                <p 
                                    className='expand_more' 
                                    onClick={() => setAmountComments(amountComments+4)}
                                    style={{display: `${amountComments > comments.length ? "none":'block'}`,}}
                                >View more comments</p>
                                <p 
                                    className='info_amount_comment'
                                    style={{display: `${amountComments > comments.length ? "none":'block'}`,}}
                                >{amountComments}/{comments.length} comments</p>
                                </div>
                            }

                        </div>
                    </div>
                }   
            </div>
        </div>
    )
}

export default Index
