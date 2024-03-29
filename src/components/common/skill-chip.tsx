import {
    createStyles,
    makeStyles,
    Theme
} from '@material-ui/core'


export const useChipStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            minHeight: 48,
            flexWrap: 'wrap',
            margin: '16px -16px 16px -16px',
            '& > *': {
                margin: theme.spacing(1),
                borderRadius: 8,
                border: '1px solid #00000008',
                boxShadow: theme.shadows[4],
                color: theme.palette.primary.main,
                cursor: 'pointer',
                '&:hover': {
                    background: 'white'
                },
                '&:active': {
                    background: '#F7F8FA',
                    boxShadow: 'none'
                },
                '&:focus': {
                    background: 'white'
                },
            }
        },
        default: {
            background: 'white',
        },
        selected: {
            background: '#F0F2F5',
            border: '1px solid #D3D9DE',
            color: '#222222',
            boxShadow: 'none',
            '&:hover': {
                background: '#F0F2F5',
                boxShadow: 'none'
            },
            '&:focus': {
                background: '#F0F2F5',
                boxShadow: 'none'
            },
            '&:active': {
                background: '#F0F2F5',
                boxShadow: 'none'
            },
        },
        notSelected: {
            opacity: 0.3,
            '&:hover': {
                background: 'white'
            },
            '&:active': {
                background: '#F7F8FA'
            }
        },
        contains: {
            background: 'white',
            color: '#222222',
        }
    })
)