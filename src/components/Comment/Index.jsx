import { Avatar } from '@material-ui/core'
import { InsertEmoticon , Send, Close} from '@material-ui/icons';
import React, {useState} from 'react'
import db from '../../firebase'
import firebase from 'firebase'
import Picker from 'emoji-picker-react'
import './Style.css'
import { useStateValue } from './../../StateProvider';


const Index = ({postId, repliedID, reply, username, repliedMessage, replySend, isSend, autoFocusInput}) => {
    const [{user}, dispatch] = useStateValue();
    const [commit, setCommit] = useState('');
    const [showPicker, setShowPicker] = useState(false);
  


    const onEmojiClick = (event, emojiObject) => {
        setCommit(prevInput => prevInput + emojiObject.emoji);
        setShowPicker(false);
    }

    const handleCommit = (e) => {
        e.preventDefault();

        db.collection("posts").doc(postId).collection('comments').add({
            comment: commit,
            username: user.displayName,
            pictureUrl: user.photoURL,
            refreshToken: user.refreshToken,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            repliedID: reply===true && repliedID,
            repliedUser: reply===true&&username,
            repliedMessage: reply===true&&repliedMessage,
            likeComment:0,
            clickedLikeComment: false,
            clickedLikeCommentByUsersArray: []
        })

        reply===true&&replySend(true);
        
        setCommit('');
    }




    return (
        <div className='comment_' style={{display: `${isSend?"none":"flex"}`}}>
            <Avatar 
                src={user.photoURL}
                className='comment-avatar'
            />
            <form className="emoji_with_input">
                <input 
                    value={commit} 
                    type="text" placeholder='Write a comment...' 
                    onChange={(e) => setCommit(e.target.value)}
                    autoFocus={`${reply===true&&autoFocusInput}`} 
                />
                <InsertEmoticon
                    className='emoji-icon_'
                    onClick={() => setShowPicker(val =>!val)}
                />
                <button 
                    className="sender"
                    onClick={handleCommit}
                    type="submit"
                    
                >
                    <Send 
                        style={{
                            color: 'blue', 
                            marginLeft: '10px', 
                            display: `${commit.length>0?"block":"none"}`
                        }}
                    />
                </button>
                {
                    showPicker && <Picker 
                        className='picker'
                        pickerStyle={{with: '100px', position: 'absolute',right:'0',bottom:'60px', zIndex:'999'}}
                        onEmojiClick={onEmojiClick}
                    />
                }
            </form>
            <Close 
                onClick={() => replySend(true)}
                style={{display: `${!reply === true && "none"}`, cursor: 'pointer'}}
            />
        </div>
    )
}

export default Index
