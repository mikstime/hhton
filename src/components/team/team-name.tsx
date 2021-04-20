import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useAppState} from '../tools/use-app-state'
import {
    Box,
    Grid,
    GridProps,
    IconButton,
    TextField,
    Typography
} from '@material-ui/core'
import {ReactComponent as EditImage} from '../../assets/team/edit_name.svg'
import {ReactComponent as SaveImage} from '../../assets/team/save_name.svg'
import {modifyTeamName} from '../../model/api'
import {useSnackbar} from 'notistack'
import {useNotificationHandlers} from '../tools/notification-handlers'

export const TeamName: React.FC<GridProps> = ({children, ...props}) => {
    const {cUser, cEvent} = useAppState()
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [value, setValue] = useState('')
    const {enqueueSnackbar, closeSnackbar} = useSnackbar()
    const nc = useNotificationHandlers()

    useEffect(() => {
        if (cUser.team.name) {
            setValue(cUser.team.name)
        } else {
            setValue('Ваша команда')
        }
        setIsEditing(false)
    }, [cUser.team.name])

    const onSubmit = useCallback(async () => {
        if(isLoading) return

        setIsLoading(true)
        const didSave = await modifyTeamName(cEvent.id, cUser.team.id ?? '', value)
        if (didSave) {
        } else {
            const k = enqueueSnackbar('Не удалось изменить название', {
                variant: 'error',
                onClick: () => {
                    closeSnackbar(k)
                }
            })
            setValue(cUser.team.name)
        }
        setIsEditing(false)
        setIsLoading(false)
        nc.update()
    }, [setIsLoading, cEvent.id, cUser.team.id,
        value, setIsEditing, setValue, nc.update])

    const teamName = !isEditing ?
        <Typography variant='h1' onClick={() => {
            if(cUser.team.name && cUser.isTeamLead) {
                setIsEditing(true)
            }
        }}>
            {value}
        </Typography> :
        <TextField
            fullWidth
            value={value}
            autoFocus
            onBlur={onSubmit}
            inputProps={{
                style: {
                    fontSize: 28,
                    padding: 0,
                    fontWeight: 300,
                    fontFamily: '\'Frutiger\', sans-serif',
                    lineHeight: 1.167,
                    letterSpacing: '-0.01562em',
                    marginTop: '-1px'
                }
            }}
            onChange={(e) => {
                setValue(e.target.value)
            }}/>


    return <Box minHeight='48px' clone>
        <Grid item container
              alignItems='center' {...props}>
            {cUser.team.name && cUser.isTeamLead && <Box clone paddingRight={1}><Grid item>
              <IconButton disabled={isLoading}
                          onClick={isEditing ? onSubmit : () => {
                              setIsEditing(true)
                          }}>
                  {isEditing ? <SaveImage/> : <EditImage/>}
              </IconButton>
            </Grid>
            </Box>}
            <Grid xs item>
                {teamName}
            </Grid>
            {children}
        </Grid>
    </Box>
}