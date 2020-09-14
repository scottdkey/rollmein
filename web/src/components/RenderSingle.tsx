import React from 'react'
import { PlayerObject } from './utils/Interfaces'

type RenderSingleProps = {
  player: PlayerObject,
  header: string
}

const RenderSingle = ({ player, header }: RenderSingleProps) => {
  if (player === undefined) {
    return null
  } else {
    return (
      <><h3>{header}: </h3>{player.name}</>
    )
  }
}

export default RenderSingle