import React from 'react'
import {
    Box, Button,
    Chip,
    Fade,
    Grid,
    Grow,
    Popper,
    Typography
} from '@material-ui/core'
import {Plate} from '../../common'
import {useChipStyles} from '../../common/skill-chip'
import Image from 'material-ui-image'
import {User} from '../../tools/use-app-state/user'
import {useAppState} from '../../tools/use-app-state'
import {ReactComponent as TeamIcon} from '../../../assets/team.svg'
import {PrimaryButton} from '../../common/buttons'

const UserItem: React.FC<{ user: User }> = ({user}) => {
    return <Plate padding={12}>
        <Grid container direction='row' alignItems='center'>
            <Grid item style={{width: 56, marginRight: 16}}>
                <Image src='http://loremflickr.com/200/200'
                       style={{paddingTop: 56}} imageStyle={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%'
                }}/>
            </Grid>
            <Grid xs item container direction='column'>
                <Typography
                    variant='body1'>{user.firstName} {user.lastName}</Typography>
                <Typography
                    variant='body2'>{user.team.name || 'Без команды'}</Typography>
            </Grid>
        </Grid>
    </Plate>
}
const GroupItem: React.FC<{ title: string, users: User[] }> = ({users, title}) => {
    return <Grid direction='column' container>
        <Typography style={{paddingLeft: 12}}>{title}</Typography>
        <Grid item container direction='column'>
            {users.map((u, i) => <UserItem key={i} user={u}/>)}
        </Grid>
    </Grid>
}
export const SelectTeamPopper: React.FC<{
    anchorEl: HTMLButtonElement | null,
    prizeItem: HTMLElement | null
    onClose?: () => void
}> = ({anchorEl, prizeItem}) => {
    const open = !!anchorEl
    const classes = useChipStyles()
    const {user} = useAppState()
    return <Box clone><Popper
        style={{zIndex: 2000, width: prizeItem?.clientWidth ?? ''}}
        open={open} anchorEl={anchorEl} placement='top-end'
        modifiers={{
            flip: {
                enabled: false
            },
            preventOverflow: {
                enabled: true,
                boundariesElement: 'viewport'
            }
        }}
        transition>
        {({TransitionProps}) => (
            <Grow {...TransitionProps}>
                <Plate padding={12} elevation={4}>
                    <Grid container alignItems='center'>
                        <Typography variant='h2' style={{paddingLeft: 12}}>
                            Сортировать по
                        </Typography>
                        <div className={classes.root} style={{margin: '0'}}>
                            <Chip label='Участникам'
                                  className={classes.selected}/>
                            <Chip label='Командам'/>
                        </div>
                        <Grid container direction='column'>
                            <Grid item container style={{
                                maxHeight: '60vh',
                                overflowY: 'auto'
                            }}>
                                <GroupItem users={[user, user, user]}
                                           title='А'/>
                                <GroupItem users={[user, user, user, user]}
                                           title='Б'/>
                            </Grid>
                        </Grid>
                        <Grid item xs container alignItems='center'
                              style={{paddingTop: 16}}>
                            <PrimaryButton style={{flex: 1}}>
                                Готово
                            </PrimaryButton>
                        </Grid>
                    </Grid>
                </Plate>
            </Grow>
        )}
    </Popper>
    </Box>
}