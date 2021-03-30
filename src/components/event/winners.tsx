import React, {useEffect, useState} from 'react'
import {FlexSpace, GrayishPlate} from '../common'
import {Box, CardActionArea, Grid, Hidden, Typography} from '@material-ui/core'
import Image from 'material-ui-image'
import {InfoPlate} from '../common/item-plate'
import {CaptionText} from '../common/typography'
import {
    Group,
    SelectTeamPopover, teamsToGroups
} from '../modals/event-edit/select-team-popover'
import {getEventTeams, getWinners} from '../../model/api'
import {useAppState} from '../tools/use-app-state'
import {Team} from '../tools/use-app-state/user'

const Place: React.FC<{
    place: string, height: number, src: string
}> = ({place, height, src}) => {
    return <Grid xs item container direction='column'>
        <Box width={48} height={48} padding='8px' marginBottom='4px'>
            <Image src={src}
                   style={{
                       paddingTop: '48px',
                       width: 48,
                       borderRadius: '50%'
                   }}
                   imageStyle={{
                       width: 48,
                       height: 48,
                       borderRadius: '50%'
                   }}
            />
        </Box>
        <Box width={64} height={height}
             style={{background: '#333333', borderRadius: 4}}>
            <Typography variant='h1'
                        style={{color: 'white', lineHeight: `${height}px`}}
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
                <Winner key={i} label={w.name} index={w.prizes[0].place + 1}/>))
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
    const [r, setR] = useState<HTMLButtonElement | null>(null)
    const [groups, setGroups] = useState<Group[]>([])
    const {event} = useAppState()
    const [winners, setWinners] = useState<Team[]>([])
    useEffect(() => {
        (async () => {
            if (event.isFinished) {
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
            }
        })()
    }, [event.id, event.isFinished])

    return <Box clone marginTop={1}>
        <Grid item container>
            <SelectTeamPopover value={groups} anchorEl={r}
                               title='Команды участники'
                               onClose={() => setR(null)}/>
            <GrayishPlate padding={24}>
                <Box clone>
                    <Grid container alignItems='stretch'>
                        <Hidden smDown>
                            <Grid xs item container
                                  alignItems='flex-end'
                                  spacing={1}>
                                {winners[0] &&
                                <Place place='1' height={108} src={winners[0].members[0].avatar ?? ''}/>}
                                {winners[1] &&
                                <Place place='2' height={79} src={winners[0].members[1].avatar ?? ''}/>}
                                {winners[2] &&
                                <Place place='3' height={54} src={winners[0].members[2].avatar ?? ''}/>}
                                <FlexSpace/>
                            </Grid>
                        </Hidden>
                        <Winners winners={winners} onClick={(r) => {
                            setR(r)
                        }}/>
                    </Grid>
                </Box>
            </GrayishPlate>
        </Grid>
    </Box>
}