import React from 'react'
import {PaperProps, Paper} from '@material-ui/core'
import styled from 'styled-components'

export type PlateProps = {
    padding?: number,
} & PaperProps


const PaddedPaper = styled(Paper)`
  flex: 1;
  padding: ${(p: PlateProps) => p.padding || 0}px
`
export const Plate: React.FC<PlateProps> = ({...props}) => {
    return <PaddedPaper elevation={0} {...props}/>
}