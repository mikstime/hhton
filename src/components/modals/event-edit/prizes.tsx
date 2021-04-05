import React, {
    ChangeEventHandler,
    useCallback,
    useRef,
    useState
} from 'react'
import {AdditionalText, FlexSpace, GrayPlate, Plate} from '../../common'
import {
    Box, Button, ButtonProps,
    Collapse,
    Grid, IconButton,
    InputBase,
    InputBaseProps, Tooltip,
    Typography, useTheme
} from '@material-ui/core'
import {ReactComponent as SettingsIconActive} from '../../../assets/settings_prizes1.svg'
import {ReactComponent as SettingsIcon} from '../../../assets/settings_prizes.svg'
import {ReactComponent as TeamIcon} from '../../../assets/team.svg'
import {ReactComponent as DeleteIcon} from '../../../assets/delete.svg'
import {NumberField} from './general'
import {Group, SelectTeamPopover} from './select-team-popover'
import {useAppState} from '../../tools/use-app-state'
import {Prize} from '../../tools/use-app-state/user'

const WinnersField: React.FC<{ label: string, inputProps?: ButtonProps, onSelect?: (r: HTMLButtonElement) => void }> = ({onSelect, label, inputProps: {onClick, ...rest} = {}}) => {
    const r = useRef<HTMLButtonElement>(null)
    const {event} = useAppState()
    const toRender = <Grid item xs container alignItems='center'
                           justify='flex-end'>
        <Grid xs={12} md='auto' item style={{marginRight: 16}}>
            <Box clone textAlign={{md: 'right'}}>
                <Typography variant='body2' style={{color: '#6F7985'}}>
                    {label}
                </Typography>
            </Box>
        </Grid>
        <Box clone flex={{xs: 1, md: ''}} onClick={() => {
            if (r.current)
                onSelect?.(r.current)
        }}>
            <Button disabled={!event.isFinished} ref={r} {...rest} style={{
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
    if (event.isFinished)
        return toRender

    return <Tooltip
        title='Выбор победителя станет доступен после завершения мероприятия'>
        {toRender}
    </Tooltip>
}

const PrizeItem: React.FC<{
    inputProps?: InputBaseProps,
    index: number,
    onPopperOpen?: (e: HTMLButtonElement) => void,
    onEditClick?: () => void,
    closePopper?: () => void,
    onCountChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    onNameChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    onWinnersChange?: () => void,
    onDeleteClick?: () => void,
    name?: string,
    count: string,
    isEditing?: boolean,
}> = ({
          inputProps = {}, onDeleteClick, onCountChange,
          onNameChange, closePopper, onPopperOpen, isEditing, onEditClick,
          name = '', count = 0, index
      }) => {
    const theme = useTheme()
    const {event} = useAppState()

    const nameField = isEditing ? <InputBase
            fullWidth
            value={name}
            onChange={onNameChange}
            {...inputProps}
            disabled={!isEditing || event.isFinished}
            placeholder='Приз'
            style={{
                paddingRight: 12,
                display: 'block',
                height: 32,
                ...(inputProps.style || {})
            }}/> :
        <AdditionalText>{name || 'Нажмите на шестеренку для изменения'
        }</AdditionalText>

    const countField = <Grid xs item container spacing={1}
                             direction='column'>
        <NumberField label='Количество' inputProps={{
            placeholder: '1',
            disabled: !isEditing || event.isFinished,
            style: {
                boxShadow: theme.shadows[4]
            },
            inputProps: {min: 0, max: 100},
            value: count,
            onChange: onCountChange
        }}/>
    </Grid>

    return <Box clone marginTop={{xs: '16px', sm: '16px'}}>
        <Plate padding={12}>
            <Grid container alignItems='center'
                  style={{minHeight: 32}}>
                <Box clone width={isEditing ? 32 : 0}>
                    <IconButton size='small'
                                disabled={!isEditing || event.isFinished}
                                onClick={onDeleteClick}
                                style={{marginRight: 12, transition: '.3s'}}>
                        <DeleteIcon/>
                    </IconButton>
                </Box>
                <Grid item xs sm>
                    <Typography variant='body1'>{index} место</Typography>
                    {/*<Box clone marginLeft={{xs: '20px', sm: '0'}}>*/}
                        {nameField}
                    {/*</Box>*/}
                </Grid>
                <IconButton size='small' onClick={onEditClick}>
                    {isEditing ? <SettingsIconActive/> :
                        <SettingsIcon/>
                    }
                </IconButton>
            </Grid>
            <Collapse in={isEditing}>
                <div>
                    <Box clone flexDirection={{xs: 'column', sm: 'row'}}>
                        <Grid container spacing={2}>
                            {event.isFinished ?
                                <Tooltip
                                    title='Изменение призов невозможно после окончания мероприятия'>{countField}</Tooltip>
                                : countField}
                            <Grid xs item container spacing={1}
                                  direction='column'>
                                <WinnersField label='Победители'
                                              onSelect={onPopperOpen}
                                              inputProps={{
                                                  style: {
                                                      disabled: !isEditing,
                                                      boxShadow: theme.shadows[4]
                                                  }
                                              }}/>
                            </Grid>
                        </Grid>
                    </Box>
                    <Grid container spacing={2}
                          style={{padding: '12px 8px 8px 0'}}>
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
                                onEditClick?.()
                            }}>Применить</Button>
                    </Grid>
                </div>
            </Collapse>
        </Plate>
    </Box>
}

