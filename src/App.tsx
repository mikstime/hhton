import React from 'react'
import {ThemeProvider} from '@material-ui/core'
import styled, {ThemeProvider as TP} from 'styled-components'
import {
  BrowserRouter,
} from 'react-router-dom'

import { SnackbarProvider} from 'notistack';
import {MuiTheme} from './style/theme'

export const Main: React.FC = () => {
  return <ThemeProvider theme={MuiTheme}>
    <TP theme={MuiTheme}>
      <BrowserRouter>
        <SnackbarProvider maxSnack={3}>
          <App/>
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

const Root = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
`


const App: React.FC = () => {
  return <Root>
    Hello World
  </Root>
}

export default MainSSR
