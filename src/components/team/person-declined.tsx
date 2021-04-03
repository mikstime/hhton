import React from 'react'
import {User} from '../tools/use-app-state/user'
import {Box, Chip, Grid} from '@material-ui/core'
import {AvatarPlate} from '../common'
import {NameTypography} from '../common/typography'
import {TeamDescription} from '../user/team-description'
import {useChipStyles} from './team-member'
import {SocialLink} from '../app/user'


const Skills: React.FC<{ user: User }> = ({user}) => {
    const classes = useChipStyles()
    return <div className={classes.root} style={{margin: '0px -8px 0px -8px'}}>
        {user.skills.tags.map((s, i) => <Chip key={s.name + i}
                                              label={s.name}/>)}
    </div>
}


export const PersonDeclined: React.FC<{ user: User }> = ({user}) => {


    return <Grid item container spacing={2}
                 style={{
                     overflow: 'visible',
                     opacity: 0.7, pointerEvents: 'none'
                 }}>
        <Grid item container md={8} xs={12} sm={12}>
            <AvatarPlate direction='row' src={user.avatar}
                         avatarProps={{wrap: 'nowrap', xs: 12, sm: 6, md: 7}}>
                <Grid xs sm={6} md={5} item container
                      direction='column'>
                    <Box paddingLeft={{xs: 0, sm: 2}}
                         marginTop={{xs: 1, md: 0}}>
                        <Grid item container>
                            <NameTypography user={user}/>
                        </Grid>
                    </Box>
                    <Box paddingLeft={{xs: 0, sm: 2}}>
                        <TeamDescription noName user={user}/>
                    </Box>
                </Grid>
            </AvatarPlate>
        </Grid>
        <Grid item container md={4} xs={12} sm={6}>
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
    </Grid>
}