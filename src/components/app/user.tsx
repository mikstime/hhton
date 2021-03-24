import React, {useCallback, useEffect} from 'react'
import {
    Box,
    Grid,
    GridProps, Hidden, useTheme
} from '@material-ui/core'
import {
    AvatarPlate,
    Title, FlexSpace, GrayishPlate, AdditionalText
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
import {editUserAvatar} from '../tools/edit-images'
import {useSnackbar} from 'notistack'

const UserNameGrid = styled(Grid)`
  padding: 12px 0 0 12px !important;
`

const SocialLink: React.FC<{ prefix?: string, site?: string, value: string }> = ({prefix = '', site = '', value}) => {
    const theme = useTheme()
    if (!value) return null
    return <Grid item>
        <AdditionalText style={{marginLeft: 16 + 36}}>{prefix}
            <a target='_blank' style={{
                textDecoration: 'none',
                color: theme.palette.primary.main
            }}
               href={`https://${site}${value}`}>{site}{value}</a></AdditionalText>
    </Grid>
}

export const UserApp: React.FC<GridProps> = ({...rest}) => {
    //@ts-ignore
    const {userId} = useParams()
    const {user, cEvent, cUser} = useAppState()
    const {enqueueSnackbar} = useSnackbar()

    const onAvatarChange = useCallback(async () => {
        let img = 'Пусто'
        await editUserAvatar(user.id).then(result => img = result)

        if (!img) {
            enqueueSnackbar('Не удалось обновить аватар', {
                variant: 'error'
            })
        } else {
            cUser.change({avatar: img})
            user.change({avatar: img})
        }
    }, [cUser])

    useEffect(() => {
        if (userId) {
            user.change({id: userId})
        } else {
            if (cUser.id !== '-1') {
                user.change({id: cUser.id})
            }
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, cUser.id, cEvent.id])
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
                <AvatarPlate src={user.avatar}
                             editable={user.id === cUser.id}
                             onEdit={onAvatarChange}>
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
                    {(user.isNullUser || user.jobName.length > 0)
                    && <JobPlate
                      text={user.jobName ? `Место работы: ${user.jobName}` : ''}/>
                    }
                </Grid>
                <Grid item>
                    {(user.isNullUser || user.bio.length > 0)
                    && <BioPlate text={user.bio}/>}
                </Grid>
                <Grid item container direction='column' spacing={2}
                      style={{marginTop: 8}}>
                    <SocialLink prefix='ВКонтакте: ' site='vk.com/'
                                value={user.settings.vk}/>
                    <SocialLink prefix='Телеграм: ' site='t.me/'
                                value={user.settings.tg}/>
                    <SocialLink prefix='Github: ' site='github.com/'
                                value={user.settings.gh}/>
                </Grid>
            </Grid>
        </Grid>
        <Grid item container>
            <Grid item container direction='column' md>
                <Grid item>
                    <Title>
                        Навыки
                        <Hidden smDown>
                            <Box clone marginLeft='12px'>
                                <EditUserButton/>
                            </Box>
                        </Hidden>
                    </Title>
                </Grid>
                <Grid item>
                    <SecondaryText>
                        {user.skills.description || 'Пользователь не указал данные о своих профессиональных навыках'}
                    </SecondaryText>
                </Grid>
            </Grid>
            <Grid item xs md={5} container wrap='nowrap'>
                <FlexSpace/>
                <Grid item>
                    <GrayishPlate>
                        <Grid container spacing={1}>
                            {user.skills.tags.map((e) => <Grid
                                key={e.id} item>
                                <BoldText>{e.name}</BoldText>
                            </Grid>)}
                        </Grid>
                    </GrayishPlate>
                </Grid>
            </Grid>
        </Grid>
        <Grid item container direction='column'>
            <Grid item>
                <Title>
                    Участие в хакатонах
                </Title>
            </Grid>
            <Grid item>
                <SecondaryText>
                    Скоро
                </SecondaryText>
            </Grid>
            <div style={{height: 32}}/>
        </Grid>
    </Grid>
}