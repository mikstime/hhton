import React, {useEffect, useRef, useState} from 'react'
import {
    Box,
    Grid,
    GridProps, Hidden, IconButton,
    Typography, useTheme
} from '@material-ui/core'
import {PrimaryButton} from '../common/buttons'
import {HOST_DOMAIN, PREFIX} from '../../config/network'
import {AdditionalText, GrayishPlate, GrayPlate, Plate} from '../common'
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

const EventItem: React.FC<{ event: Hackathon }> = ({event}) => {

    return <Box clone paddingTop={1}>
        <Grid item xs>
            <Link to={`/event/${event.id}`}
                  style={{textDecoration: 'none', width: '100%'}}>
                <GrayishPlate padding={8}>
                    <Grid item container xs>
                        <Grid item style={{width: 48}}>
                            <Image src={event.logo} style={{
                                width: 48,
                                paddingTop: 48,
                                borderRadius: 4
                            }} imageStyle={{
                                width: 48,
                                height: 48,
                                objectFit: 'cover',
                                borderRadius: 4
                            }}/>
                        </Grid>
                        <Box clone paddingLeft={1}>
                            <Grid xs item container direction='column'>
                                <Typography>{event.name}</Typography>
                                <AdditionalText
                                    style={{wordBreak: 'break-all'}}>
                                    {event.description.length > 100 ?
                                        event.description.slice(0, 97) + '...' : event.description}
                                </AdditionalText>
                            </Grid>
                        </Box>
                        <Hidden smDown>
                            <Box clone display='flex' alignItems='center'>
                                <Grid item>
                                    <Typography style={{width: 100}}
                                                align='center'>
                                        {event.settings.start ? format(event.settings.start, 'dd/MM/yyyy') : '–'}
                                    </Typography>
                                </Grid>
                            </Box>
                        </Hidden>
                    </Grid>
                </GrayishPlate>
            </Link>
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
            <AdditionalText>
                Нет доступных мероприятий
            </AdditionalText>
        </Box>

    return <Grid item container {...props}>
        <Plate padding={16} elevation={4}>
            <Grid container direction='column'>
                <Box clone>
                    <Grid item container wrap='nowrap' alignItems='center'>
                        <Grid xs item>
                            <Typography>
                                Доступные мероприятия
                            </Typography>
                        </Grid>
                        <Hidden smDown>
                            <Grid item style={{width: 100}}>
                                <Typography variant='body1'
                                            color='textSecondary'
                                            align='center'>
                                    {events.length > 0 ? 'Дата начала' : ''}
                                </Typography>
                            </Grid>
                        </Hidden>
                    </Grid>
                </Box>
                {eventsRender}
            </Grid>
        </Plate>
    </Grid>
}


