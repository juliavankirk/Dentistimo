import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import Logo from '../assets/Logo'

const Nav = styled.div`
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: transparent;
    position: fixed;
    left: 0;
    right: 0;

`
const Menu = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    position: relative;
    margin: 0 2rem;

    @media (max-width: 426px) {
      justify-content: space-between;
      margin-left: -1.5rem;
      align-items: center;
      overflow: hidden;
      width: 100%;
}
`

const MenuLink = styled(NavLink)`
    padding: 1rem 1rem;
    text-align: center;
    text-decoration: none;
    color: #000;
    font-size: 1rem;
    font-family: "DMSans-Regular";
`

const Navbar = () => {
  return (
    <Nav>
        <MenuLink to="/">
          <Logo />
        </MenuLink>
        <Menu>
            <MenuLink to="/">
                <span>Clinic Registry</span>
            </MenuLink>
        </Menu>
    </Nav>
  )
}

export default Navbar