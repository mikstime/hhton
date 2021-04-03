import React, {useEffect} from 'react'
import {
    AppBar,
    Box, Container,
    Grid, Tab, Tabs
} from '@material-ui/core'
import {useAppState} from '../tools/use-app-state'
import {useHistory} from 'react-router-dom'
import {TeamPage} from '../team/team-page'
import {IncomingPage} from '../team/incoming-page'
import {OutgoingPage} from '../team/outgoing-page'
import {HistoryPage} from '../team/history-page'
import {Plate} from '../common'

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

    const {cUser} = useAppState()
    const history = useHistory()

    useEffect(() => {
        if (cUser.isNotAuthorized) {
            history.push('/')
        }
    }, [cUser.isNotAuthorized])

    const [value, setValue] = React.useState(0)

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue)
    }


    return <Grid container direction='column'>
        <Box
            paddingLeft={{sm: '50px'}}
            marginLeft={{sm: '-50px'}}
            width={{
                xs: 'calc(100vw - 36px)',
                sm: 'calc( 100vw - 48px - 48px - 200px)',
                md: 'calc( 800px - 48px - 48px)'
            }
            }
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 3,
                backgroundColor: '#F9F9F9',
            }}>
            <Tabs variant="scrollable"
                  indicatorColor="primary" style={{
                marginBottom: 16
            }}
                  textColor="primary" value={value} onChange={handleChange}
                  aria-label="team-page tabs"
            >
                <Tab label="Команда"/>
                <Tab label="Входящие заявки"/>
                <Tab label="Исходящие заявки"/>
                <Tab label="История заявок"/>
            </Tabs>

        </Box>
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
}