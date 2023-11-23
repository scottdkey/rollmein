import PlayerCount from "../PlayerCounts/PlayerCount";
import PlayerCard from "./PlayerCard"
import { NewPlayerCard } from "./NewPlayerCard";
import { useGetGroupPlayers } from "../../utils/player.api";
import { useCurrentGroupSlice } from "../../stores/CurrentGroup.slice";
import { useState } from "react";


const PlayerCards = ({ groupId }: { groupId: string }): JSX.Element => {
  const [open, setOpen] = useState(false)

  const rollType = useCurrentGroupSlice(state => state.rollType)

  const { isLoading, data: players } = useGetGroupPlayers({ groupId })

  const onClose = () => {
    setOpen(false)
  }
  const onOpen = () => {
    setOpen(true)
  }

  if (isLoading) {
    return <div className="spinner" />
  }

  return (
    <>
      <button onClick={onOpen}>
        <PlayerCount />
      </button>
      <div className="drawer">
        <button onClick={onClose}>
          <PlayerCount />
        </button>
        <div className='grid wrap'>
          {players && players.map((player) => {
            return (
              <PlayerCard
                id={player.id} rollType={rollType} profilePage={false} />
            )
          })}
          <NewPlayerCard rollType={rollType} groupId={groupId} />
        </div>
      </div>
    </>
  )
}






export default PlayerCards