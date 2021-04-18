import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import {
    Box,
    Container,
    Grid,
    GridProps, Hidden, IconButton,
    Typography, useTheme
} from '@material-ui/core'
import {PrimaryButton} from '../common/buttons'
import {HOST_DOMAIN, PREFIX} from '../../config/network'
import {AdditionalText, GrayPlate, Plate} from '../common'
import Image from 'material-ui-image'
import {ReactComponent as BackIcon} from '../../assets/home/back.svg'
import {ReactComponent as ForwardIcon} from '../../assets/home/forward.svg'
import {ReactComponent as BackIconW} from '../../assets/home/back-w.svg'
import {ReactComponent as ForwardIconW} from '../../assets/home/forward-w.svg'
import imageOne from '../../assets/home/image-1.svg'
import imageTwo from '../../assets/home/image-2.svg'
import imageThree from '../../assets/home/image-3.svg'
import imageOneW from '../../assets/home/image-1-w.svg'
import imageTwoW from '../../assets/home/image-2-w.svg'
import imageThreeW from '../../assets/home/image-3-w.svg'
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
        <Box>
            <GrayPlate>
                <AdditionalText>
                    Нет доступных мероприятий
                </AdditionalText>
            </GrayPlate>
        </Box>

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
                            {events.length > 0 ? 'Дата начала' : ''}
                        </AdditionalText>
                    </Grid>
                </Hidden>
            </Grid>
        </Box>
        {eventsRender}
    </Grid>
}


const Images: React.FC = () => {
    const images = useRef([
        [imageOne, 'Умный поиск',
            <Typography align='center' variant='body2'>Находите членов команды и
                объединяйтесь с другими командами во
                вкладке <b>Поиск участников</b></Typography>],
        [imageTwo, 'Объединяйтесь в команды',
            <Typography align='center' variant='body2'>Во
                вкладке <b>команда</b> можно управлять входящими и исходящими
                заявками</Typography>],
        [imageThree, 'Голосуйте за лидера команды',
            <Typography align='center' variant='body2'>Лидер команды может
                управлять заявками и командой</Typography>]
    ])

    const [index, setIndex] = useState(0)
    const theme = useTheme()

    return <Grid item xs={12} sm={6} md={12} container direction='column'>
        <Grid item container alignItems='center' wrap='nowrap'>
            <Grid item>
                <IconButton disabled={index <= 0}
                            style={{opacity: index <= 0 ? 0.3 : 1}}
                            onClick={() => {
                                setIndex(index - 1)
                            }}>
                    <BackIcon/>
                </IconButton>
            </Grid>
            <Image style={{
                borderRadius: '50%',
                width: '100%',
                overflow: 'hidden',
                paddingTop: 'calc( 100% - 96px)',
                backgroundColor: 'transparent',
                shadow: theme.shadows[4]
            }}
                   imageStyle={{
                       borderRadius: '50%',
                       width: '100%',
                       height: '100%',
                       transform: 'scale(1.9)'
                   }}
                   src={images.current[index][0] as string}/>
            <Grid item>
                <IconButton disabled={index >= images.current.length - 1}
                            style={{opacity: index >= images.current.length - 1 ? 0.3 : 1}}
                            onClick={() => {
                                setIndex(index + 1)
                            }}>
                    <ForwardIcon/>
                </IconButton>
            </Grid>
        </Grid>
        <Grid item container xs direction='column'>
            <Grid item>
                <Typography align='center' style={{fontSize: '1.25em'}}>
                    {images.current[index][1]}
                </Typography>
                {images.current[index][2]}
            </Grid>
        </Grid>
    </Grid>
}

