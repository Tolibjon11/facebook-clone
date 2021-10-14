import React, {useState, useEffect} from 'react'
import './Style.css'
import StoryReel from '../StoryReel/Index'
import MessageSender from '../MessageSender/Index'
import Post from '../PostComponent/Index'
import db from '../../firebase'

const Index = () => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        db.collection("posts").orderBy('timestamp', 'desc').onSnapshot(snapshot => 
            setPosts(snapshot.docs.map((doc) => ({id: doc.id, data: doc.data()})))
        );
    }, []);

    
    return (
        <div className="feed">
            <StoryReel />
            <MessageSender />
            {
                posts.map((post, index) => (
                    <Post
                        key={post.id}
                        id={post.id}
                        message={post.data.message}
                        profilePic={post.data.profilePic}
                        timestamp={post.data.timestamp}
                        username={post.data.username}
                        image={post.data.image}
                        like={post.data.like}
                        likeControlArray={post.data.likeControlArray}
                        clickedLikeByUsersArray={post.data.clickedLikeByUsersArray}
                        index={index}
                    />
                ))
            }
            {/* Messenger Sender */}
        </div>
    )
}

export default Index
