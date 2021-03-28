import React, {RefObject, useRef, useState} from 'react'
import {FlexSpace, GrayPlate, Plate} from '../../common'
import {
    Box, Button, ButtonProps,
    Collapse,
    Grid, Grow, IconButton,
    InputBase,
    InputBaseProps,
    Typography, useTheme
} from '@material-ui/core'
import {ReactComponent as SettingsIconActive} from '../../../assets/settings_prizes1.svg'
import {ReactComponent as SettingsIcon} from '../../../assets/settings_prizes.svg'
import {ReactComponent as TeamIcon} from '../../../assets/team.svg'
import {ReactComponent as DeleteIcon} from '../../../assets/delete.svg'
import {NumberField} from './general'
import {SelectTeamPopper} from './select-team-popper'

const WinnersField: React.FC<{ label: string, inputProps?: ButtonProps, onSelect?: (r: HTMLButtonElement) => void }> = ({onSelect, label, inputProps: {onClick, ...rest} = {}}) => {
    const r = useRef<HTMLButtonElement>(null)
    return <Grid item xs container alignItems='center' justify='flex-end'>
        <Grid xs={12} md='auto' item style={{marginRight: 16}}>
            <Box clone textAlign={{md: 'right'}}>
                <Typography variant='body2' style={{color: '#6F7985'}}>
                    {label}
                </Typography>
            </Box>
        </Grid>
        <Box clone flex={{xs: 1, md: ''}}  onClick={() => {
            if (r.current)
                onSelect?.(r.current)
        }}>
            <Button ref={r} {...rest} style={{
                background: 'white',
                borderRadius: 8,
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 4,
                paddingBottom: 4,
                display: 'block',
                textTransform: 'none',
                fontWeight: 400,
                height: 32,
                ...(rest.style || {})
            }}>
                <Box display='flex' alignItems='center'>
                    <TeamIcon style={{marginRight: 12}}/>
                    Выбрать
                </Box>
            </Button>
        </Box>
    </Grid>
}

const PrizeItem: React.FC<{
    inputProps?: InputBaseProps,
    onPopperOpen?: (e: HTMLButtonElement) => void,
    closePopper?: () => void,
    name?: string,
    count?: number,
    setRef?: (e: HTMLElement) => void,
}> = ({inputProps = {}, closePopper, onPopperOpen, setRef, name = '', count = 0}) => {
    const [isEditing, setIsEditing] = useState(false)
    const toShow = true
    const theme = useTheme()

    return <Box clone marginTop={{xs: 0, sm: '16px'}}>
        <Plate padding={12}>
            <Grid ref={(r) => r && setRef?.(r)} container alignItems='center'
                  style={{minHeight: 32}}>
                {(toShow || isEditing) &&
                <Box clone width={isEditing ? 32 : 0}>
                  <IconButton size='small' disabled={!isEditing}
                              style={{marginRight: 12, transition: '.3s'}}>
                    <DeleteIcon/>
                  </IconButton>
                </Box>
                }
                <Grid item xs sm>
                    <Box clone marginLeft={{xs: '20px', sm: '0'}}>
                        <InputBase
                            fullWidth value={name} {...inputProps}
                            disabled={!isEditing}
                            style={{
                                paddingRight: 12,
                                display: 'block',
                                height: 32,
                                ...(inputProps.style || {})
                            }}/>
                    </Box>
                </Grid>
                <FlexSpace/>
                <IconButton size='small' onClick={() => {
                    setIsEditing(!isEditing)
                }}>
                    {(toShow || isEditing) ? <SettingsIconActive/> :
                        <SettingsIcon/>}
                </IconButton>
            </Grid>
            {(toShow || isEditing) && <Collapse in={isEditing}>
              <div>
                <Box clone flexDirection={{xs: 'column', sm: 'row'}}>
                  <Grid container spacing={2}>
                    <Grid xs item container spacing={1} direction='column'>
                      <NumberField label='Количество' inputProps={{
                          placeholder: '',
                          disabled: !isEditing,
                          style: {
                              boxShadow: theme.shadows[4]
                          },
                          inputProps: {min: 0, max: 100}
                      }}/>
                    </Grid>
                    <Grid xs item container spacing={1} direction='column'>
                      <WinnersField label='Победители' onSelect={onPopperOpen}
                                    inputProps={{
                                        style: {
                                            disabled: !isEditing,
                                            boxShadow: theme.shadows[4]
                                        }
                                    }}/>
                    </Grid>
                  </Grid>
                </Box>
                <Grid container spacing={2} style={{padding: '12px 8px 8px 0'}}>
                  <FlexSpace/>
                  <Button
                    style={{
                        backgroundColor: '#E5EBF1',
                        textTransform: 'none',
                        color: '#55677D',
                        fontWeight: 400,
                        fontSize: 13,
                        height: 26
                    }}
                    onClick={() => {
                        closePopper?.()
                        setIsEditing(!isEditing)
                    }}>Применить</Button>
                </Grid>
              </div>
            </Collapse>
            }
        </Plate>
    </Box>
}

type Prize = {
    name: string,

}
export const EventPrizes: React.FC = () => {

    const [prizes, setPrizes] = useState<Prize[]>([])
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const [item, setItem] = useState<HTMLElement | null>(null)
    return <GrayPlate style={{marginTop: 16}}>
        <Grid container direction='column'>
            <SelectTeamPopper anchorEl={anchorEl} prizeItem={item}/>
            <Grid item>
                <PrizeItem setRef={(x) => setItem(x)} name='100000 рублей'
                           count={10}
                           closePopper={() => setAnchorEl(null)}
                           onPopperOpen={(r) => {
                               if (!anchorEl) {
                                   setAnchorEl(r)
                               } else {
                                   setAnchorEl(null)
                               }
                           }}/>
            </Grid>
            <Grid item container justify='flex-end'>
                <Box clone width='32px' height='32px' marginTop={1} marginRight='10px'>
                <IconButton>
                    +
                </IconButton>
                </Box>
            </Grid>
        </Grid>
    </GrayPlate>
}