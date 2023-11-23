import { SunIcon, MoonIcon } from "@chakra-ui/icons"
import React, { useState, useEffect } from 'react'
import NextLink from "next/link";
import AuthMenu from './AuthMenu';
import styles from "../styles/Navbar.module.scss"
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';


interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({ }) => {
  const { status } = useSession()
  const [colorMode, setColorMode] = useState<'dark' | 'light'>('dark')



  const [currentRoute, setCurrentRoute] = useState("")

  const router = useRouter()


  const routerClassNameSwitch = (routePaths: string[]) => {
    let pathStyle = styles.InactiveItem
    routePaths.forEach(path => {
      if (path === currentRoute) {
        pathStyle = styles.ActiveItem
      }
    })
    return pathStyle
  }

  useEffect(() => {
    setCurrentRoute(router.asPath)
  }, [router.asPath])

  return (
    <div>
      <div className="hStack">
        <div className="vStack">
          <h1 className={styles.SiteHeader}>Roll Me In</h1>
          <div className="hStack">
            <NextLink href={'/'}><div className={routerClassNameSwitch(["/", '/#'])}>Home</div></NextLink>
            {status === "authenticated" ? <NextLink href={'/profile'}>
              <div className={routerClassNameSwitch(["/profile"])}>Profile</div></NextLink> : null}
          </div>
        </div>
        <div>
          <div className="hStack">
            <AuthMenu />
            <div className='square'
              onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}>
              {colorMode === 'dark' ? <MoonIcon /> : <SunIcon />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



export default NavBar

