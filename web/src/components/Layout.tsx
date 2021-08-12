import { Wrapper, WrapperVariant } from "./Wrapper"
import dynamic from "next/dynamic"




interface LayoutProps {
  variant?: WrapperVariant
}

export const Layout: React.FC<LayoutProps> = ({
  variant, children

}) => {
  const Navbar = dynamic(() => import("./NavBar"))
  return (
    <>
      <Navbar />
      <Wrapper variant={variant}>
        {children}
      </Wrapper>
    </>
  )
}

