import React, {Fragment, useMemo} from 'react'
import {User, UserSkill} from '../tools/use-app-state/user'
import {
    Box,
    Chip, Collapse,
    createStyles,
    Grid, IconButton,
    makeStyles,
    Theme, Typography
} from '@material-ui/core'
import {PlateProps} from './plate'
import {useJobs} from '../tools/useJobs'
import {GrayishPlate, GrayPlate} from './gray-plate'
import {ReactComponent as ExpandIcon} from '../../assets/team/expand.svg'
import {ReactComponent as CollapseIcon} from '../../assets/team/collapse.svg'


export type Job = {
    name: string,
    tags: UserSkill[]
}
const useSkillsStyles = makeStyles((t: Theme) => createStyles({
    chip: {
        borderRadius: 8,
        background: 'white',
        marginRight: 16,
        marginBottom: 12
    }
}))
export const SkillsItem: React.FC<{ job: Job }> = ({job}) => {
    const classes = useSkillsStyles()

    const skills = job.tags.map((t, i) => <Chip className={classes.chip} key={i}
                                                label={t.name}/>)
    return <Grid item container wrap='nowrap'>
        <Box clone width='100px'>
            <Grid item>
                <Box clone minHeight='32px' paddingTop='12px'>
                    <Typography>
                        {job.name}
                    </Typography>
                </Box>
            </Grid>
        </Box>
        <Box clone paddingRight='0px' paddingTop='8px'>
            <Grid item xs>
                {skills}
            </Grid>
        </Box>
    </Grid>
}

export const Skills: React.FC<{ user: User, open?: boolean, onToggle?: Function } & PlateProps> = ({user, onToggle, open, ...rest}) => {
    const expanded = open
    const getJobName = useJobs()
    const jobs = useMemo(() => {
        const x = user.skills.tags.reduce((a, s) => {
            if (s.jobId) {
                return {...a, [s.jobId]: [...(a[s.jobId] || []), s]}
            }
            return a
        }, {} as { [key: string]: UserSkill[] })
        return Object.entries(x).map(([k, v]) => ({
            name: getJobName(k),
            tags: v
        }))
    }, [user.skills.tags])

    return <Fragment>
        <Collapse in={!expanded}>
            <Box clone padding='4px 12px !important' marginLeft='110px'>
                <GrayPlate {...rest}>
                    <Grid container alignItems='center' wrap='nowrap'>
                        <Grid item xs>
                            <Typography>
                                {jobs.map(j => j.name).join(' ') || 'Навыки не указаны'}
                            </Typography>
                        </Grid>
                        <Box clone width='30px' height='30px'>
                            <Grid item>
                                {onToggle && jobs.length > 0 &&
                                <IconButton size='small'
                                            onClick={() => onToggle()}>
                                  <ExpandIcon/>
                                </IconButton>
                                }
                            </Grid>
                        </Box>
                    </Grid>
                </GrayPlate>
            </Box>
        </Collapse>
        <Collapse in={expanded}>
            <Box clone padding='4px 12px 0 12px !important'>
                <GrayishPlate {...rest}>
                    <Grid container direction='column' wrap='nowrap'>
                        <Box clone height='0px'>
                            <Grid item container xs>
                                <Box flex={1}/>
                                <Box clone width='30px'>
                                    <Grid item>
                                        {onToggle && <IconButton size='small'
                                                                 onClick={() => onToggle()}>
                                          <CollapseIcon/>
                                        </IconButton>}
                                    </Grid>
                                </Box>
                            </Grid>
                        </Box>
                        {jobs.length > 0 ? jobs.map((j, i) => <SkillsItem
                            job={j} key={i}/>) : <Typography>
                            Навыки не указаны
                        </Typography>}
                    </Grid>
                </GrayishPlate>
            </Box>
        </Collapse>
    </Fragment>
}

export const ChosenSkills: React.FC<{ user: User } & PlateProps> = ({user, ...rest}) => {
    const getJobName = useJobs()
    const jobs = useMemo(() => {
        const x = user.skills.tags.reduce((a, s) => {
            if (s.jobId) {
                return {...a, [s.jobId]: [...(a[s.jobId] || []), s]}
            }
            return a
        }, {} as { [key: string]: UserSkill[] })
        return Object.entries(x).map(([k, v]) => ({
            name: getJobName(k),
            tags: v
        }))
    }, [user.skills.tags])

    return <GrayishPlate {...rest}>
        <Grid container direction='column' wrap='nowrap'>
            {jobs.length > 0 ?
                jobs.map((j, i) => <SkillsItem job={j} key={i}/>) :
                <Typography style={{minHeight: 24}}>
                    {user.isLoading? '' : 'Навыки не указаны'}
                </Typography>}
        </Grid>
    </GrayishPlate>
}