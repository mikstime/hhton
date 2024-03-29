import React from 'react'
import {PaperProps, Paper} from '@material-ui/core'
import styled from 'styled-components'

export type PlateProps = {
    padding?: number | string,
} & PaperProps


const PaddedPaper = styled(Paper)`
  flex: 1;
  ${(p: PlateProps) => p.padding ? `padding: ${typeof p.padding === 'number' ?`${p.padding}px` : p.padding}` : ''}
`
export const Plate: React.FC<PlateProps> = ({...props}) => {
    return <PaddedPaper elevation={0} {...props}/>
}