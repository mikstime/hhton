import React, {useEffect} from 'react'
import {
    Box,
    Grid,
    GridProps
} from '@material-ui/core'
import {
    AvatarPlate,
    GrayPlate,
    Title, FlexSpace
} from '../common'
import {useAppState} from '../tools/use-app-state'
import styled from 'styled-components'
import {
    BoldText,
    NameTypography,
    SecondaryText
} from '../common/typography'
import {BioPlate, JobPlate} from '../common/item-plate'
import {UniteButton} from '../user/unite-button'
import {NotFound} from './notfound'
import {useParams} from 'react-router-dom'
import notFoundIcon from '../../assets/notfound.svg'
import {TeamDescription} from '../user/team-description'
import {EditUserButton} from '../user/edit-user-button'

const UserNameGrid = styled(Grid)`
  padding: 12px 0 0 12px !important;
`


export const UserApp: React.FC<GridProps> = ({...rest}) => {
    //@ts-ignore
    const {userId} = useParams()
    const {user, event, cUser} = useAppState()

    useEffect(() => {
        if (userId) {
            user.change({id: userId})
        } else {
            if(cUser.id !== '-1') {
                user.change({id: cUser.id.toString()})
            }
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, cUser.id, event.id])

    if (user.notFound) {
        return <NotFound
            title='Пользователь не найден'
            message='Попробуйте поискать в другом месте'
            icon={notFoundIcon}
        />
    }

    return <Grid container direction='column' {...rest}>
            <Grid item container spacing={2}>
                <Grid item container md={5}>
                    <AvatarPlate src={user.avatar}>
                        <UniteButton/>
                        <TeamDescription user={user}/>
                    </AvatarPlate>
                </Grid>
                <Grid item container md spacing={2} direction='column'>
                    <UserNameGrid item container alignItems='center'>
                        <NameTypography user={user}/>
                        <Box clone marginLeft='12px'>
                        <EditUserButton/>
                        </Box>
                    </UserNameGrid>
                    <Grid item>
                        <JobPlate text={user.jobName ? `Место работы: ${user.jobName}`: ''}/>
                    </Grid>
                    <Grid item>
                        <BioPlate text={user.bio}/>
                    </Grid>
                    {/*<Grid item>*/}
                    {/*    <InfoPlate textPlate={CaptionText}*/}
                    {/*               text='Подробная информация'/>*/}
                    {/*</Grid>*/}
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
                                    key={i} item>
                                    <BoldText>{e}</BoldText>
                                </Grid>)}
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