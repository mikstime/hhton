import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {
    Box,
    Container,
    Grid,
    GridProps, Hidden,
    Typography
} from '@material-ui/core'
import {PrimaryButton} from '../common/buttons'
import {HOST_DOMAIN, PREFIX} from '../../config/network'
import {AdditionalText} from '../common'
import Image from 'material-ui-image'
// import whiteLogo from '../../assets/home/white_logo.png'
import {Hackathon} from '../tools/use-app-state/hackathon'
import {getTopEvents} from '../../model/api'
import {format} from 'date-fns'
import {useAppState} from '../tools/use-app-state'
import {Link} from 'react-router-dom'

const Root = styled.div`
  width: 100%;
  height: 100%;
`

const EventItem: React.FC<{ event: Hackathon }> = ({event}) => {

    return <Box clone paddingTop={1}><Grid item container>
        <Grid item style={{width: 64}}>
            <Link to={`/event/${event.id}`}>
                <Image src={event.logo} style={{
                    width: 64,
                    paddingTop: 64,
                    borderRadius: 4
                }} imageStyle={{
                    width: 64,
                    height: 64,
                    objectFit: 'cover',
                    borderRadius: 4
                }}/>
            </Link>
        </Grid>
        <Box clone paddingLeft={2}>
            <Grid xs item container direction='column'>
                <Link to={`/event/${event.id}`}
                      style={{textDecoration: 'none'}}>
                    <Typography>{event.name}</Typography>
                </Link>
                <Link to={`/event/${event.id}`}
                      style={{textDecoration: 'none'}}>
                    <AdditionalText>{event.description}</AdditionalText>
                </Link>
            </Grid>
        </Box>
        <Hidden smDown>
            <Box clone display='flex' alignItems='center'>
                <Grid item>
                    <Link to={`/event/${event.id}`}
                          style={{textDecoration: 'none'}}>
                        <Typography style={{width: 100}} align='center'>
                            {event.settings.start ? format(event.settings.start, 'dd/MM/yyyy') : '–'}
                        </Typography>
                    </Link>
                </Grid>
            </Box>
        </Hidden>
    </Grid>
    </Box>
}
const EventsList: React.FC<GridProps> = (props) => {
    const [events, setEvents] = useState<Hackathon[]>([])

    useEffect(() => {
        (async () => {
            const events = await getTopEvents()
            setEvents([...events])
        })()
    }, [])

    const eventsRender = events.length > 0 ? events.map((e, i) => <EventItem
            key={i}
            event={e}/>) :
        <AdditionalText align='center'>
            Нет доступных мероприятий
        </AdditionalText>

    return <Grid item container direction='column' {...props}>
        <Box clone paddingBottom={1}>
            <Grid item container wrap='nowrap' alignItems='center'>
                <Grid xs item>
                    <Typography style={{fontSize: '1.25rem'}}>
                        Доступные мероприятия
                    </Typography>
                </Grid>
                <Hidden smDown>
                    <Grid item style={{width: 100}}>
                        <AdditionalText align='center'>
                            Дата начала
                        </AdditionalText>
                    </Grid>
                </Hidden>
            </Grid>
        </Box>
        {eventsRender}
    </Grid>
}

