import { Wrapper, WrapperVariant } from "./Wrapper"
import dynamic from "next/dynamic"




interface LayoutProps {
  variant?: WrapperVariant
}

export const Layout: React.FC<LayoutProps> = ({
  variant, children
}) => {
  const NavBar = dynamic(() => import("./NavBar"))
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>
        {children}
      </Wrapper>
    </>
  )
}

