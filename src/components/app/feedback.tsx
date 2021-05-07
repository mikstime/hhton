import React from 'react'
import {
    Box,
    Grid,
    GridProps,
    IconButton,
    Typography,
    useTheme
} from '@material-ui/core'
import {FONT_BLACK} from '../../style/theme'
import {AdditionalText, GrayishPlate, Plate} from '../common'
import {ReactComponent as EmailIcon} from '../../assets/navigation/email.svg'
import {ReactComponent as TgIcon} from '../../assets/navigation/tg.svg'
import {ReactComponent as VkIcon} from '../../assets/navigation/vk.svg'
import lostImage from '../../assets/image-lost.svg'
import Image from 'material-ui-image/lib/components/Image/Image'

const SocialLink: React.FC<{ title: string, href: string, img: JSX.Element } & GridProps> = (
    {href, title, img, ...rest}
) => {
    return <Grid item container xs alignItems='center' {...rest}>
        <Grid item>
            <a href={href} target='_blank'
               style={{textDecoration: 'none', color: FONT_BLACK}}>
            <IconButton>
                {img}
            </IconButton>
            </a>
        </Grid>
        <Grid item xs>
            <Typography variant='body2'>
                <a href={href} target='_blank'
                   style={{textDecoration: 'none', color: FONT_BLACK}}>
                    {title}
                </a>
            </Typography>
        </Grid>
    </Grid>
}
const Links: React.FC = () => {
    return <Box clone minHeight='32px' borderRadius='0 0 10px 10px'>
        <Plate elevation={4} padding={8}>
            <Grid container direction='column'>
                <SocialLink title='mmbalitsky@gmail.com'
                            href={'mailto:mmbalitsky@gmail.com'}
                            img={<EmailIcon/>}/>
                <SocialLink title='t.me/teamuponline'
                            href={'https://t.me/teamuponline'}
                            img={<TgIcon/>}/>
                <SocialLink title='vk.com/teamuponline'
                            href={'https://vk.com/teamuponline'}
                            img={<VkIcon/>}/>
            </Grid>
        </Plate>
    </Box>
}

export const FeedBackApp: React.FC = () => {
    const theme = useTheme()
    return <Grid container direction='column'>
        <Grid item>
            <Box clone paddingBottom={1}>
                <Typography variant='h2'>
                    Обратная связь
                </Typography>
            </Box>
        </Grid>
        <Grid item container>
            <GrayishPlate style={{padding: 0}}>
                <Image
                    onDragStart={e => e.preventDefault()}
                    style={{
                        backgroundImage: `url("${lostImage}")`,
                        backgroundSize: 'calc(100% + 240px)',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center 55%',
                        borderRadius: '10px 10px 0 0',
                        width: '100%',
                        overflow: 'hidden',
                        paddingTop: 'calc(30%)',
                        backgroundColor: 'transparent',
                        shadow: theme.shadows[4]
                    }}
                    disableTransition
                    imageStyle={{
                        opacity: 0
                    }}
                    src={lostImage}/>
                <Links/>
            </GrayishPlate>
        </Grid>
    </Grid>
}