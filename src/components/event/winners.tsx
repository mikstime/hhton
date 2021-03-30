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
import {getEventTeams} from '../../model/api'
import {useAppState} from '../tools/use-app-state'

const Place: React.FC<{
    place: string, height: number
}> = ({place, height}) => {
    return <Grid xs item container direction='column'>
        <Box width={48} height={48} padding='8px' marginBottom='4px'>
            <Image src='http://loremflickr.com/1000/1000'
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
const Winners: React.FC<{onClick?: (r: HTMLButtonElement) => void}> = ({onClick}) => {
    const [r, setR] = useState<HTMLButtonElement|null>(null)
    return <Grid xs item container direction='column'
                 justify='flex-end' spacing={1}>
        <Hidden mdUp><Box marginTop={2}/></Hidden>
        <Winner label='Пока что' index={1}/>
        <Winner label='не готова' index={2}/>
        <Winner label='эта секция' index={3}/>
        <Grid item>
            <CardActionArea ref={setR} onClick={() => {
                if(r) onClick?.(r)
            }} style={{borderRadius: 8}}>
                <InfoPlate elevation={4} textPlate={CaptionText}
                           text='Показать всех'/>
            </CardActionArea>
        </Grid>
    </Grid>
}

export const WinnersSection: React.FC = () => {
    const [r, setR] = useState<HTMLButtonElement|null>(null)
    const [groups, setGroups] = useState<Group[]>([])
    const {event} = useAppState()
    useEffect(() => {
        (async () => {
            if (event.isFinished) {
                const teams = await getEventTeams(event.id)
                setGroups(teamsToGroups(teams))
            }
        })()
    }, [event.id, event.isFinished])

    return <Box clone marginTop={1}>
        <Grid item container>
            <SelectTeamPopover value={groups} anchorEl={r} title='Команды участники'
                               onClose={() => setR(null)}/>
            <GrayishPlate padding={24}>
                <Box clone>
                    <Grid container alignItems='stretch'>
                        <Hidden smDown>
                            <Grid xs item container
                                  alignItems='flex-end'
                                  spacing={1}>
                                <Place place='1' height={108}/>
                                <Place place='2' height={79}/>
                                <Place place='3' height={54}/>
                                <FlexSpace/>
                            </Grid>
                        </Hidden>
                        <Winners onClick={(r) => {
                            setR(r)
                        }}/>
                    </Grid>
                </Box>
            </GrayishPlate>
        </Grid>
    </Box>
}