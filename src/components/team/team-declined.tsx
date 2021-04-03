import React from 'react'
import {User} from '../tools/use-app-state/user'
import {Box, Chip, Grid} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {AvatarPlate} from '../common'
import {NameTypography} from '../common/typography'
import {useChipStyles} from './team-member'
import {SocialLink} from '../app/user'

const Skills: React.FC<{ user: User }> = ({user}) => {
    const classes = useChipStyles()
    return <div className={classes.root} style={{margin: '0px -8px 0px -8px'}}>
        {user.skills.tags.map((s, i) => <Chip key={s.name + i}
                                              label={s.name}/>)}
    </div>
}


export const TeamDeclined: React.FC<{ user: User }> = ({user}) => {
    return <Grid item container spacing={2} style={{
        opacity: 0.7,
        pointerEvents: 'none',
    }}>
        <Grid item md={5} xs={9} sm={5}>
            <Link to={`/user/${user.id}`}
                  style={{textDecoration: 'none'}}>
                <AvatarPlate padding={24} src={user.avatar} style={{
                    position: 'sticky',
                    top: 24,
                }}/>
            </Link>
        </Grid>
        <Box clone order={{xs: 3, sm: 2, md: 2}}>
            <Grid item xs md={5} sm={5} container spacing={2}
                  direction='column'>
                <Grid item container>
                    <NameTypography user={user}/>
                </Grid>
                <Grid item>
                    <Skills user={user}/>
                </Grid>
                <Grid item container style={{marginTop: 24, marginBottom: 24}} wrap='nowrap'>
                    <Grid item container direction='column' justify='center' spacing={2}>
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
                </Grid>
            </Grid>
        </Box>
    </Grid>
}