const SignupSection: React.FC<GridProps> = (props) => {
    const {cUser} = useAppState()

    if (cUser.id === '-1' && !cUser.isLoading) {
        return <Box clone
                    alignItems={{xs: 'start', md: 'center'}}>
            <Grid item
                  container
                  direction='column'
                  {...props}>
                <Box clone position='sticky' top='70px'>
                    <a
                        href={`${HOST_DOMAIN}${PREFIX}/redirect?backTo=user`}
                        style={{textDecoration: 'none', marginTop: 16}}>
                        <PrimaryButton>
                            Войти через ВКонтакте
                        </PrimaryButton>
                    </a>
                </Box>
                <Box flex={1}/>
            </Grid>
        </Box>
    }
    return null
}
export const HomeApp: React.FC = () => {
    // const theme = useTheme()
    return <Root>
        <Container>
            <Grid style={{minHeight: '60vh'}} container direction='column'
                  justify='center'>
                <Grid item>
                    <Typography style={{fontSize: '3rem'}}>
                        <b>Найди лучшую команду</b>
                    </Typography>
                    <Typography style={{fontSize: '1.25rem'}}>
                        А мы поможем тебе в этом. <i>Начни с выбора
                        мероприятия.</i>
                    </Typography>
                    {/*<Typography style={{fontSize: '1.25rem'}}>*/}
                    {/*    Елизаров Олег – Golang, PostgreSQL (Backend разработчик)*/}
                    {/*</Typography>*/}
                    {/*<Typography style={{fontSize: '1.25rem'}}>*/}
                    {/*    Куклин Сергей - Golang, JS (Fullstack разработчик)*/}
                    {/*</Typography>*/}
                </Grid>
                {/*<Grid item>*/}
                {/*    <Plate style={{*/}
                {/*        backgroundColor: theme.palette.primary.main,*/}
                {/*        marginTop: 24*/}
                {/*    }} padding={16}>*/}
                {/*        <Box clone flexDirection={{xs: 'column', md: 'row'}}>*/}
                {/*            <Grid container alignItems='center' spacing={2}>*/}
                {/*                <Hidden smDown>*/}
                {/*                    <Box clone*/}
                {/*                         justifyContent={{*/}
                {/*                             xs: 'center',*/}
                {/*                             md: 'start'*/}
                {/*                         }}>*/}
                {/*                        <Grid item container xs>*/}
                {/*                            <Image src={whiteLogo} style={{*/}
                {/*                                backgroundColor: 'transparent',*/}
                {/*                                width: 150,*/}
                {/*                                paddingTop: 56*/}
                {/*                            }} imageStyle={{*/}
                {/*                                height: 56,*/}
                {/*                                width: 150*/}
                {/*                            }}/>*/}
                {/*                        </Grid>*/}
                {/*                    </Box>*/}
                {/*                </Hidden>*/}
                {/*                <Box clone alignItems={{*/}
                {/*                    xs: 'center',*/}
                {/*                    md: 'flex-end'*/}
                {/*                }}>*/}
                {/*                    <Grid item xs container direction='column'>*/}
                {/*                        <Typography variant='body1'><a*/}
                {/*                            target='_blank'*/}
                {/*                            href='https://vk.com/teamuponline'*/}
                {/*                            style={{*/}
                {/*                                color: 'white',*/}
                {/*                                textDecoration: 'none'*/}
                {/*                            }}>*/}
                {/*                            vk.com/teamuponline</a></Typography>*/}
                {/*                        <Typography variant='body1'><a*/}
                {/*                            target='_blank'*/}
                {/*                            href='https://t.me/teamuponline'*/}
                {/*                            style={{*/}
                {/*                                color: 'white',*/}
                {/*                                textDecoration: 'none'*/}
                {/*                            }}>*/}
                {/*                            t.me/teamuponline</a></Typography>*/}
                {/*                        <Typography variant='body1'><a*/}
                {/*                            target='_blank'*/}
                {/*                            href='https://github.com/teamuponline'*/}
                {/*                            style={{*/}
                {/*                                color: 'white',*/}
                {/*                                textDecoration: 'none'*/}
                {/*                            }}>*/}
                {/*                            github.com/teamuponline</a></Typography>*/}
                {/*                    </Grid>*/}
                {/*                </Box>*/}
                {/*            </Grid>*/}
                {/*        </Box>*/}
                {/*    </Plate>*/}
                {/*</Grid>*/}
                <Box clone flexDirection={{xs: 'column', md: 'row'}}>
                    <Grid item container>
                        <Box clone paddingTop={3}>
                            <EventsList xs md={8}/>
                        </Box>
                        <Box clone paddingTop={{xs: 3, md: 2}}>
                            <SignupSection xs md={4}/>
                        </Box>
                    </Grid>
                </Box>
            </Grid>
        </Container>
        <div style={{height: 100}}/>
    </Root>
}