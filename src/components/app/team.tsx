import React, {useEffect} from 'react'
import {
    Box,
    Grid, Tab, Tabs
} from '@material-ui/core'
import {useAppState} from '../tools/use-app-state'
import {useHistory} from 'react-router-dom'
import {TeamPage} from '../team/team-page'
import {IncomingPage} from '../team/incoming-page'
import {OutgoingPage} from '../team/outgoing-page'
import {HistoryPage} from '../team/history-page'

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
        <Grid item container xs style={{
            position: 'sticky',
            top: 0,
            zIndex: 3,
        }}>
            <Box clone paddingLeft={{xs: 0, md: 50}}
                 marginLeft={{xs: 0, md: -50}}>
                <Tabs variant="scrollable"
                      indicatorColor="primary" style={{
                    backgroundColor: '#F9F9F9',
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
        </Grid>
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