import React, {useState} from 'react'
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
import {AvatarPlate} from '../common'
import {NameTypography} from '../common/typography'
import {ReactComponent as KickActiveIcon} from '../../assets/kick_active.svg'
import {ReactComponent as KickIcon} from '../../assets/kick.svg'


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


export const TeamMember: React.FC<{ user: User }> = ({user}) => {
    const [didVote] = useState(false)
    return <Grid item container spacing={2}>
        <Grid item md={5} xs={9} sm={5}>
            <Link to={`/user/${user.id}`}
                  style={{textDecoration: 'none'}}>
                <AvatarPlate padding={24} src={user.avatar}/>
            </Link>
        </Grid>
        <Box clone order={{xs: 3, sm: 2, md: 2}}>
            <Grid item xs sm={5} md={5} container spacing={2}
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