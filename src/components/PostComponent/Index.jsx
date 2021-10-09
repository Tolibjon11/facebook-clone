import { Avatar } from '@material-ui/core'
import React from 'react'
import './Style.css'
import { ThumbUp, ChatBubbleOutline, NearMe, AccountCircle, ExpandMore } from '@material-ui/icons'

const Index = ({profilePic, image, username, timestamp, message}) => {
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
                <div className="post-option">
                    <AccountCircle />
                    <ExpandMore />
                </div>
            </div>
        </div>
    )
}

export default Index
