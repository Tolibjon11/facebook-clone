import { Avatar } from '@material-ui/core'
import React from 'react'
import './Style.css'

const Index = ({title, src, Icon}) => {
    return (
        <div className='sidebarRow'>
            {src && <Avatar src={src}/>}
            {Icon && <Icon />}
            <h4>{title}</h4>
        </div>
    )
}

export default Index
