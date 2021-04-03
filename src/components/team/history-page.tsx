import React, {Fragment} from 'react'
import {
    Divider, Grid,
} from '@material-ui/core'
import {AdditionalText, GrayPlate, SubTitle} from '../common'
import {useAppState} from '../tools/use-app-state'
import {TeamInvitee} from './team-invitee'

export const HistoryPage: React.FC = () => {

    const {invites} = useAppState()

    return <Grid container direction='column'>
        <SubTitle style={{marginBottom: 24}}>Отклоненные заявки</SubTitle>
        <Grid container spacing={3} direction='column'>
            {invites.personal.map((u, i) => (
                <Fragment key={i}>
                    <TeamInvitee user={u}/>
                    <Divider light flexItem style={{height: 1}}/>
                </Fragment>
            ))
            }
        </Grid>
        {!invites.personal.length && <GrayPlate style={{marginTop: 16}}>
          <AdditionalText>
              Здесь будут отображаться заявки, которые отклонила Ваша команда,
              или же отклонил адресат
          </AdditionalText>
        </GrayPlate>
        }
    </Grid>
}