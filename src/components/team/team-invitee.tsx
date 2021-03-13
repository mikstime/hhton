import React from 'react'
import {User} from '../tools/use-app-state/user'
import {Box, Grid, IconButton} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {AvatarPlate} from '../common'
import {NameTypography} from '../common/typography'
import {ReactComponent as ThumbsUpIcon} from '../../assets/thumbs_up.svg'
import {ReactComponent as ThumbsDownIcon} from '../../assets/thumbs_down.svg'


export const TeamInvitee: React.FC<{ user: User }> = ({user}) => {
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