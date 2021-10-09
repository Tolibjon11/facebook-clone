import React from 'react'
import './Style.css'
import SidebarRow from '../SidebarRow/Index'
import { LocalHospital, People, EmojiFlags, Chat, Storefront, VideoLibrary, ExpandMoreOutlined } from '@material-ui/icons'
import { useStateValue } from './../../StateProvider';

const Index = () => {
    const [{ user }, dispatch] = useStateValue();
    return (
        <div className="sidebar">
            <SidebarRow src={user.photoURL} title={user.displayName}/>
            <SidebarRow Icon={LocalHospital} title="COVID-19 Information Center" />
            <SidebarRow Icon={EmojiFlags} title="Pages" />
            <SidebarRow Icon={People} title="Friends" />
            <SidebarRow Icon={Chat} title="Messenger" />
            <SidebarRow Icon={Storefront} title="Marketplace" />
            <SidebarRow Icon={VideoLibrary} title="Videos" />
            <SidebarRow Icon={ExpandMoreOutlined} title="Marketplace" />
        </div>
    )
}

export default Index
