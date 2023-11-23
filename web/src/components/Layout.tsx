import NavBar from "./Navbar"



export const Layout = (props: React.PropsWithChildren) => {
  return (
    <>
      <NavBar />
      {props.children}
    </>
  )
}

