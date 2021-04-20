import React, {Fragment, useCallback, useState} from 'react'
import {AdditionalText, GrayPlate, Plate} from '../common'
import {
    Box, ButtonProps,
    CircularProgress, Collapse,
    Grid, Hidden,
    IconButton, IconButtonProps,
    Tooltip,
    Typography
} from '@material-ui/core'
import {useAppState} from '../tools/use-app-state'
import {format} from 'date-fns'
import {PlateProps} from '../common/plate'
import {Link} from 'react-router-dom'
import {ReactComponent as LeaveIcon} from '../../assets/team/leave.svg'
import {ReactComponent as ExpandIcon} from '../../assets/team/expand.svg'
import {ReactComponent as CollapseIcon} from '../../assets/team/collapse.svg'
import {useSnackbar} from 'notistack'
import {useNotificationHandlers} from '../tools/notification-handlers'
import {leaveTeam} from '../../model/api'
import {usePromptModal} from '../modals/prompt'

const SideItem: React.FC<{ title: string, value: string }> = ({title, value}) => (
    <Box clone flexDirection={{xs: 'column', md: 'row'}}>
        <Grid item container>
            <AdditionalText
                style={{width: 140}}>{title}</AdditionalText>
            <Typography
                variant='body1'>{value}</Typography>
        </Grid>
    </Box>
)

export const EventDetails: React.FC<PlateProps> = ({children, ...props}) => {
    const {cEvent} = useAppState()

    if (cEvent.notFound) {
        return null
    }

    if (cEvent.isNullEvent) {
        return <GrayPlate>
            <Grid container justify='center' alignItems='center'>
                <CircularProgress size='3rem'/>
            </Grid>
        </GrayPlate>
    }

    return <GrayPlate padding={16} {...props}>
        <Grid container direction='column' wrap='nowrap' spacing={1}>
            <Grid item>
                <Link to={`event/${cEvent.id}`}
                      style={{textDecoration: 'none'}}>
                    <Typography variant='h1'>
                        {cEvent.name}
                    </Typography>
                </Link>
            </Grid>
            <Box paddingTop={1}/>
            <Grid item container xs spacing={1}>
                <SideItem title='Дата начала:' value={
                    cEvent.settings.start ? format(cEvent.settings.start, 'dd.MM.yyyy') : 'Не известна'
                }/>
                <SideItem title='Дата окончания:' value={
                    cEvent.settings.finish ? format(cEvent.settings.finish, 'dd.MM.yyyy') : 'Не известна'
                }/>
                <SideItem title='Размер команды:' value={
                    cEvent.settings.teamSize ? (cEvent.settings.teamSize + ' чел. ') : 'любой'
                }/>
            </Grid>
        </Grid>
        {children}
    </GrayPlate>
}

export const LeadDetails: React.FC = () => {
    const {cUser} = useAppState()

    if (!cUser.team.teamLead) {
        return null
    }

    const leaderName = cUser.team.teamLead.id === cUser.id ? 'Вы' :
        `${cUser.team.teamLead.firstName} ${cUser.team.teamLead.lastName}`

    const toolTipMessage = cUser.team.teamLead.id === cUser.id ?
        'Теперь Вы можете принимать решение о приеме и отклонении заявок, а также исключать членов команды' :
        'Лидер команды может принимать решение о приеме и отклонении заявок, а также исключать членов команды'

    return <Tooltip
        title={toolTipMessage}>
        <div>
            <Typography>
                <b>{leaderName}</b> &mdash; Лидер команды
            </Typography>
        </div>
    </Tooltip>

}

const LeaveButton: React.FC = () => {
    const {cUser} = useAppState()
    const {enqueueSnackbar} = useSnackbar()
    const nc = useNotificationHandlers()
    const pModal = usePromptModal()
    const onClick = useCallback(async () => {
        pModal.open({
            onSubmit: async () => {
                if (cUser.team.id) {
                    const didLeave = await leaveTeam(cUser.team.id)
                    if (didLeave) {
                        enqueueSnackbar('Вы покинули команду', {
                            variant: 'success'
                        })
                    } else {
                        enqueueSnackbar('Не удалось покинуть команду', {
                            variant: 'error'
                        })
                    }
                } else {
                    enqueueSnackbar('Не удалось покинуть команду', {
                        variant: 'error'
                    })
                }
                pModal.close()
                nc.update()
            },
            message: 'Выйти из команды?',
            accept: 'Покинуть',
            decline: 'Остаться'
        })
    }, [cUser.team.id, nc.update, enqueueSnackbar, pModal.open])

    if (!cUser.team.teamLead) {
        return null
    }

    return <IconButton size='small' onClick={onClick}>
        <LeaveIcon/>
    </IconButton>
}

const OpenButton: React.FC<{ isOpen?: boolean } & IconButtonProps> = ({isOpen, ...props}) => {
    return <IconButton {...props}>
        {isOpen ? <CollapseIcon/> : <ExpandIcon/>}
    </IconButton>
}
const MobileSide: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)

    // @ts-ignore
    return <Grid item container direction='column' wrap='nowrap'>
        <Box clone height='48px' style={{zIndex: 2}} padding='16px'>
            <Grid item container alignItems='center'>
                <LeadDetails/>
                <Box flex={1}/>
                <OpenButton size='small' isOpen={isOpen} onClick={() => {
                    setIsOpen(!isOpen)
                }}/>
            </Grid>
        </Box>
        <Box clone marginTop={isOpen ? '' : '-48px'} minHeight='24px'
             style={{transition: '.5s'}}>
            <Plate padding={16}>
                <Collapse in={isOpen}>
                    <Grid item container direction='column' wrap='nowrap'>
                        <Grid item container>
                            <GrayPlate>
                                <AdditionalText>
                                Скоро здесь будет кое-что
                                </AdditionalText>
                            </GrayPlate>
                        </Grid>
                        <Box paddingTop={1}/>
                        <Grid item container>
                            <Box flex={1}/><LeaveButton/>
                        </Grid>
                    </Grid>
                </Collapse>
            </Plate>
        </Box>
    </Grid>
}
export const SideSection: React.FC = () => {
    return <Fragment>
        <Hidden xsDown>
            <Box clone minHeight='40px' paddingTop='10px'>
                <Grid item container alignItems='center'>
                    <LeadDetails/>
                    <Box flex={1}/>
                    <LeaveButton/>
                </Grid>
            </Box>
            <Box paddingTop={1}/>
            <Grid item><EventDetails/></Grid>
        </Hidden>
        <Hidden smUp>
            <MobileSide/>
        </Hidden>
    </Fragment>
}