const ImagesWide: React.FC = () => {
    const images = useRef([
        [imageOneW, 'Умный поиск',
            <Typography align='center' variant='body2'>Находите членов команды и
                объединяйтесь с другими командами во
                вкладке <b>Поиск участников</b></Typography>],
        [imageTwoW, 'Объединяйтесь в команды',
            <Typography align='center' variant='body2'>Во
                вкладке <b>команда</b> можно управлять входящими и исходящими
                заявками</Typography>],
        [imageThreeW, 'Голосуйте за лидера команды',
            <Typography align='center' variant='body2'>Лидер команды может
                управлять заявками и командой</Typography>]
    ])

    const [index, setIndex] = useState(0)
    const theme = useTheme()

    return <Grid item container direction='column'>
        <Grid item container alignItems='center' wrap='nowrap'>
            <Grid item>
                <IconButton disabled={index <= 0}
                            size='small'
                            style={{opacity: index <= 0 ? 0.3 : 1, zIndex: 2}}
                            onClick={() => {
                                setIndex(index - 1)
                            }}>
                    <BackIconW/>
                </IconButton>
            </Grid>
            <Grid item container xs>
                <Image style={{
                    width: 'calc(100% + 60px)',
                    marginLeft: '-30px',
                    marginRight: '-30px',
                    overflow: 'hidden',
                    paddingTop: 'max(200px, calc( (100% - 60px) / 2))',
                    backgroundColor: 'transparent',
                    shadow: theme.shadows[4],
                }}
                       imageStyle={{
                           width: '100%',
                           height: '100%',
                           transform: 'scale(1.9)',
                           objectFit: 'cover',
                           borderRadius: 10
                       }}
                       src={images.current[index][0] as string}/>
            </Grid>
            <Grid item>
                <IconButton disabled={index >= images.current.length - 1}
                            size='small'
                            style={{opacity: index >= images.current.length - 1 ? 0.3 : 1, zIndex: 2}}
                            onClick={() => {
                                setIndex(index + 1)
                            }}>
                    <ForwardIconW/>
                </IconButton>
            </Grid>
        </Grid>
        <Grid item container xs direction='column'>
            <Grid item>
                <Typography align='center' style={{
                    fontSize: '1.25em',
                    padding: '0 24px 0 24px'
                }}>
                    {images.current[index][1]}
                </Typography>
                <Box style={{padding: '0 30px 0 30px'}}>
                    {images.current[index][2]}
                </Box>
            </Grid>
        </Grid>
    </Grid>
}
const SignupSection: React.FC<GridProps> = (props) => {
    const {cUser} = useAppState()

    return <Box clone
                alignItems={{xs: 'start', md: 'center'}}>
        <Grid item
              container
              direction='column'
              {...props}>
            <Grid item container justify='center'>
                <Hidden smDown>
                    <Images/>
                </Hidden>
            </Grid>
            {cUser.id === '-1' && !cUser.isLoading &&
            <Box clone position='sticky' top='70px'>
              <a
                href={`${HOST_DOMAIN}${PREFIX}/redirect?backTo=user`}
                style={{textDecoration: 'none', marginTop: 16}}>
                <PrimaryButton>
                  Войти через ВКонтакте
                </PrimaryButton>
              </a>
            </Box>
            }
        </Grid>
    </Box>
}
export const HomeApp: React.FC = () => {
    // const theme = useTheme()
    return <Grid container direction='column' wrap='nowrap'>
        <Grid item>
            <Typography style={{fontSize: '3rem'}}>
                <b>Найди лучшую команду</b>
            </Typography>
            <Typography style={{fontSize: '1.25rem'}}>
                А мы поможем тебе в этом. <i>Начни с выбора
                мероприятия.</i>
            </Typography>
            <Hidden mdUp>
                <Box clone marginTop='16px' padding='0px 0px 16px 0px' borderRadius='10px' overflow='hidden'>
                    <Plate elevation={4}>
                        <ImagesWide/>
                    </Plate>
                </Box>
            </Hidden>
        </Grid>
        <Box clone flexDirection={{xs: 'column', md: 'row'}}>
            <Grid item container>
                <Box clone paddingTop={3}>
                    <EventsList xs md={8}/>
                </Box>
                <Box clone paddingTop={{xs: 3, md: 2}} order={{
                    xs: 1, sm: 2
                }}>
                    <SignupSection xs md={4}/>
                </Box>
            </Grid>
        </Box>
        <div style={{height: 100}}/>
    </Grid>
}