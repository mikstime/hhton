import React, {ChangeEventHandler} from 'react'
import {FlexSpace, GrayPlate} from '../../common'
import {
    Box,
    Grid, GridProps,
    InputBase,
    InputBaseProps,
    Typography
} from '@material-ui/core'
import {DateTimePicker} from '@material-ui/pickers'

export const NumberField: React.FC<{
    label: string, inputProps?: InputBaseProps
}> = ({label, inputProps = {}}) => {
    return <Grid item xs container alignItems='baseline'>
        <Grid xs={12} md='auto' item style={{marginRight: 16}}>
            <Box clone textAlign={{md: 'right'}}>
                <Typography variant='body2' style={{color: '#6F7985'}}>
                    {label}
                </Typography>
            </Box>
        </Grid>
        <Grid xs={12} sm item>
            <InputBase type='number' {...inputProps} style={{
                background: 'white',
                borderRadius: 8,
                paddingLeft: 12,
                paddingRight: 12,
                display: 'block',
                height: 32,
                ...(inputProps.style || {})
            }}/>
        </Grid>
    </Grid>
}

const DateField: React.FC<{
    label: string, inputProps?: InputBaseProps,
    disabled?: boolean,
    value: Date | null, onChange: (d: Date) => void
}> = ({label, value, disabled, onChange, inputProps = {}}) => {
    return <Grid item xs container alignItems='baseline'>
        <Grid xs={12} md='auto' item style={{marginRight: 16}}>
            <Box clone textAlign={{md: 'right'}}>
                <Typography variant='body2'
                            style={{color: '#6F7985', width: 114}}>
                    {label}
                </Typography>
            </Box>
        </Grid>
        <Grid xs={12} sm item>
            <DateTimePicker
                InputProps={{
                    disableUnderline: true,
                    ...inputProps
                }}
                disabled={disabled}
                variant="inline"
                format="dd/MM/yyyy в H:mm'"
                fullWidth
                invalidDateMessage=''
                ampm={false}
                error={false}
                helperText={null}
                margin="normal"
                value={value}
                onChange={(d) => {
                    onChange(d as Date)
                }}
                style={{
                    background: 'white',
                    borderRadius: 8,
                    boxSizing: 'border-box',
                    margin: 0,
                    paddingLeft: 12,
                    display: 'block',
                    height: 32,
                    ...(inputProps.style || {})
                }}/>
        </Grid>
    </Grid>
}

const MultilineGrayField: React.FC<{ label: string, inputProps?: InputBaseProps } & GridProps> = ({label, inputProps = {}, ...rest}) => {
    return <Grid item xs container alignItems='baseline' {...rest}>
        <Box clone width={{md: '130px'}} paddingRight={2}>
            <Grid xs={12} md='auto' item>
                <Box clone textAlign={{md: 'right'}}>
                    <Typography variant='body2' style={{color: '#6F7985'}}>
                        {label}
                    </Typography>
                </Box>
            </Grid>
        </Box>
        <Grid xs={12} md item>
            <InputBase
                multiline
                rowsMin={3}
                rows={3}
                rowsMax={10}
                {...inputProps} style={{
                background: 'white',
                borderRadius: 8,
                paddingLeft: 12,
                paddingRight: 12,
                display: 'block',
                ...(inputProps.style || {})
            }}/>
        </Grid>
    </Grid>
}

export const GeneralSection: React.FC<{
    description: {
        value: string,
        onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    },
    start: {
        value: Date | null,
        onChange: (d: Date) => void,
    },
    finish: {
        value: Date | null,
        onChange: (d: Date) => void,
    },
    teamSize: {
        value: string,
        onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    },
    usersLimit: {
        value: string,
        onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    }
}> = ({
          start, finish, teamSize, description
      }) => {
    return <GrayPlate style={{marginTop: 16}}>
        <Grid direction='column' container spacing={4}>
            <MultilineGrayField label='О мероприятии' inputProps={{
                placeholder: 'Напишите здесь все, что не укладывается в другие поля',
                ...description
            }}/>
        </Grid>
        <Box clone flexDirection={{xs: 'column', sm: 'row'}}>
            <Grid container spacing={2}>
                <Grid xs item container spacing={1} direction='column'>
                    <DateField label='Начало' {...start} inputProps={{
                        placeholder: 'дата, время'
                    }}/>
                    <DateField label='Конец' {...finish} inputProps={{
                        placeholder: 'дата, время'
                    }}/>
                </Grid>
                <Grid xs item container spacing={1} direction='column'>
                    <NumberField label='Размер команды' inputProps={{
                        placeholder: 'до 10',
                        inputProps: {min: 0, max: 10, ...teamSize}
                    }}/>
                    <FlexSpace/>
                </Grid>
            </Grid>
        </Box>
    </GrayPlate>
}