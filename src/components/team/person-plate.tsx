import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react'
import {User, UserSkill} from '../tools/use-app-state/user'
import {AdditionalText, GrayishPlate, GrayPlate, Plate} from '../common'
import {
    Grid,
    IconButton,
    Typography,
    Box,
    Collapse,
    Chip, Hidden, makeStyles, createStyles, Theme,
} from '@material-ui/core'
import Image from 'material-ui-image'
import {Link} from 'react-router-dom'
import {PlateProps} from '../common/plate'
import {ReactComponent as ExpandIcon} from '../../assets/team/expand.svg'
import {ReactComponent as CollapseIcon} from '../../assets/team/collapse.svg'
import downIcon from '../../assets/team/down.svg'
import topIcon from '../../assets/team/top.svg'
import {useJobs} from '../tools/useJobs'


type Props = {
    user: User,
    topElements?: JSX.Element,
    rightElements?: JSX.Element,
    bottomElements?: JSX.Element,
}

type Job = {
    name: string,
    tags: UserSkill[]
}
const useSkillsStyles = makeStyles((t: Theme) => createStyles({
    chip: {
        borderRadius: 8,
        background: 'white',
        marginRight: 16,
        marginBottom: 12
    }
}))
const SkillsItem: React.FC<{ job: Job }> = ({job}) => {
    const classes = useSkillsStyles()

    const skills = job.tags.map((t, i) => <Chip className={classes.chip} key={i}
                                                label={t.name}/>)
    return <Grid item container wrap='nowrap'>
        <Box clone width='100px'>
            <Grid item>
                <Box clone minHeight='32px' paddingTop='12px'>
                    <Typography>
                        {job.name}
                    </Typography>
                </Box>
            </Grid>
        </Box>
        <Box clone paddingRight='0px' paddingTop='8px'>
            <Grid item xs>
                {skills}
            </Grid>
        </Box>
    </Grid>
}
const Skills: React.FC<{ user: User, open: boolean, onToggle: Function } & PlateProps> = ({user, onToggle, open, ...rest}) => {
    const expanded = open
    const getJobName = useJobs()
    const jobs = useMemo(() => {
        const x = user.skills.tags.reduce((a, s) => {
            if (s.jobId) {
                return {...a, [s.jobId]: [...(a[s.jobId] || []), s]}
            }
            return a
        }, {} as { [key: string]: UserSkill[] })
        return Object.entries(x).map(([k, v]) => ({
            name: getJobName(k),
            tags: v
        }))
    }, [user.skills.tags])

    return <Fragment>
        <Collapse in={!expanded}>
            <Box clone padding='4px 12px !important' marginLeft='110px'>
                <GrayPlate {...rest}>
                    <Grid container alignItems='center' wrap='nowrap'>
                        <Grid item xs>
                            <Typography>
                                {jobs.map(j => j.name).join(' ') || 'Навыки не указаны'}
                            </Typography>
                        </Grid>
                        <Box clone width='30px' height='30px'>
                            <Grid item>
                                {jobs.length > 0 &&
                                <IconButton size='small'
                                            onClick={() => onToggle()}>
                                  <ExpandIcon/>
                                </IconButton>
                                }
                            </Grid>
                        </Box>
                    </Grid>
                </GrayPlate>
            </Box>
        </Collapse>
        <Collapse in={expanded}>
            <Box clone padding='4px 12px 0 12px !important'>
                <GrayishPlate {...rest}>
                    <Grid container direction='column' wrap='nowrap'>
                        <Box clone height='0px'>
                            <Grid item container xs>
                                <Box flex={1}/>
                                <Box clone width='30px'>
                                    <Grid item>
                                        <IconButton size='small'
                                                    onClick={() => onToggle()}>
                                            <CollapseIcon/>
                                        </IconButton>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Box>
                        {jobs.map((j, i) => <SkillsItem job={j} key={i}/>)}
                    </Grid>
                </GrayishPlate>
            </Box>
        </Collapse>
    </Fragment>
}
const useStyles = makeStyles((t: Theme) => createStyles({
    root: {
        overflowY: 'auto',
        height: '100%', width: '100%',
        '-ms-overflow-style': 'none',  /* Internet Explorer 10+ */
        'scrollbar-width': 'none',  /* Firefox */
        '&::-webkit-scrollbar': {
            display: 'none'  /* Safari and Chrome */
        }
    },
    scrollTop: {
        '&:before': {
            content: '""',
            top: 0,
            left: 0,
            marginLeft: 8,
            width: 24,
            position: 'absolute',
            height: 14,
            backgroundColor: 'white',
            transition: '.1s',
            backgroundImage: `url("${topIcon}")`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }
    },
    scrollHidden: {
        opacity: 0
    },
    scrollBottom: {
        bottom: 0,
        left: 0,
        content: '""',
        position: 'absolute',
        marginLeft: 8,
        width: 24,
        height: 14,
        backgroundColor: 'white',
        transition: '.1s',
        backgroundImage: `url("${downIcon}")`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }
}))
export const PersonPlate: React.FC<Props & PlateProps> = ({user, topElements, rightElements, bottomElements, ...props}) => {

    const classes = useStyles()
    const [avatarSize, setAvatarSize] = useState(98)
    const [open, setOpen] = useState(false)
    const onToggle = useCallback(() => {
        if (!open) {
            setAvatarSize(47)
        } else {
            setAvatarSize(98)
        }
        setOpen(!open)
    }, [setOpen, open])

    const [scrollTop, setScrollTop] = useState(false)
    const [scrollBottom, setScrollBottom] = useState(false)

    const onScroll = useCallback((e) => {
        if (e.target.firstElementChild) {
            const el = e.target
            const toTop = el.scrollTop
            const toBottom = el.firstElementChild.getBoundingClientRect().height
                - el.getBoundingClientRect().height - el.scrollTop
            setScrollTop(toTop > 15)
            setScrollBottom(toBottom > 15)
        }
    }, [setScrollTop, setScrollBottom])

    const scrollRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        if (scrollRef.current) {
            const el = scrollRef.current
            if (el.firstElementChild) {
                const toTop = el.scrollTop
                const toBottom = el.firstElementChild.getBoundingClientRect().height
                    - el.getBoundingClientRect().height - el.scrollTop
                setScrollTop(toTop > 15)
                setScrollBottom(toBottom > 15)
            }
        }
    }, [scrollRef.current, setScrollBottom, setScrollTop])

    const hasRight = !!rightElements
    return <Plate padding={16} {...props} elevation={4}>
        <Grid container wrap='nowrap' style={{position: 'relative'}}>
            <Box clone width='0px' height={0}>
                <Grid item>
                    <Link to={`user/${user.id}`}
                          style={{
                              display: 'block',
                              textDecoration: 'none',
                              transition: '.3s',
                              width: avatarSize,
                              height: avatarSize
                          }}>
                        <Image width={avatarSize} src={user.avatar}
                               imageStyle={{
                                   borderRadius: 4,
                                   objectFit: 'cover'
                               }}/>
                    </Link>
                </Grid>
            </Box>
            <Box paddingRight={hasRight ? '32px' : ''} clone>
                <Grid item container xs direction='column' wrap='nowrap'>
                    <Box clone
                         style={{transition: 'padding-left .3s'}}
                         paddingLeft={`${avatarSize + 12}px`}>
                        <Grid item container xs wrap='nowrap'>
                            <Grid item zeroMinWidth>
                                <Box clone minWidth='100px'
                                     height='30px'
                                     maxWidth={{xs: `calc(100vw - 48px - ${avatarSize}px - 32px)`}}>
                                    <Typography variant='h2' noWrap>
                                        {user.firstName} {user.lastName}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Box flex={1}/>
                            {topElements}
                        </Grid>
                    </Box>
                    <Box clone
                         style={{transition: 'padding-left .3s'}}
                         paddingLeft={`${avatarSize + 12}px`}>
                        <Grid item container xs>
                            <Box clone minWidth='100px'
                                 height='30px'
                                 maxWidth={{xs: `calc(100vw - 48px - ${avatarSize + 12}px - 32px)`}}>
                                <AdditionalText noWrap>
                                    <Hidden
                                        only='xs'>ВКонтакте:&nbsp;</Hidden><a
                                    style={{textDecoration: 'none'}}
                                    href={`https://vk.com/${user.settings.vk}`}>
                                    vk.com/{user.settings.vk}
                                </a>
                                </AdditionalText>
                            </Box>
                        </Grid>
                    </Box>
                    <Skills user={user} onToggle={onToggle} open={open}/>
                    {bottomElements}
                </Grid>
            </Box>
            {hasRight &&
            <Box right={0} top={0} bottom={0} position='absolute'>
              <Box height='100%' width='100%'
                   position='relative'>
                <Box style={{zIndex: 2, pointerEvents: 'none'}}
                     className={`${classes.scrollTop} ${scrollTop ? '' : classes.scrollHidden}`}
                     position='absolute'/>
                <Box style={{zIndex: 2, pointerEvents: 'none'}}
                     className={`${classes.scrollBottom} ${scrollBottom ? '' : classes.scrollHidden}`}
                     position='absolute'/>
                <div ref={scrollRef}
                     onScroll={onScroll}
                     className={classes.root}>
                    {rightElements}
                </div>
              </Box>
            </Box>
            }
        </Grid>
    </Plate>
}