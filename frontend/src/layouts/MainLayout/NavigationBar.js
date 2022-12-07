import { useNavigate,NavLink } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import NavItem from 'react-bootstrap/NavItem';

import Logo from '../../assets/Logo';

const NavigationBar = (props) => {
    return (
        <>
        <div class="shadow bg-white">
        <Navbar bg="light" variant="light" sticky="top">
            <Container>
                <Navbar.Brand href="/">
                    <Logo />
                    {' '}
                    Dentistimo
                </Navbar.Brand>
                <Nav className="justify-content-center">
                    <Nav.Link href='#'>Clinics</Nav.Link>
                    <Nav.Link href='#'>Doctors</Nav.Link>
                    <Nav.Link href='#'>Book Appointment</Nav.Link>
                    <Dropdown as={NavItem}>
                        <Dropdown.Toggle as={Nav.Link}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                            </svg> Profile</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {/* Dashboard links to home page until we create the different user roles */}
                            <Dropdown.Item href="/">Dashboard</Dropdown.Item>
                            <Dropdown.Item href="/settings">Settings</Dropdown.Item>
                            <Dropdown.Item>Log Out</Dropdown.Item>
                        </Dropdown.Menu>                        
                    </Dropdown>
                </Nav>
            </Container>
        </Navbar>
        </div>
        </>
    )
}

export default NavigationBar