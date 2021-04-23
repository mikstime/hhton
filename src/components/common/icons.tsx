import React from 'react'
import {ReactComponent as KickActiveIcon} from '../../assets/team/kick_active.svg'
import {ReactComponent as KickIconBase} from '../../assets/team/kick.svg'
import {ReactComponent as BlockActiveIcon} from '../../assets/team/block_active.svg'
import {ReactComponent as BlockIconBase} from '../../assets/team/block.svg'

export const KickIcon: React.FC<{ active: boolean }> = ({active, ...props}) => {
    return active ? <KickActiveIcon {...props}/> : <KickIconBase {...props}/>
}

export const BlockIcon: React.FC<{ active: boolean }> = ({active, ...props}) => {
    return active ? <BlockActiveIcon {...props}/> : <BlockIconBase {...props}/>
}