import React from 'react'
import {ThemeProvider} from '@material-ui/core'
import {ThemeProvider as TP} from 'styled-components'
import {
  BrowserRouter,
} from 'react-router-dom'

import { SnackbarProvider} from 'notistack';
import {MuiTheme} from './style/theme'
import {AppStateProvider} from './components/tools/use-app-state'
import {App} from './components/app'

const Main: React.FC = () => {
  return <ThemeProvider theme={MuiTheme}>
    <TP theme={MuiTheme}>
      <BrowserRouter>
        <SnackbarProvider maxSnack={3}>
          <AppStateProvider>
            <App/>
          </AppStateProvider>
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
