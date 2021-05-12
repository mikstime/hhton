import React, {useEffect, useState} from 'react'
import {FlexSpace, GrayishPlate} from '../common'
import {
    Box,
    CardActionArea,
    CircularProgress,
    Grid,
    Hidden,
    Typography
} from '@material-ui/core'
import Image from 'material-ui-image'
import {InfoPlate} from '../common/item-plate'
import {CaptionText} from '../common/typography'
import {
    Group,
    SelectTeamPopover, teamsToGroups
} from '../modals/event-edit/select-team-popover'
import {getEventTeams, getWinners} from '../../model/api'
import {useAppState} from '../tools/use-app-state'
import {Id, Team} from '../tools/use-app-state/user'
import {Link} from 'react-router-dom'
import {useNotificationHandlers} from '../tools/notification-handlers'

const Place: React.FC<{
    place: string, height: number, src: string,
    isNull?: boolean, toId: Id,
}> = ({place, height, src, isNull, toId}) => {
    return <Grid xs item container direction='column'>
        <Box width={48} height={48} padding='8px' marginBottom='4px'>
            {!isNull ?
                <Link to={`/user/${toId}`}>
                <Image
                    src={src}
                    style={{
                        paddingTop: '48px',
                        width: 48,
                        borderRadius: '50%'
                    }}
                    imageStyle={{
                        objectFit: 'cover',
                        width: 48,
                        height: 48,
                        borderRadius: '50%'
                    }}
                /></Link> :
                <Typography align='center' style={{
                    fontSize: 32,
                    color: '#868686',
                    userSelect: 'none'
                }}>
                    &mdash;
                </Typography>
            }
        </Box>
        <Box width={64} height={height}
             style={{
                 background: !isNull ? '#333333' : '#868686',
                 borderRadius: 4
             }}>
            <Typography variant='h1'
                        style={{
                            color: 'white',
                            userSelect: 'none',
                            lineHeight: `${height}px`
                        }}
                        align='center'>
                {place}
            </Typography>
        </Box>
    </Grid>
}

const Winner: React.FC<{ label: string, index: number }> = ({label, index}) => {
    return <Box marginBottom='12px' marginLeft={'28px'}>
        <Typography variant='body1'>
            {index}. {label}
        </Typography>
    </Box>
}
const Winners: React.FC<{ winners: Team[], onClick?: (r: HTMLButtonElement) => void }> = ({winners, onClick}) => {
    const [r, setR] = useState<HTMLButtonElement | null>(null)
    return <Grid xs item container direction='column'
                 justify='flex-end' spacing={1}>
        <Hidden mdUp><Box marginTop={2}/></Hidden>
        {
            winners.slice(0, 3).map((w, i) => (//@ts-ignore
                <Winner key={i} label={w.name} index={i + 1}/>))
        }
        <Grid item>
            <CardActionArea ref={setR} onClick={() => {
                if (r) onClick?.(r)
            }} style={{borderRadius: 8}}>
                <InfoPlate elevation={4} textPlate={CaptionText}
                           text='Показать всех'/>
            </CardActionArea>
        </Grid>
    </Grid>
}

export const WinnersSection: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [r, setR] = useState<HTMLButtonElement | null>(null)
    const [groups, setGroups] = useState<Group[]>([])
    const {event} = useAppState()
    const [winners, setWinners] = useState<Team[]>([])
    const nc = useNotificationHandlers()

    useEffect(() => {
        (async () => {
            if (event.isFinished) {
                setIsLoading(true)
                let teams = await getEventTeams(event.id)
                //@ts-ignore
                const winners = (await getWinners(event.id)).sort((w, v) => w.prizes[0].place - v.prizes[0].place)
                teams = teams.map(t => {
                    const ind = winners.findIndex(v => v.id?.toString() === t.id?.toString())
                    if (~ind) {
                        if (winners[ind]?.prizes?.[0]) {
                            t.prizes = [winners![ind]!.prizes![0]]
                        } else {
                            t.prizes = []
                        }
                    } else {
                        t.prizes = []
                    }
                    return t
                })
                const g = teamsToGroups(teams)
                setWinners(winners)
                setGroups(g)
                setIsLoading(false)
            }
        })()
    }, [event.isFinished, event.id, event.prizes, nc.eUpdates])

    return <Box clone marginTop={1}>
        <Grid item container>
            <SelectTeamPopover value={groups} anchorEl={r}
                               title='Команды участники'
                               onClose={() => setR(null)}/>
            <GrayishPlate padding={24}>
                <Box clone>
                    <Grid container alignItems='stretch'>
                        {isLoading &&
                        <Grid xs item container alignItems='center'
                              justify='center'>
                          <CircularProgress size='3rem'/>
                        </Grid>}
                        {!event.isNullEvent && !winners.length && !isLoading &&
                        <Grid xs item container spacing={1} alignItems='center'
                              style={{
                                  height: 40
                              }}><Typography>
                          Победители пока не определены
                        </Typography>
                        </Grid>}
                        {!isLoading && winners.length > 0 && <Hidden smDown>
                          <Grid xs item container
                                alignItems='flex-end'
                                spacing={1}>
                            <Place place={
                                //@ts-ignore
                                '1'
                            } height={108}
                                   isNull={!winners[0]}
                                   toId={winners[0]?.members[0].id ?? ''}
                                   src={winners[0]?.members[0].avatar ?? ''}/>
                            <Place place={
                                //@ts-ignore
                                '2'
                            } height={79}
                                   isNull={!winners[1]}
                                   toId={winners[1]?.members[0].id ?? ''}
                                   src={winners[1]?.members[0].avatar ?? ''}/>
                            <Place place={
                                //@ts-ignore
                                '3'} height={54}
                                   isNull={!winners[2]}
                                   toId={winners[2]?.members[0].id ?? ''}
                                   src={winners[2]?.members[0].avatar ?? ''}/>
                            <FlexSpace/>
                          </Grid>
                        </Hidden>}
                        {winners.length > 0 &&
                        <Winners winners={winners} onClick={(r) => {
                            setR(r)
                        }}/>}
                    </Grid>
                </Box>
            </GrayishPlate>
        </Grid>
    </Box>
}