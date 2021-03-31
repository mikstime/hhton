import React, {Fragment} from 'react'
import {
    CardActionArea,
    Grid,
    Hidden, Popover, PopoverProps,
    Typography
} from '@material-ui/core'
import {Plate} from '../../common'
import {Team} from '../../tools/use-app-state/user'
import {PrimaryButton} from '../../common/buttons'

export type Group = {
    title: string,
    teams: (Team & { selected?: boolean })[],
}
export const teamsToGroups = (teams: Team[]) => {
    const groups: Group[] = []
    teams.sort((t1, t2) => {
        if (t1.name > t2.name) return 1
        if (t1.name < t2.name) return -1
        return 0
    }).forEach(t => {
        if (t.name[0] !== groups[groups.length - 1]?.title[0]) {
            groups.push({
                title: t.name[0],
                teams: [t]
            })
        } else {
            groups[groups.length - 1].teams.push({...t, selected: false})
        }
    })
    return groups
}
const TeamItem: React.FC<{
    team: Team, onSelect?: () => void, selected?: boolean, selectable?: boolean
}> = ({team, onSelect, selectable}) => {

    const toRender = <Grid container direction='row' alignItems='center'>
        <Grid xs item>
            <Typography
                variant='body1'>{team.name || 'Команда'}</Typography>
        </Grid>
        <Grid xs item>
            <Typography variant='body2'>
                {team.prizes?.map(p => p?.name ?? '').join('|')}
            </Typography>
        </Grid>
    </Grid>
    if (selectable) {
        // if (selected) {
        //     return <CardActionArea style={{borderRadius: 8}} onClick={onSelect}>
        //         <GrayPlate style={{backgroundColor: '#F0F0F0'}} padding={12}>
        //             {toRender}
        //         </GrayPlate>
        //     </CardActionArea>
        // } else {
        return <CardActionArea style={{borderRadius: 8}} onClick={onSelect}>
            <Plate padding={12}>
                {toRender}
            </Plate>
        </CardActionArea>
        // }
    }
    return <Plate padding={12}>
        {toRender}
    </Plate>
}
const GroupItem: React.FC<{
    title: string, teams: (Team & { selected?: boolean })[],
    selectable?: boolean, onSelect?: (i: number) => void
}> = ({teams, title, selectable, onSelect}) => {
    return <Grid direction='column' container>
        <Typography style={{paddingLeft: 12}}>{title.toUpperCase()}</Typography>
        <Grid item container direction='column'>
            {teams.map((t, i) => <TeamItem
                selectable={selectable}
                selected={t.selected}
                onSelect={() => onSelect?.(i)}
                key={i} team={t}/>)}
        </Grid>
    </Grid>
}
export const SelectTeamPopover: React.FC<{
    anchorEl: HTMLButtonElement | null,
    selectable?: boolean,
    value: Group[],
    onChange?: (g: Group[], i: number, j: number) => void,
    title: string,
    onClose?: (groups: Group[]) => void,
}> = ({anchorEl, onClose, value, onChange, title, selectable}) => {
    const open = !!anchorEl

    const onSelect = (i: number, j: number) => {
        const gs = [...value]
        const g = {...gs[i], teams: [...gs[i].teams]}
        g.teams[j].selected = !g.teams[j].selected
        gs[i] = g
        onChange?.(gs, i, j)
    }

    const groupsToRender = value.map((g, i) => <GroupItem
        selectable={selectable}
        onSelect={(j) => onSelect(i, j)}
        {...g} key={i}/>)
    const toRender = <Plate padding={12} elevation={4}>
        <Grid container alignItems='center'>
            <Typography variant='h2'
                        style={{paddingLeft: 12, marginBottom: 16}}>
                {title}
            </Typography>
            <Grid container direction='column'>
                <Grid item container style={{
                    maxHeight: '60vh',
                    overflowY: 'auto'
                }}>
                    {groupsToRender}
                </Grid>
            </Grid>
            <Grid item xs container alignItems='center'
                  style={{paddingTop: 16}}>
                <PrimaryButton style={{flex: 1}} onClick={() => {
                    onClose?.(value)
                }}>
                    Готово
                </PrimaryButton>
            </Grid>
        </Grid>
    </Plate>

    const props = {
        open,
        anchorEl,
        onClose: () => {
            onClose?.(value)
        },
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
        },
        transformOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
        }
    } as PopoverProps
    return <Fragment>
        <Hidden smUp>
            <Popover
                style={{zIndex: 2000}}
                PaperProps={{
                    style: {
                        width: '90vw'
                    }
                }}
                {...props}
            >
                {toRender}
            </Popover>
        </Hidden>
        <Hidden xsDown mdUp>
            <Popover
                style={{zIndex: 2000}}
                PaperProps={{
                    style: {
                        width: '70vw'
                    }
                }}
                {...props}
            >
                {toRender}
            </Popover>
        </Hidden>
        <Hidden smDown lgUp>
            <Popover
                style={{zIndex: 2000}}
                PaperProps={{
                    style: {
                        width: '600px'
                    }
                }}
                {...props}
            >
                {toRender}
            </Popover>
        </Hidden>
        <Hidden mdDown>
            <Popover
                style={{zIndex: 2000}}
                PaperProps={{
                    style: {
                        width: '600px'
                    }
                }}
                {...props}
            >
                {toRender}
            </Popover>
        </Hidden>
    </Fragment>
}