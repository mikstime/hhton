import React from 'react'
import styled from 'styled-components'
import {Container, Grid, Typography} from '@material-ui/core'
import {SecondaryButton} from '../common/buttons'
import firstTriangle from '../../assets/home/first-triangle.svg'
import {Link} from 'react-router-dom'
import {HOST_DOMAIN, PREFIX} from "../../config/network";

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
    const backTo = 'get_started'
    const linkToAuth = `${HOST_DOMAIN}${PREFIX}/redirect?backTo=${backTo}`
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
                        <Typography style={{fontSize: '3.5rem'}}>
                            Команда Фиксики
                        </Typography>
                        <Typography style={{fontSize: '1.5rem'}}>
                            Балицкий Михаил – React, TS (Frontend разработчик)
                        </Typography>
                        <Typography style={{fontSize: '1.5rem'}}>
                            Елизаров Олег – Golang, PostgreSQL (Backend разработчик)
                        </Typography>
                        <Typography style={{fontSize: '1.5rem'}}>
                            Куклин Сергей - Golang, JS (Fullstack разработчик)
                        </Typography>
                        {/*<Typography style={{fontSize: '3.5rem'}}>Создавайте*/}
                        {/*    командные<br/>*/}
                        {/*    мероприятия в пару<br/>*/}
                        {/*    кликов*/}
                        {/*</Typography>*/}
                    </Grid>
                    <Grid item>
                        <Link to='/event/100' style={{textDecoration: 'none'}}>
                        <SecondaryButton style={{marginTop: 48}}>
                            К мероприятию
                            {/*Я хочу организовать мероприятие*/}
                        </SecondaryButton>
                        </Link>
                    </Grid>
                </Grid>
            </RootContainer>
        </Screen>
    </Root>
}