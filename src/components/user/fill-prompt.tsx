import React, {useCallback, useEffect, useState} from 'react'
import {useAppState} from '../tools/use-app-state'
import {GrayPlate} from '../common'
import {Box, Grid, IconButton, Typography} from '@material-ui/core'
import {ReactComponent as CloseIcon} from '../../assets/team/kick.svg'

export const FillPrompt = () => {

    const {cUser, user} = useAppState()
    const [wasPrompt, setWasPrompt] = useState(false)
    useEffect(() => {
        const id = localStorage.getItem('edit-user-prompt')
        if(id === cUser.id) {
            setWasPrompt(true)
        }
    }, [cUser.id])

    const onClick = useCallback(() => {
        localStorage.setItem('edit-user-prompt', cUser.id)
        setWasPrompt(true)
    }, [cUser.id])

    const shouldPrompt = !cUser.settings.tg && !cUser.settings.gh &&
        !cUser.bio && !cUser.jobName && !cUser.skills.description
        && !cUser.skills.tags.length

    if (cUser.id === user.id && cUser.id !== '-1' && !cUser.isLoading
        && shouldPrompt && !wasPrompt) {
        return <Grid item>
            <Box clone style={{border: '1px solid #e4e4e4'}}>
                <GrayPlate>
                    <Grid container>
                        <Grid item xs>
                            <Typography>
                                Заполните анкету, чтобы получать больше
                                приглашений от
                                других пользователей
                            </Typography>
                        </Grid>
                        <Box width={0} marginRight='20px' marginTop='-4px'>
                            <IconButton size='small' onClick={onClick}>
                                <CloseIcon/>
                            </IconButton>
                        </Box>
                    </Grid>
                </GrayPlate>
            </Box>
        </Grid>
    }

    return null
}