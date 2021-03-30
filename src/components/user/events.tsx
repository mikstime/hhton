import React from 'react'
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import {GridListTileBar, IconButton} from '@material-ui/core'
import StarBorderIcon from '@material-ui/icons/StarBorder';
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
        },
        gridList: {
            flexWrap: 'nowrap',
            // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
            transform: 'translateZ(0)'
        },
        title: {
            color: theme.palette.primary.light,
        },
        titleBar: {
            background:
                'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
        },
        tile: {
            borderRadius: 10,
        }
    })
)

export const UserEvents: React.FC = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <GridList spacing={16} cols={2.5} className={classes.gridList}>
                {[{
                    img: 'http://loremflickr.com/1000/1000?',
                    title: 'Эта секция',
                    author: 'sdfsdf'
                }, {
                    img: 'http://loremflickr.com/1000/1000',
                    title: 'еще не готова',
                    author: 'sdfsdf'
                }, {
                    img: 'http://loremflickr.com/1000/1000',
                    title: 'Но скоро будет',
                    author: 'sdfsdf'
                }].map((tile, i) => (
                    <GridListTile classes={{
                        tile: classes.tile
                    }} key={i}>
                        <img src={tile.img} alt={tile.title}/>
                        <GridListTileBar
                            title={tile.title}
                            classes={{
                                root: classes.titleBar,
                                title: classes.title,
                            }}
                            actionIcon={
                                <IconButton aria-label={`star ${tile.title}`}>
                                    <StarBorderIcon className={classes.title} />
                                </IconButton>
                            }
                        />
                    </GridListTile>
                ))}
            </GridList>
        </div>
    )
}
