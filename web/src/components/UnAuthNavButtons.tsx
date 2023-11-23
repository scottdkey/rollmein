
import { useState } from "react"
import LoginMenu from "./LoginMenu"
import RegisterMenu from "./RegisterMenu"

const UnAuthComponents = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState('login')


  return (
    <>
      <button onClick={() => setActiveTab('login')}>login</button>
      <button onClick={() => setActiveTab('register')}>register</button>
      <ActiveTab tab={activeTab} />
    </>
  )
}

export default UnAuthComponents

const ActiveTab = ({ tab }: { tab: string }) => {
  switch (tab) {
    case 'login':
      return <LoginMenu />
    case 'register':
      return <RegisterMenu />
    default:
      return <>something went wrong</>
  }

}