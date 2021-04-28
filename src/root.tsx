import React from 'react'
import {makeStyles, ThemeProvider} from '@material-ui/core'
import {ThemeProvider as TP} from 'styled-components'
import {
    BrowserRouter
} from 'react-router-dom'
import ruLocale from 'date-fns/locale/ru'
import {SnackbarProvider} from 'notistack'
import {MuiTheme} from './style/theme'
import {AppStateProvider} from './components/tools/use-app-state'
import {App} from './components/app'
import {ModalsProvider} from './components/modals/ModalsProvider'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import {FeedProvider} from './components/app/feed'
import SnackMessage from './components/common/snackbars'
import {NotificationHandlersProvider} from './components/tools/notification-handlers'

const useStyles = makeStyles({
    success: {backgroundColor: 'purple'},
    error: {backgroundColor: 'blue'},
    warning: {backgroundColor: 'green'},
    info: {backgroundColor: 'yellow'}
})

const Main: React.FC = () => {
    const classes = useStyles()
    return <ThemeProvider theme={MuiTheme}>
        <TP theme={MuiTheme}>
            <BrowserRouter>
                <SnackbarProvider
                    maxSnack={3}
                    classes={{
                        variantSuccess: classes.success,
                        variantError: classes.error,
                        variantWarning: classes.warning,
                        variantInfo: classes.info
                    }}
                    content={(key, message: string) => {
                        try {
                            const parsed = JSON.parse(message)
                            return <SnackMessage id={key} message={parsed.message} to={parsed.to}/>
                        } catch (e) {
                            return <SnackMessage id={key} message={message}/>
                        }
                    }}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}
                                             locale={ruLocale}>
                        <AppStateProvider>
                            <NotificationHandlersProvider>
                                <ModalsProvider>
                                    <FeedProvider>
                                        <App/>
                                    </FeedProvider>
                                </ModalsProvider>
                            </NotificationHandlersProvider>
                        </AppStateProvider>
                    </MuiPickersUtilsProvider>
                </SnackbarProvider>
            </BrowserRouter>
        </TP>
    </ThemeProvider>
}

export const MainSSR: React.FC = () => {
    React.useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles && jssStyles.parentElement) {
            jssStyles.parentElement.removeChild(jssStyles)
        }
    }, [])
    return <Main/>
}

export default MainSSR
