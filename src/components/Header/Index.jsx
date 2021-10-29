import React, {useState} from 'react'
import './Style.css'
import firebase from 'firebase'
import {auth} from '../../firebase'
import OutsideClickHandler from 'react-outside-click-handler'
import logo from '../../assets/icons/icons8-facebook.svg'
import { 
    Search, Home, Flag, SubscriptionsOutlined, 
    StorefrontOutlined, SupervisedUserCircle ,
    Add, Forum, NotificationsActive, ExpandMore, Style
} from '@material-ui/icons'
import { Avatar, IconButton, Modal, Backdrop } from '@material-ui/core'
import { 
    Announcement, 
    Help, Settings, 
    ExitToApp, Brightness2, 
    ArrowForwardIos, Menu,
    EmojiFlags,ExpandMoreOutlined,
    People, Chat, VideoLibrary, 
    Storefront,KeyboardBackspace
} from '@material-ui/icons'
import { useStateValue } from './../../StateProvider';
import SidebarRow from '../../components/SidebarRow/Index'



const Index = () => {

    const [{user}, dispatch] = useStateValue();
    const [open, setOpen] = useState(false)
    const [openNavbar, setOpenNavbar] = useState(false)

    const logOut = () => {
        // for (var member in user) delete user[member];
        // console.log("Deleted user: ", user)
        // user = null;
        window.location.reload();
    }


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
                    <div className="header-option shop">
                        <StorefrontOutlined fontSize='large'/>
                    </div>
                    <a href='https://www.facebook.com/friends' className="header-option">
                        <SupervisedUserCircle fontSize='large'/>
                    </a>
                    <IconButton className='menu_btn' onClick={() => setOpenNavbar(true)}>
                        <Menu />
                    </IconButton>
                </div>

                <div className="header-right">
                    <div className="header-info">
                        <Avatar src={user.photoURL} className='header_user'/>
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
                    <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
                    <IconButton onClick={() => setOpen(!open)}>
                        <ExpandMore  />
                    </IconButton>
                    
                        <div 
                            className="user_info_container"
                            style={{display: `${open?"flex":'none'}`}}
                        >
                            <div className="user_info_header">
                                <Avatar src={user.photoURL} className='user_info_header_userPhoto'/>
                                <div className='user_displayName'>
                                    <p>{user.displayName}</p>
                                    <div>See your profile</div>
                                </div>
                            </div>
                            <hr className='border' />
                            <div className="user_info_body">
                                <div className="user_info_body_box">
                                    <div className="icon"><Announcement/></div>
                                    <div className="block">
                                        <div className="text">Give feedback</div>
                                        <p>Help us improve the new Facebook clone</p>
                                    </div>
                                </div>
                                <hr className='border border_' />
                                <div className="user_info_body_box">
                                    <div className="icon"><Settings/></div>
                                    <div className="text text_">Settings & Privacy</div>
                                    <ArrowForwardIos style={{marginLeft:'auto'}} />
                                </div>
                                <div className="user_info_body_box">
                                    <div className="icon"><Help/></div>
                                    <div className="text text_">Help & Support</div>
                                    <ArrowForwardIos style={{marginLeft:'auto'}} />
                                </div>
                                <div className="user_info_body_box">
                                    <div className="icon icon_"><Brightness2/></div>
                                    <div className="text text_">Display & Accessibility</div>
                                    <ArrowForwardIos style={{marginLeft:'auto'}} />
                                </div>
                                <div className="user_info_body_box" onClick={logOut}>
                                    <div className="icon"><ExitToApp /></div>
                                    <div className="text text_">Log Out</div>
                                </div>
                            </div>
                        </div>
                    </OutsideClickHandler>  
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={openNavbar}
                        onClose={() => setOpenNavbar(false)}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500,
                        }}
                    >
                        <div className="navbar">
                            <div className="navbar-header">
                                <KeyboardBackspace onClick={() => setOpenNavbar(false)} style={{color:'white'}} />
                                <p>Facebook</p>
                            </div>
                            <div className="navbar-body">
                                <div onClick={() => setOpenNavbar(false)}><SidebarRow src={user.photoURL} title={user.displayName}/></div>
                                <div onClick={() => setOpenNavbar(false)}><SidebarRow Icon={EmojiFlags} title="Pages"/></div>
                                <div onClick={() => setOpenNavbar(false)}><SidebarRow Icon={People} title="Friends" /></div>
                                <div onClick={() => setOpenNavbar(false)}><SidebarRow Icon={Chat} title="Messenger" /></div>
                                <div onClick={() => setOpenNavbar(false)}><SidebarRow Icon={Storefront} title="Marketplace" /></div>
                                <div onClick={() => setOpenNavbar(false)}><SidebarRow Icon={VideoLibrary} title="Videos" /></div>
                                <div onClick={() => setOpenNavbar(false)}><SidebarRow Icon={ExpandMoreOutlined} title="Marketplace" /></div>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }

export default Index
