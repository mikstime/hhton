import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {
    AvatarPlate,
    GrayPlate,
    Title, FlexSpace
} from '../common'
import {useAppState} from '../tools/use-app-state'
import styled from 'styled-components'
import {BoldText, CaptionText, SecondaryText} from '../common/typography'
import {BioPlate, InfoPlate, JobPlate} from '../common/item-plate'

const UserNameGrid = styled(Grid)`
  padding: 12px 0 0 12px !important;
`
export const UserApp: React.FC = () => {

    const {user} = useAppState()

    return <Grid container direction='column'>
        <Grid item container spacing={2}>
            <Grid item container md={4}>
                <AvatarPlate src={user.avatar}>
                    avatar (user id: {user.id})
                </AvatarPlate>
            </Grid>
            <Grid item container md spacing={3} direction='column'>
                <UserNameGrid item>
                    <Typography>
                        {user.firstName} {user.lastName}
                    </Typography>
                </UserNameGrid>
                <Grid item>
                    <JobPlate text={`Место работы: ${user.jobName}`}/>
                </Grid>
                <Grid item>
                    <BioPlate text={user.bio}/>
                </Grid>
                <Grid item>
                    <InfoPlate textPlate={CaptionText}
                               text='Подробная информация'/>
                </Grid>
            </Grid>
        </Grid>
        <Grid item container>
            <Grid item container direction='column' md>
                <Grid item>
                    <Title>
                        Профессиональные навыки
                    </Title>
                </Grid>
                <Grid item>
                    <SecondaryText>
                        {user.skills.description}
                    </SecondaryText>
                </Grid>
            </Grid>
            <Grid item xs md={5} container wrap='nowrap'>
                <FlexSpace/>
                <Grid item>
                    <GrayPlate>
                        <Grid container spacing={1}>
                            {user.skills.tags.map((e, i) => <Grid
                                item><BoldText
                                key={i}>{e}</BoldText></Grid>)}
                        </Grid>
                    </GrayPlate>
                </Grid>
            </Grid>
        </Grid>
        <Grid item container direction='column'>
            <Grid item>
                <Title>
                    Участие в хакатонах
                </Title>
            </Grid>
            <Grid item container>
                {user.hackathons.join(' ')}
            </Grid>
        </Grid>
    </Grid>
}