import { FC } from "react"

type CountItemType = {
  count?: number
  icon: any
  color: string
}

export const CountItem: FC<CountItemType> = ({ count = 0, icon, color }: CountItemType): JSX.Element => {
  return (
    <div>{JSON.stringify({
      count,
      icon,
      color
    })}</div>
  )
}