import React, {useState} from 'react'
import {
    Box,
    Chip,
    Container,
    createStyles,
    Grid, IconButton,
    makeStyles,
    Theme
} from '@material-ui/core'
import {AvatarPlate, SubTitle} from '../common'
import {useAppState} from '../tools/use-app-state'
import {NameTypography} from '../common/typography'
import styled from 'styled-components'
import {User} from '../tools/use-app-state/user'
import {Link} from 'react-router-dom'
import {ReactComponent as KickIcon} from '../../assets/kick.svg'
import {ReactComponent as KickActiveIcon} from '../../assets/kick_active.svg'
import {ReactComponent as ThumbsUpIcon} from '../../assets/thumbs_up.svg'
import {ReactComponent as ThumbsDownIcon} from '../../assets/thumbs_down.svg'
import {PrimaryButton} from '../common/buttons'
import {TeamDescription} from '../user/team-description'
import {InviteButton} from '../event/invite-button'

const RootContainer = styled(Container)`
  margin-top: 70px;
  min-height: calc(100vh - 70px);
`
const VoteIcon: React.FC<{ active: boolean }> = ({active, ...props}) => {
    return active ? <KickActiveIcon {...props}/> : <KickIcon {...props}/>
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
        {user.skills.tags.map((s, i) => <Chip key={s + i} label={s}/>)}
    </div>
}

export const TeamApp: React.FC = () => {

    const {cUser} = useAppState()
    return <RootContainer> <Grid container direction='column'>
        <SubTitle style={{marginBottom: 24}}>Название команды</SubTitle>
        <Grid container spacing={3} direction='column'>
            {cUser.team && cUser.team.members.map((u, i) => (
                <TeamMember key={i} user={u}/>
            ))
            }
        </Grid>
        <SubTitle style={{marginBottom: 24, marginTop: 36}}>Хотят в
            команду</SubTitle>
        <Grid container spacing={3} direction='column'>
            {cUser.team && cUser.team.members.map((u, i) => (
                <TeamInvitee key={i} user={u}/>
            ))
            }
        </Grid>
        <SubTitle style={{marginBottom: 24, marginTop: 36}}>Приглашают к
            себе</SubTitle>
        {cUser.team && <Grid spacing={2} container item>
            {
                cUser.team.members.map((u, i) => (
                    <PersonInvitee key={i} user={u}/>
                ))
            }
            {
                cUser.team.members.map((u, i) => (
                    <PersonInvitee key={i + '1'} user={u}/>
                ))
            }
        </Grid>
        }
    </Grid>
    </RootContainer>
}

const TeamMember: React.FC<{ user: User }> = ({user}) => {
    const [didVote] = useState(false)
    return <Grid item container spacing={2}>
        <Grid item md={4} xs={9} sm={4}>
            <Link to={`/user/${user.id}`}
                  style={{textDecoration: 'none'}}>
                <AvatarPlate padding={24} src={user.avatar}/>
            </Link>
        </Grid>
        <Box clone order={{xs: 3, sm: 2, md: 2}}>
            <Grid item xs sm={6} md={6} container spacing={2}
                  direction='column'>
                <Grid item container>
                    <NameTypography user={user}/>
                </Grid>
                <Grid item>
                    <Skills user={user}/>
                </Grid>
            </Grid>
        </Box>
        <Box clone order={{xs: 2, sm: 3, md: 3}}>
            <Grid item xs={3} sm={2} md={2} container spacing={2}
                  direction='column'
                  justify='center' alignItems='center'>
                <Grid item>
                    <IconButton>
                        <Box clone width={{xs: '24px', md: '48px'}}
                             height={{xs: '24px', md: '48px'}}>
                            <VoteIcon active={didVote}/>
                        </Box>
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    </Grid>
}

const TeamInvitee: React.FC<{ user: User }> = ({user}) => {
    return <Grid item container spacing={2}>
        <Grid item md={4} xs={9} sm={4}>
            <Link to={`/user/${user.id}`}
                  style={{textDecoration: 'none'}}>
                <AvatarPlate padding={24} src={user.avatar}/>
            </Link>
        </Grid>
        <Box clone order={{xs: 3, sm: 2, md: 2}}>
            <Grid item xs md={6} sm={6} container spacing={2}
                  direction='column'>
                <Grid item container>
                    <NameTypography user={user}/>
                </Grid>
                <Grid item>
                    <Skills user={user}/>
                </Grid>
            </Grid>
        </Box>
        <Box clone order={{xs: 2, sm: 3, md: 3}}>
            <Grid item xs={3} sm={2} md={2} container spacing={2}
                  direction='column'
                  justify='center' alignItems='center'>
                <Grid item>
                    <IconButton>
                        <Box clone width={{xs: '24px', md: '48px'}}
                             height={{xs: '24px', md: '48px'}}>
                            <ThumbsUpIcon/>
                        </Box>
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton>
                        <Box clone width={{xs: '24px', md: '48px'}}
                             height={{xs: '24px', md: '48px'}}>
                            <ThumbsDownIcon/>
                        </Box>
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    </Grid>
}

const PersonInvitee: React.FC<{ user: User }> = ({user}) => {
    return <Grid item container spacing={2}
                 style={{overflow: 'visible'}}>
        <Grid item container md={6} xs={9} sm={6}>
            <AvatarPlate direction='row' src={user.avatar}
                         afterChildren={
                             <Box clone paddingTop={2} flex='1'>
                                 <Grid container item xs={12}>
                                     <Box clone
                                          paddingRight={{xs: 0, sm: '22px'}}>
                                         <Grid container item xs={12} sm={8}>
                                             <PrimaryButton style={{flex: 1}}>
                                                 Объединиться
                                             </PrimaryButton>
                                         </Grid>
                                     </Box>
                                     <Box clone
                                          paddingTop={{xs: '8px', sm: 0}}>
                                         <Grid container item xs={12} sm={4}
                                               justify='center'>
                                             <InviteButton>
                                                 Отклонить
                                             </InviteButton>
                                         </Grid>
                                     </Box>
                                 </Grid>
                             </Box>}
                         avatarProps={{wrap: 'nowrap', xs: 12, sm: 8}}>
                <Grid xs sm={4} item container
                      direction='column'>
                    <Grid item container justify='center'>
                        <NameTypography user={user}/>
                    </Grid>
                    <TeamDescription noName user={user}/>
                </Grid>
            </AvatarPlate>
        </Grid>
        <Grid item container md={6} xs={12} sm={6}>
        </Grid>
    </Grid>
}