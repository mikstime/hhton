import React, {Fragment} from 'react'
import styled from 'styled-components'
import {Container, Grid, Typography} from '@material-ui/core'
import {SecondaryButton} from '../common/buttons'
import firstTriangle from '../../assets/home/first-triangle.svg'

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
export const HomeApp: React.FC = () => {

    return <Root>
        <Screen style={{
            backgroundColor: 'white',
            backgroundImage: `url("${firstTriangle}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right'
        }}>
            <RootContainer>
                <Grid style={{height: '100vh'}} container direction='column' justify='center'>
                    <Grid item>
                        <Typography style={{fontSize: '3.5rem'}}>Создавайте
                            командные<br/>
                            мероприятия в пару<br/>
                            кликов
                        </Typography>
                    </Grid>
                    <Grid item>
                        <SecondaryButton style={{marginTop: 48}}>
                            Я хочу организовать мероприятие
                        </SecondaryButton>
                    </Grid>
                </Grid>
            </RootContainer>
        </Screen>
    </Root>
}