const Images: React.FC = () => {
    const images = useRef([
        [imageOne, 'Умный поиск',
            <Typography align='center' variant='body2'>Находите членов команды и
                объединяйтесь с другими командами во
                вкладке <b>Поиск участников</b></Typography>],
        [imageTwo, 'Объединение в команды',
            <Typography align='center' variant='body2'>Во
                вкладке <b>команда</b> можно управлять входящими и исходящими
                заявками</Typography>],
        [imageThree, 'Голосование за лидера',
            <Typography align='center' variant='body2'><b>Лидер команды</b> может
                управлять заявками и командой</Typography>]
    ])

    const [index, setIndex] = useState(0)
    const theme = useTheme()

    return <Grid item xs={12} sm={6} md={12} container
                 direction='column'>
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
            <Image
                onDragStart={e => e.preventDefault()}
                style={{
                    backgroundImage: `url("${images.current[index][0]}")`,
                    backgroundSize: '175%',
                    backgroundPosition: 'center',
                    borderRadius: '50%',
                    width: '100%',
                    overflow: 'hidden',
                    paddingTop: 'calc( 100% - 96px)',
                    backgroundColor: 'transparent',
                    shadow: theme.shadows[4]
                }}
                disableTransition
                imageStyle={{
                    opacity: 0,
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
                <Typography align='center'
                            style={{fontSize: '1.25em', marginTop: '8px'}}>
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
        [imageTwoW, 'Объединение в команды',
            <Typography align='center' variant='body2'>Во
                вкладке <b>команда</b> можно управлять входящими и исходящими
                заявками</Typography>],
        [imageThreeW, 'Голосование за лидера',
            <Typography align='center' variant='body2'><b>Лидер
                команды</b> может
                управлять заявками и командой</Typography>]
    ])

    const [index, setIndex] = useState(0)
    const theme = useTheme()

    const {cUser} = useAppState()

    return <Grid item container direction='column' wrap='nowrap'>
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
                <Image
                    disableTransition
                    onDragStart={e => e.preventDefault()}
                    style={{
                        backgroundImage: `url("${images.current[index][0]}")`,
                        backgroundSize: 'auto 182%',
                        backgroundPosition: 'center',
                        width: 'calc(100% + 60px)',
                        marginLeft: '-30px',
                        marginRight: '-30px',
                        overflow: 'hidden',
                        paddingTop: 'max(200px, calc( (100% - 60px) / 2))',
                        backgroundColor: 'transparent',
                        shadow: theme.shadows[4]
                    }}
                    imageStyle={{
                        opacity: 0,
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
                            style={{
                                opacity: index >= images.current.length - 1 ? 0.3 : 1,
                                zIndex: 2
                            }}
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
                    padding: '8px 24px 0 24px'
                }}>
                    {images.current[index][1]}
                </Typography>
                <Box style={{padding: '0 30px 0 30px'}}>
                    {images.current[index][2]}
                </Box>
            </Grid>
        </Grid>
        {cUser.isNotAuthorized &&
        <a
          href={`${HOST_DOMAIN}${PREFIX}/redirect?backTo=user`}
          style={{
              textDecoration: 'none', marginTop: 16,
              padding: '0px 16px 0 16px', width: '100%', boxSizing: 'border-box'
          }}>
          <PrimaryButton style={{width: '100%'}}>
            Войти через ВКонтакте
          </PrimaryButton>
        </a>
        }
    </Grid>
}
const SignupSection: React.FC<GridProps> = (props) => {
    const {cUser} = useAppState()

    return <Box clone
                alignItems={{xs: 'start', md: 'center'}}>
        <Grid item
              container
              direction='column'
              wrap='nowrap'
              {...props}>
            <Grid item container justify='center'>
                <Hidden smDown>
                    <Images/>
                </Hidden>
            </Grid>
            {cUser.isNotAuthorized &&
            <Box clone position='sticky' top='70px'>
              <a
                href={`${HOST_DOMAIN}${PREFIX}/redirect?backTo=user`}
                style={{
                    textDecoration: 'none', marginTop: 16,
                    width: '100%', boxSizing: 'border-box'
                }}>
                <PrimaryButton style={{width: '100%'}}>
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
        <Grid item style={{paddingBottom: 16}}>
            <Typography style={{fontSize: '3rem', lineHeight: 1}}>
                <b>Найди лучшую команду</b>
            </Typography>
            <Typography style={{fontSize: '1.35rem', marginTop: '8px'}}>
                А мы поможем тебе в этом. Начни с выбора
                мероприятия.
            </Typography>
            <Hidden mdUp>
                <Box clone marginTop='16px' padding='0px 0px 16px 0px'
                     borderRadius='10px' overflow='hidden'>
                    <Plate elevation={4}>
                        <ImagesWide/>
                    </Plate>
                </Box>
            </Hidden>
        </Grid>
        <Box clone flexDirection={{xs: 'column', md: 'row'}}>
            <Grid item container spacing={2}>
                <Grid item container xs md={7} direction='column'>
                    <EventsList/>
                    <Box flex={1}/>
                </Grid>
                <Hidden smDown>
                    <Box clone paddingTop={{xs: 3, md: 0}} order={{
                        xs: 1, sm: 2
                    }}>
                        <Grid item container md={5} direction='column'>
                            <GrayPlate>
                                <SignupSection/>
                            </GrayPlate>
                            <Box flex={1}/>
                        </Grid>
                    </Box>
                </Hidden>
            </Grid>
        </Box>
        <div style={{height: 100}}/>
    </Grid>
}