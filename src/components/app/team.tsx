import React, {useEffect} from 'react'
import {
    Badge,
    Box,
    Grid, Tab, Tabs
} from '@material-ui/core'
import {useAppState} from '../tools/use-app-state'
import {useHistory, useLocation} from 'react-router-dom'
import {TeamPage} from '../team/team-page'
import {IncomingPage} from '../team/incoming-page'
import {OutgoingPage} from '../team/outgoing-page'
import {HistoryPage} from '../team/history-page'
import {SideSection} from '../team/side-section'


interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    )
}


export const TeamApp: React.FC = () => {

    const {cUser, cEvent, settings, invites} = useAppState()
    const history = useHistory()
    const location = useLocation()

    const [value, setValue] = React.useState(0)

    useEffect(() => {
        (async () => {
            if (cEvent.notFound) {
                history.push('/user')
            }
            if (cUser.notFound || cEvent.isFinished || settings.isHostMode) {
                history.push('/event/' + cEvent.id)
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cEvent.id, cEvent.notFound, cEvent.isParticipating, settings.isHostMode])

    useEffect(() => {
        if (location.hash === '#incoming') {
            setValue(1)
        } else if (location.hash === '#outgoing') {
            setValue(2)
        } else if (location.hash === '#blocked') {
            setValue(3)
        } else {
            setValue(0)
        }
    }, [location.hash])

    useEffect(() => {
        if (cUser.isNotAuthorized) {
            history.push('/')
        }
    }, [cUser.isNotAuthorized])


    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue)
        if (newValue === 0) {
            history.replace('#team')
        } else if (newValue === 1) {
            history.replace('#incoming')
        } else if (newValue === 2) {
            history.replace('#outgoing')
        } else if (newValue === 3) {
            history.replace('#blocked')
        }
    }

    return <Grid container>
        <Box
            paddingLeft={{sm: '50px'}}
            marginLeft={{sm: '-50px'}}
            width={{
                xs: 'calc(100vw - 48px)',
                sm: 'calc( 100vw - 48px - 200px)',
                md: 'calc(100vw - 248px)',
                lg: '912px'
            }}
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 3,
                backgroundColor: '#F9F9F9'
            }}>
            <Tabs variant="scrollable"
                  indicatorColor="primary" style={{
                marginBottom: 16
            }}
                  textColor="primary" value={value} onChange={handleChange}
                  aria-label="team-page tabs"
            >

                <Tab label='Команда'/>
                <Tab label={
                    <Badge
                        color='primary'
                        badgeContent={invites.i.personal.length + invites.i.team.length}
                        variant='dot'>Входящие заявки</Badge>}/>
                <Tab label='Исходящие заявки'/>
                <Tab label='Заблокированные заявки'/>
            </Tabs>

        </Box>
        <Box clone flexDirection={{xs: 'column-reverse', sm: 'row'}}>
            <Grid item container spacing={2}>
                <Grid item container xs={12} sm={7}>
                    <TabPanel value={value} index={0}>
                        <TeamPage/>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <IncomingPage/>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <OutgoingPage/>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <HistoryPage/>
                    </TabPanel>
                </Grid>
                <Grid item container xs={12} sm={5} direction='column'
                      wrap='nowrap'>
                    <Box clone style={{
                        position: 'sticky',
                        top: 64,
                        zIndex: 2
                    }}>
                        <Grid item container>
                            <SideSection/>
                        </Grid>
                    </Box>
                    <Box flex={1}/>
                </Grid>
            </Grid>
        </Box>
    </Grid>
}