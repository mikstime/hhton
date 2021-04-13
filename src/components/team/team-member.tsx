import React, {useCallback} from 'react'
import {User} from '../tools/use-app-state/user'
import {
    Box, Chip,
    createStyles,
    Grid,
    IconButton,
    makeStyles,
    Theme
} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {AdditionalText, AvatarPlate} from '../common'
import {NameTypography} from '../common/typography'
import {ReactComponent as KickActiveIcon} from '../../assets/team/kick_active.svg'
import {ReactComponent as KickIconBase} from '../../assets/team/kick.svg'
import {ReactComponent as VoteActiveIcon} from '../../assets/team/vote_active.svg'
import {ReactComponent as VoteIconBase} from '../../assets/team/vote.svg'
import {useAppState} from '../tools/use-app-state'
import {SocialLink} from '../app/user'
import {kickTeamMember, unVoteFor, voteFor} from '../../model/api'
import {useSnackbar} from 'notistack'
import {useNotificationHandlers} from '../tools/notification-handlers'
import {usePromptModal} from '../modals/prompt'


const KickIcon: React.FC<{ active: boolean }> = ({active, ...props}) => {
    return active ? <KickActiveIcon {...props}/> : <KickIconBase {...props}/>
}

const VoteIcon: React.FC<{ active: boolean }> = ({active, ...props}) => {
    return active ? <VoteActiveIcon {...props}/> : <VoteIconBase {...props}/>
}

export const useChipStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            margin: '16px -16px 16px -16px',
            '& > *': {
                margin: theme.spacing(1),
                borderRadius: 8,
                background: 'white',
                boxShadow: theme.shadows[4],
                color: theme.typography.body2.color,
                '&:hover': {
                    background: 'white'
                },
                '&:active': {
                    background: 'white',
                    boxShadow: 'none'
                },
                '&:focus': {
                    background: 'white'
                }
            }
        },
        selected: {
            background: '#F7F8FA',
            boxShadow: 'none',
            '&:hover': {
                background: '#F7F8FA',
                boxShadow: 'none'
            },
            '&:focus': {
                background: '#F7F8FA',
                boxShadow: 'none'
            },
            '&:active': {
                background: '#F7F8FA',
                boxShadow: 'none'
            }
        },
        notSelected: {
            opacity: 0.3,
            '&:hover': {
                background: 'white'
            },
            '&:active': {
                background: '#F7F8FA'
            }
        }
    })
)

const Skills: React.FC<{ user: User }> = ({user}) => {
    const classes = useChipStyles()
    return <div className={classes.root} style={{margin: '0px -8px 0px -8px'}}>
        {user.skills.tags.map((s, i) => <Chip key={s.name + i}
                                              label={s.name}/>)}
    </div>
}


export const TeamMember: React.FC<{ user: User }> = ({user}) => {

    const {cUser, cEvent} = useAppState()
    const team = cUser.team
    const didVote = team.myVote === user.id
    const {enqueueSnackbar} = useSnackbar()
    const nc = useNotificationHandlers()
    const pModal = usePromptModal()
    const onKick = useCallback(async () => {
        const didKick = await kickTeamMember(cEvent.id, cUser.team.id ?? '-1', user.id)
        if (didKick) {
            enqueueSnackbar('Пользователь исключен')
        } else {
            enqueueSnackbar('Не удалось исключить из команды', {
                variant: 'error'
            })
        }
        nc.update()

    }, [enqueueSnackbar, cEvent.id, cUser.team.id, user.id, nc.update])

    const onVote = useCallback(async () => {
        if (cUser.team.myVote !== user.id && cUser.team.myVote !== '-1' && cUser.team.myVote) {
            // const didUnVote = await unVoteFor(cUser.team.myVote, cEvent.id, cUser.team.id ?? '-1')
            const didVote = await voteFor(user.id, cEvent.id, cUser.team.id ?? '-1')
            if (didVote) {
                //nop
            } else {
                enqueueSnackbar('Не удалось проголосовать', {
                    variant: 'error'
                })
            }
        } else if (cUser.team.myVote === user.id) {
            const didUnVote = await unVoteFor(user.id, cEvent.id, cUser.team.id ?? '-1')
            if (didUnVote) {
                //nop
            } else {
                enqueueSnackbar('Не удалось забрать голос', {
                    variant: 'error'
                })
            }
        } else {
            const didVote = await voteFor(user.id, cEvent.id, cUser.team.id ?? '-1')
            if (didVote) {
                //nop
            } else {
                enqueueSnackbar('Не удалось проголосовать', {
                    variant: 'error'
                })
            }
        }
        nc.update()
    }, [enqueueSnackbar, cEvent.id, cUser.team.id, user.id, nc.update, cUser.team.myVote])

    return <Grid item container spacing={2}>
        <Grid item md={5} xs={9} sm={5}>
            <Link to={`/user/${user.id}`}
                  style={{textDecoration: 'none'}}>
                <AvatarPlate padding={24} src={user.avatar} style={{
                    position: 'sticky',
                    top: 88
                }}/>
            </Link>
        </Grid>
        <Box clone order={{xs: 3, sm: 2, md: 2}}>
            <Grid item xs sm={5} md={5} container spacing={2}
                  direction='column'>
                <Grid item container>
                    <NameTypography user={user}/>&nbsp;
                    {(user.isTeamLead || team?.teamLead?.id === user.id) &&
                    <AdditionalText>Лидер</AdditionalText>}
                </Grid>
                <Grid item>
                    <Skills user={user}/>
                </Grid>
                <Grid item container style={{marginTop: 24, marginBottom: 24}}
                      wrap='nowrap'>
                    <Grid item container direction='column' justify='center'
                          spacing={2}>
                        <SocialLink prefix='ВКонтакте: ' site='vk.com/'
                                    value={user.settings.vk}/>
                        <SocialLink prefix='Телеграм: ' site='t.me/'
                                    value={user.settings.tg}/>
                        <SocialLink prefix='Github: ' site='github.com/'
                                    value={user.settings.gh}/>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
        <Box clone order={{xs: 2, sm: 3, md: 3}}>
            <Grid item xs={3} sm={2} md={2} container spacing={2}
                  direction='column'
                  justify='center' alignItems='center'>
                <Grid item>
                    {user.id !== cUser.id &&
                    <IconButton onClick={() => {
                        onVote()
                    }}>
                      <Box clone width={{xs: '24px', md: '48px'}}
                           height={{xs: '24px', md: '48px'}}>
                        <VoteIcon active={didVote}/>
                      </Box>
                    </IconButton>
                    }
                    {team.members.length > 0 &&
                    <AdditionalText align='center'>{team.votes?.[user.id] || 0}/{team.members.length}</AdditionalText>}
                </Grid>
                {user.id !== cUser.id &&
                <Grid item>
                  <IconButton
                    size='small' style={{margin: 'auto'}}
                    onClick={() => {
                        pModal.open({
                            onSubmit: () => {
                                onKick()
                                pModal.close()
                            },
                            message: `Исключить пользователя из команды?`,
                            accept: 'Исключить',
                            decline: 'Оставить'
                        })
                    }}>
                      {cUser.isTeamLead &&
                      <Box clone width={{xs: '24px'}}
                           height={{xs: '24px'}}><KickIcon
                        active={false}/></Box>}
                  </IconButton>
                </Grid>
                }
            </Grid>
        </Box>
    </Grid>
}