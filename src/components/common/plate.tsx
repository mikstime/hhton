import React from 'react'
import {PaperProps, Paper} from '@material-ui/core'
import styled from 'styled-components'

export type PlateProps = {
    padding?: number,
} & PaperProps


const PaddedPaper = styled(Paper)`
  flex: 1;
  ${(p: PlateProps) => p.padding ? `padding: ${p.padding}px` : ''}
`
export const Plate: React.FC<PlateProps> = ({...props}) => {
    return <PaddedPaper elevation={0} {...props}/>
}