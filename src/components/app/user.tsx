import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {GrayPlate, Plate, SecondaryText, Title} from '../common'
import {useAppState} from '../tools/use-app-state'

export const UserApp: React.FC = () => {

    const {user} = useAppState()

    return <Grid container direction='column'>
        <Grid item container alignItems='stretch'>
            <Plate item md={4}>
                avatar (user id: {user.id})
            </Plate>
            <Grid item container md spacing={1} direction='column'>
                <Plate item>
                    <Typography>
                        Место работы: {user.jobName}
                    </Typography>
                </Plate>
                <Plate item>
                    <Typography>
                    {user.bio}
                    </Typography>
                </Plate>
                <Plate item>
                    <Typography>
                    Подробная информация
                    </Typography>
                </Plate>
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
            <GrayPlate item md={5}>
                {user.skills.tags.join(' ')}
            </GrayPlate>
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