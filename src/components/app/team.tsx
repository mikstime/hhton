import React, {useState} from 'react'
import {
    Chip,
    Container,
    createStyles,
    Grid, IconButton,
    makeStyles,
    Theme
} from '@material-ui/core'
import {AvatarPlate, FlexSpace, SubTitle} from '../common'
import {useAppState} from '../tools/use-app-state'
import {NameTypography} from '../common/typography'
import styled from 'styled-components'
import {User} from '../tools/use-app-state/user'
import {Link} from 'react-router-dom'
import {ReactComponent as KickIcon} from '../../assets/kick.svg'
import {ReactComponent as KickActiveIcon} from '../../assets/kick_active.svg'

const RootContainer = styled(Container)`
  margin-top: 70px;
  min-height: calc(100vh - 70px);
`
const VoteIcon: React.FC<{ active: boolean }> = ({active, ...props}) => {
    return active ? <KickActiveIcon/> : <KickIcon/>
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
        <Grid container spacing={3} direction='column'>
            {cUser.team && cUser.team.members.map((u, i) => (
                <PersonInvitee key={i} user={u}/>
            ))
            }
        </Grid>
    </Grid>
    </RootContainer>
}

const TeamMember: React.FC<{user: User}> = ({user}) => {
    const [didVote, setDidVote] = useState(false)
    return <Grid item container spacing={2}>
        <Grid item md={2} xs={4}>
            <Link to={`/user/${user.id}`}
                  style={{textDecoration: 'none'}}>
                <AvatarPlate padding={12} src={user.avatar}/>
            </Link>
        </Grid>
        <Grid item xs md={6} container spacing={2} direction='column'>
            <Grid item container>
                <NameTypography user={user}/>
                <FlexSpace/>
                <IconButton>
                    <VoteIcon active={didVote}/>
                </IconButton>
            </Grid>
            <Grid item>
                <Skills user={user}/>
            </Grid>
        </Grid>
    </Grid>
}

const TeamInvitee: React.FC<{user: User}> = ({user}) => {
    const [didVote, setDidVote] = useState(false)
    return <Grid item container spacing={2}>
        <Grid item md={2} xs={4}>
            <Link to={`/user/${user.id}`}
                  style={{textDecoration: 'none'}}>
                <AvatarPlate padding={12} src={user.avatar}/>
            </Link>
        </Grid>
        <Grid item xs md={6} container spacing={2} direction='column'>
            <Grid item container>
                <NameTypography user={user}/>
                <FlexSpace/>
                <IconButton>
                    <VoteIcon active={didVote}/>
                </IconButton>
            </Grid>
            <Grid item>
                <Skills user={user}/>
            </Grid>
        </Grid>
    </Grid>
}

const PersonInvitee: React.FC<{user: User}> = ({user}) => {
    const [didVote, setDidVote] = useState(false)
    return <Grid item container spacing={2}>
        <Grid item md={2} xs={4}>
            <Link to={`/user/${user.id}`}
                  style={{textDecoration: 'none'}}>
                <AvatarPlate padding={12} src={user.avatar}/>
            </Link>
        </Grid>
        <Grid item xs md={6} container spacing={2} direction='column'>
            <Grid item container>
                <NameTypography user={user}/>
                <FlexSpace/>
                <IconButton>
                    <VoteIcon active={didVote}/>
                </IconButton>
            </Grid>
            <Grid item>
                <Skills user={user}/>
            </Grid>
        </Grid>
    </Grid>
}