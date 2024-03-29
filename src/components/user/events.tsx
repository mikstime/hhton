import React, {useEffect, useState} from 'react'
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import {Box, GridListTileBar, Hidden} from '@material-ui/core'
import {Id} from '../tools/use-app-state/user'
import {useAppState} from '../tools/use-app-state'
import {fetchEvent} from '../../model/api'
import {Link} from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            marginTop: 24,
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            overflow: 'hidden'
        },
        gridList: {
            flexWrap: 'nowrap',
            // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
            transform: 'translateZ(0)'
        },
        title: {
            color: theme.palette.primary.light
        },
        titleBar: {
            height: '100%',
            background:
                'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
        },
        tile: {
            borderRadius: 10
        }
    })
)

type HackathonToShow = {
    id: Id,
    img: string,
    name: string,
    place: string,
}
export const UserEvents: React.FC = () => {
    const classes = useStyles()
    const {user, event} = useAppState()
    const [events, setEvents] = useState<HackathonToShow[]>([])

    useEffect(() => {
        (async () => {
            const e = await Promise.all(user.hackathons.map(ev => fetchEvent(ev.id)))
            if (e) {
                const es = e.map((ex, i) => ({
                    id: ex?.id ?? '-1',
                    img: ex?.background ?? '',
                    name: ex?.name ?? '',
                    //@ts-ignore
                    place: user.hackathons[i].userPlace + 1
                })).filter(e => e.id !== '-1')
                setEvents(es)
            }
        })()
    }, [user.hackathons, event.id])

    const toRender = events.map((tile, i) => (
        <GridListTile classes={{
            tile: classes.tile
        }} key={i}>
            <img style={{objectFit: 'cover', width: '100%', height: '100%'}} src={tile.img} alt={tile.name}/>
            <Link to={`/event/${tile.id}`}>
                <GridListTileBar
                    title={tile.name}
                    subtitle={`${tile.place} место`}
                    classes={{
                        root: classes.titleBar,
                        title: classes.title
                    }}
                />
            </Link>
        </GridListTile>
    ))
    return (
        <Box clone width={{
            xs: 'calc(100vw - 48px)',
            sm: 'calc( 100vw - 48px - 200px)',
            md: 'calc(100vw - 248px)',
            lg: '912px',
        }
        }>
            <div className={classes.root}>
                <Hidden smDown>
                    <GridList spacing={16} cols={2.5}
                              className={classes.gridList}>
                        {toRender}
                    </GridList>
                </Hidden>
                <Hidden mdUp xsDown>
                    <GridList spacing={16} cols={1.5}
                              className={classes.gridList}>
                        {toRender}
                    </GridList>
                </Hidden>
                <Hidden smUp>
                    <GridList spacing={16} cols={1.1}
                              className={classes.gridList}>
                        {toRender}
                    </GridList>
                </Hidden>
            </div>
        </Box>
    )
}