export const EventPrizes: React.FC<{
    prizes: {
        value: Prize[],
        onChange: (p: Prize[], d: string[]) => void,
    },
    groups: {
        value: Group[],
        onChange: (g: Group[], d: {wID: string, dpID: string, upID: string}) => void
    }
}> = ({prizes, groups}) => {
    const {event} = useAppState()
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const [editing, setEditing] = useState<boolean[]>([])
    const [deletedPrizes, setDeletedPrizes] = useState([] as string[])
    const toRender = prizes.value.map((p, i) => (
        <Grid item container key={'p-item' + i}>
            <PrizeItem name={p.name} index={i + 1}
                       onEditClick={() => {
                           const x = editing[i]
                           const e = [...editing.map(_ => false)]
                           e[i] = !x
                           setEditing(e)
                       }}
                       onNameChange={(e) => {
                           const v = [...prizes.value]
                           v[i].name = e.target.value
                           prizes.onChange(v, [])
                       }}
                       onCountChange={(e) => {
                           const v = [...prizes.value]
                           v[i].count = e.target.value
                           prizes.onChange(v, [])
                       }}
                       onDeleteClick={() => {
                           const v = [...prizes.value]
                           const newDeletedPrizes = deletedPrizes.concat(v[i].id ?? '-1')
                           v.splice(i, 1)
                           const e = [...editing]
                           e.splice(i, 1)
                           setDeletedPrizes(newDeletedPrizes)
                           setEditing(e)
                           prizes.onChange(v, newDeletedPrizes)
                       }}
                       count={p.count}
                       isEditing={editing[i]}
                       closePopper={() => setAnchorEl(null)}
                       onPopperOpen={(r) => {
                           if (!anchorEl) {
                               setAnchorEl(r)
                           } else {
                               setAnchorEl(null)
                           }
                       }}/>
        </Grid>)
    )

    const addPrize = useCallback(() => {
        const p = {
            name: '',
            count: '1'
        }
        setEditing([...editing.map(_ => false), true])
        prizes.onChange([...prizes.value, p], [])
    }, [prizes.value, setEditing])

    const onGroupsChange = useCallback((g: Group[], i: number, j: number) => {
        // TODO id призов не должно быть пустым
        if (!g[i].teams[j].prizes) g[i].teams[j].prizes = []

        const p = prizes.value[editing.indexOf(true)]
        const deletedPrize = {wID: g[i].teams[j].id ?? '', dpID: '', upID: ''}
        if (p) {
            const ind = g[i].teams[j].prizes?.findIndex(x => x?.id === p?.id)
            if (ind === -1) {
                // TODO Ограничил количество призов на команду
                // g[i].teams[j].prizes?.push(p)
                g[i].teams[j].prizes = [p]
                deletedPrize.upID = p?.id ?? ''
            } else {
                if (ind !== undefined) {
                    g[i].teams[j].prizes?.splice(ind, 1)
                    deletedPrize.dpID = p?.id ?? ''
                }
            }
        }

        groups.onChange(g, deletedPrize)
    }, [groups.onChange, editing, prizes.value])

    return <GrayPlate style={{marginTop: 16}}>
        <Grid container direction='column'>
            <SelectTeamPopover anchorEl={anchorEl}
                               selectable
                               title='Доступные команды'
                               value={groups.value}
                               onChange={onGroupsChange}
                               onClose={() => {
                                   setAnchorEl(null)
                               }}/>
            {toRender.length > 0 && toRender}
            <Grid item container justify='flex-end'>
                {toRender.length === 0 &&
                  <Typography variant='body2' style={{lineHeight: '48px', marginRight: '32px'}}>Нажмите
                    на иконку справа, чтобы
                    добавить награду</Typography>}
                <Box clone width='32px' height='32px' marginTop={1}
                     marginBottom={1}
                     marginRight='10px'>
                    <IconButton disabled={event.isFinished} onClick={addPrize}>
                        +
                    </IconButton>
                </Box>
            </Grid>
        </Grid>
    </GrayPlate>
}