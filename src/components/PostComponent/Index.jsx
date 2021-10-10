import { Avatar } from '@material-ui/core'
import React,{useState, useEffect} from 'react'
import './Style.css'
import Like from '../../assets/icons/like.svg'
import { ThumbUp, ChatBubbleOutline, NearMe, AccountCircle, ExpandMore, Height } from '@material-ui/icons'
import Comment from '../Comment/Index'
import db from '../../firebase'

const Index = ({profilePic, image, username, timestamp, message, id}) => {

    const [likeCount, setLikeCount] = useState(0)
    const [commentCount, setCommentCount] = useState(0)
    const [comments, setComments] = useState([]);
    const [replyComId, setReplyComId] = useState(0);
    const [isSendReplyMessage, setIsSendReplyMessage] = useState()


    function reverseArr(input) {
        var ret = new Array;
        for(var i = input.length-1; i >= 0; i--) {
            ret.push(input[i]);
        }
        return ret;
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
                        <p>{comments.length} Comment</p>
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
                <div className="write__comments">
                    <div className="comments">
                    <Comment postId={id} />
                        {
                            // comments.map((com) => com.data.repliedID && setRepliedIdComments({...com.data})),
                            comments.map((com) =>

                                <div className="commend">
                                    <Avatar className='commend_sender_avatar' src={com.data.pictureUrl}/>
                                    <div> 
                                        <div className="comment__body">
                                            <p className="username">{com.data.username} <i>{com.data.repliedID&&com.data.repliedMessage}</i></p>
                                            <p className="commend__text"><b>{com.data.repliedID&&com.data.repliedUser}</b> {com.data.comment}</p>
                                        </div>
                                        <div className="like_commed">
                                            <div className="like">Like</div>
                                            <div 
                                                className="reply" 
                                                onClick={() => {
                                                    setReplyComId(com.id)
                                                    setIsSendReplyMessage(false);
                                                }}
                                            >Reply</div>
                                            <div className="time">{
                                                new Date().getMinutes() - new Date(com.data.timestamp)?.getMinutes()
                                            } min</div>
                                        </div>
                                        {
                                            com.id === replyComId && <Comment 
                                                postId={id} 
                                                username={username} 
                                                repliedMessage={com.data.comment}
                                                repliedID={com.id} 
                                                reply={true} 
                                                replySend = {setIsSendReplyMessage}
                                                isSend={isSendReplyMessage}
                                            />
                                                
                                        }
                                    </div>  
                                </div>
                                
                            )
                            
                        }
                         
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index
