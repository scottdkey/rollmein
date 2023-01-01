import { Wrapper, WrapperVariant } from "./Wrapper"
import NavBar from "./Navbar"




interface LayoutProps {
  variant?: WrapperVariant
}

export const Layout: React.FC<LayoutProps> = ({
  variant, children

}) => {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>
        {children}
      </Wrapper>
    </>
  )
}

