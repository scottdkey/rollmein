import React from "react"


export interface IconWrapperType {
  Icon: any
  onClick: Function
  selected: boolean
  color?: string
  disableHover?: boolean
}

export const IconWrapper: React.FC<IconWrapperType> = ({ Icon, onClick, selected, color = "teal", disableHover = false }): JSX.Element => {
  return (
    <button
      onClick={() => {
        onClick()
      }}>
      <div>{JSON.stringify({ selected, color, disableHover, Icon })}</div>
    </button>
  )
}