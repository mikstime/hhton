import React, {useEffect, useState} from 'react'
import {SubTitle} from '../common'
import {useAppState} from '../tools/use-app-state'
import {Grid, IconButton, TextField} from '@material-ui/core'
import {ReactComponent as EditImage} from '../../assets/edit.svg'
import {ReactComponent as SaveImage} from '../../assets/save.svg'
import {modifyTeamName} from '../../model/api'
import {useSnackbar} from 'notistack'

export const TeamName: React.FC = () => {
    const {cUser, cEvent} = useAppState()
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [value, setValue] = useState('')
    const {enqueueSnackbar, closeSnackbar} = useSnackbar()
    useEffect(() => {
        setValue(cUser.team.name)
        setIsEditing(false)
    }, [cUser.team.name])
    if (cUser.team && cUser.team.name) {
        if (isEditing) {
            return <Grid container style={{marginBottom: 16}}>
                <Grid item>
                    <IconButton size='small' disabled={isLoading}
                                onClick={async () => {
                                    setIsLoading(true)
                                    const didSave = await modifyTeamName(cUser.team.id ?? '', cEvent.id, value)
                                    if (didSave) {
                                    } else {
                                        const k = enqueueSnackbar('Не удалось изменить название', {
                                            variant: 'error',
                                            onClick: () => {
                                                closeSnackbar(k)
                                            }
                                        })
                                    }
                                    setIsEditing(false)
                                    setIsLoading(false)
                                }}>
                        <SaveImage/>
                    </IconButton>
                </Grid>
                <Grid xs item>
                    <TextField
                        fullWidth value={value} style={{
                        fontSize: 19,
                        fontWeight: 300,
                        fontFamily: '\'Frutiger\', sans-serif'
                    }} onChange={(e) => {
                        setValue(e.target.value)
                    }}/>
                </Grid>
            </Grid>
        } else {
            return <SubTitle
                style={{marginBottom: 16}}>
                <IconButton size='small' onClick={() => {
                    setIsEditing(true)
                }}>
                    <EditImage/>
                </IconButton>
                {value}
            </SubTitle>
        }
    }
    return <SubTitle style={{marginBottom: 16}}>Ваша комнада</SubTitle>
}