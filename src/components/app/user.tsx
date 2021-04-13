import React, {useCallback, useEffect} from 'react'
import {
    Box,
    Grid,
    GridProps, useTheme
} from '@material-ui/core'
import {
    AvatarPlate,
    Title, GrayishPlate, AdditionalText, FlexSpace
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
import {UserEvents} from '../user/events'
import {useHistory, useLocation} from 'react-router-dom'
import {FillPrompt} from '../user/fill-prompt'

const UserNameGrid = styled(Grid)`
  padding: 12px 0 0 12px !important;
`

export const SocialLink: React.FC<{ prefix?: string, site?: string, value: string }> = ({prefix = '', site = '', value}) => {
    const theme = useTheme()
    if (!value) return null
    return <Grid item>
        <Box clone textAlign={{md: 'center'}}>
            <AdditionalText style={{marginLeft: 4}}>{prefix}
                <a target='_blank' style={{
                    textDecoration: 'none',
                    color: theme.palette.primary.main
                }}
                   href={`https://${site}${value}`}>{site}{value}</a></AdditionalText>
        </Box>
    </Grid>
}

export const UserApp: React.FC<GridProps> = ({...rest}) => {
    //@ts-ignore
    const {userId} = useParams()
    const {user, cEvent, cUser} = useAppState()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const location = useLocation()
    const onAvatarChange = useCallback(() => {
        editUserAvatar(user.id).then(result => {
            if (!result) {
                enqueueSnackbar('Не удалось обновить аватар', {
                    variant: 'error'
                })
            } else {
                cUser.change({avatar: result})
                user.change({avatar: result})
            }
        })

    }, [cUser])

    useEffect(() => {
        if (userId) {
            user.change({id: userId})
        } else {
            if (cUser.id !== '-1' && !location.pathname.startsWith('/feed')) {
                user.change({id: cUser.id})
            }
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, cUser.id, cEvent.id])

    useEffect(() => {
        if (!userId && cUser.isNotAuthorized) {
            history.push('/')
        }
    }, [cUser.isNotAuthorized])
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
                <Grid item xs>
                    <AvatarPlate src={user.avatar}
                                 editable={user.id === cUser.id}
                                 onEdit={onAvatarChange}
                                 style={{position: 'sticky', top: 24}}>
                        <UniteButton/>
                        <TeamDescription user={user}/>
                    </AvatarPlate>
                </Grid>
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
                    {(user.isNullUser || user.skills.description.length > 0)
                    && <BioPlate text={user.skills.description}/>}
                </Grid>
                {(user.isNullUser || user.skills.tags.length > 0)
                && <Grid item container>
                  <Grid item container>
                    <GrayishPlate>
                      <Grid container spacing={1}
                            style={{minHeight: 32}}>
                          {user.skills.tags.map((e, i) => <Grid
                              key={i} item>
                              <BoldText>{e.name}</BoldText>
                          </Grid>)}
                      </Grid>
                    </GrayishPlate>
                  </Grid>
                </Grid>
                }
                <FillPrompt/>
                <FlexSpace/>
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
                <FlexSpace/>
            </Grid>
        </Grid>
        {user.bio && <Grid item container direction='column'>
          <Grid item>
            <Title>
              О себе
            </Title>
          </Grid>
          <Grid item>
            <SecondaryText>
                {user.bio}
            </SecondaryText>
          </Grid>
        </Grid>
        }
        {
            user.hackathons.length > 0 &&
            <Grid item container direction='column'> <Grid item>
              <Title>
                Победы в хакатонах
                <span
                  style={{color: '#818C99'}}>{cUser.hackathons.length}</span>
              </Title>
            </Grid>
              <Grid item>
                <UserEvents/>
              </Grid>
            </Grid>
        }
        <div style={{height: 32}}/>
    </Grid>
}