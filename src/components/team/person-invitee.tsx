import React from 'react'
import {User} from '../tools/use-app-state/user'
import {Box, Grid} from '@material-ui/core'
import {AvatarPlate} from '../common'
import {PrimaryButton} from '../common/buttons'
import {InviteButton} from '../event/invite-button'
import {NameTypography} from '../common/typography'
import {TeamDescription} from '../user/team-description'


export const PersonInvitee: React.FC<{ user: User }> = ({user}) => {
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