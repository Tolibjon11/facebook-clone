import React from 'react'
import './Style.css'
import logo from '../../assets/icons/icons8-facebook.svg'
import { 
    Search, Home, Flag, SubscriptionsOutlined, 
    StorefrontOutlined, SupervisedUserCircle ,
    Add, Forum, NotificationsActive, ExpandMore
} from '@material-ui/icons'
import { Avatar, IconButton } from '@material-ui/core'
import { useStateValue } from './../../StateProvider';



const Index = () => {
    const [{user}, dispatch] = useStateValue();
return (<div className='header'>
            <div className="header-left">
                <img src={logo} alt="" />
                <div className="header-input">
                    <Search />
                    <input type="text" placeholder='Search Facebook'/>
                </div>
            </div>

            <div className="header-middle">
                <div className="header-option header-option--active">
                    <Home fontSize='large'/>
                </div>
                <div className="header-option">
                    <Flag fontSize='large'/>
                </div>
                <div className="header-option">
                    <SubscriptionsOutlined fontSize='large'/>
                </div>
                <div className="header-option">
                    <StorefrontOutlined fontSize='large'/>
                </div>
                <a href='https://www.facebook.com/friends' className="header-option">
                    <SupervisedUserCircle fontSize='large'/>
                </a>
            </div>

            <div className="header-right">
                <div className="header-info">
                    <Avatar src={user.photoURL}/>
                    <h4>{user.displayName}</h4>
                </div>

                <IconButton>
                    <Add />
                </IconButton>
                <IconButton>
                    <Forum />
                </IconButton>
                <IconButton>
                    <NotificationsActive />
                </IconButton>
                <IconButton>
                    <ExpandMore />
                </IconButton>
            </div>
        </div>
    )
}

export default Index
