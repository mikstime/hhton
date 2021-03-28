import React from 'react'
import styled from 'styled-components'
import {Button, Container, Grid, Typography} from '@material-ui/core'
import {SecondaryButton} from '../common/buttons'
import firstTriangle from '../../assets/home/first-triangle.svg'
import {Link} from 'react-router-dom'
import {HOST_DOMAIN, PREFIX} from '../../config/network'
import {AdditionalText} from '../common'
import {useHistory} from 'react-router-dom'

const RootContainer = styled(Container)`
  height: 100vh;
`
const Root = styled.div`
  width: 100%;
  height: 100%;
`
const Screen = styled.div`
  height: 100vh;
`
export const HostApp: React.FC = () => {
    const linkToAuth = `${HOST_DOMAIN}${PREFIX}/redirect`
    const history = useHistory()
    return <Root>
        <Screen style={{
            backgroundColor: 'white',
            backgroundImage: `url("${firstTriangle}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right'
        }}>
            <RootContainer>
                <Grid style={{height: '100vh'}} container direction='column'
                      justify='center'>
                    {history.length > 2 &&
                    <Grid item>
                      <AdditionalText onClick={() => {
                          history.goBack()
                      }}>
                        Назад
                      </AdditionalText>
                    </Grid>
                    }
                    <Grid item>
                        <Typography style={{fontSize: '3.5rem'}}>Создавайте
                            командные<br/>
                            мероприятия в пару<br/>
                            кликов
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Link to='/event/create'
                              style={{textDecoration: 'none'}}>
                            <SecondaryButton style={{marginTop: 48}}>
                                Создать мероприятие
                            </SecondaryButton>
                        </Link>
                        <Link to='/user/events'
                              style={{textDecoration: 'none'}}>
                            <Button style={{marginTop: 48}}>
                                Мои мероприятия
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </RootContainer>
        </Screen>
    </Root>
}