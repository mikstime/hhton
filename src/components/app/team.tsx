import React from 'react'
import {
    Chip,
    Container,
    createStyles,
    Grid,
    makeStyles,
    Theme
} from '@material-ui/core'
import {AvatarPlate, SubTitle} from '../common'
import {useAppState} from '../tools/use-app-state'
import {NameTypography} from '../common/typography'
import styled from 'styled-components'
import {User} from '../tools/use-app-state/user'
import {Link} from 'react-router-dom'

const RootContainer = styled(Container)`
  margin-top: 70px;
  min-height: calc(100vh - 70px);
`

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

const Person: React.FC<{ user: User }> = ({user}) => {
    return <Grid item container spacing={2}>
        <Grid item md={2} xs={4}>
            <Link to={`/user/${user.id}`}
                  style={{textDecoration: 'none'}}>
                <AvatarPlate padding={12} src={user.avatar}/>
            </Link>
        </Grid>
        <Grid item xs md={6} container spacing={2} direction='column'>
            <Grid item>
                <NameTypography user={user}/>
            </Grid>
            <Grid item>
                <Skills user={user}/>
            </Grid>
        </Grid>
    </Grid>
}
export const TeamApp: React.FC = () => {

    const {cUser} = useAppState()
    return <RootContainer> <Grid container direction='column'>
        <SubTitle style={{marginBottom: 24}}>Название команды</SubTitle>
        <Grid container spacing={3} direction='column'>
            {cUser.team && cUser.team.members.map((u, i) => (
                <Person key={i} user={u}/>
            ))
            }
        </Grid>
        <SubTitle style={{marginBottom: 24, marginTop: 36}}>Хотят в команду</SubTitle>
        <Grid container spacing={3} direction='column'>
            {cUser.team && cUser.team.members.map((u, i) => (
                <Person key={i} user={u}/>
            ))
            }
        </Grid>
        <SubTitle style={{marginBottom: 24, marginTop: 36}}>Приглашают к себе</SubTitle>
        <Grid container spacing={3} direction='column'>
            {cUser.team && cUser.team.members.map((u, i) => (
                <Person key={i} user={u}/>
            ))
            }
        </Grid>
    </Grid>
    </RootContainer>
}