import React, {ChangeEventHandler, Fragment} from 'react'
import {Box} from '@material-ui/core'
import {Plate} from '../../common'
import {WhiteField, WhiteFieldLabel} from '../user-edit'

export const Additional: React.FC<{
    place: {
        value: string,
        onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    },
    site: {
        value: string,
        onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    }
}> = ({place, site}) => {
    return <Fragment>
        <WhiteFieldLabel label='Место проведения'/>
        <Box clone marginTop={{xs: 0, sm: '16px'}}>
            <Plate elevation={4} padding={8}>
                <WhiteField label='Место проведения' inputProps={{
                    placeholder: 'город, улица, дом',
                    ...place
                }}/>
            </Plate>
        </Box>
        <WhiteFieldLabel label='Сайт мероприятия'/>
        <Box clone marginTop={{xs: 0, sm: '16px'}}>
            <Plate elevation={4} padding={8}>
                <WhiteField label='Сайт мероприятия' inputProps={{
                    placeholder: 'Например, team-up.online',
                    ...site
                }}/>
            </Plate>
        </Box>
    </Fragment>
}