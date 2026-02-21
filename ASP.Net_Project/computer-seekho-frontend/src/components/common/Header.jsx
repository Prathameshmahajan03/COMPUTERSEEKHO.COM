import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LanguageContext } from '../../context/LanguageContext';
import { FaGlobe } from 'react-icons/fa';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { labels, toggleLanguage, language } = useContext(LanguageContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/">{labels['app.title'] || 'Computer Seekho'}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/">{labels['nav.home'] || 'Home'}</Nav.Link>

                        <NavDropdown title={labels['nav.courses'] || "Courses"} id="courses-dropdown">
                            <NavDropdown.Item as={NavLink} to="/courses">{labels['nav.courses'] || "Courses"}</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title={labels['nav.placements'] || "Placements"} id="placement-dropdown">
                            <NavDropdown.Item as={NavLink} to="/placement">Placement Records</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title={labels['nav.student'] || "Student Corner"} id="student-dropdown">
                            <NavDropdown.Item as={NavLink} to="/faculty">Faculty</NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to="/about">About Us</NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link as={NavLink} to="/contact">{labels['nav.contact'] || "Contact Us"}</Nav.Link>
                    </Nav>
                    <Nav>
                        <Button variant="outline-light" className="me-2" onClick={toggleLanguage}>
                            <FaGlobe /> {language === 'en' ? 'EN' : 'HI'}
                        </Button>
                        {user ? (
                            <>
                                <Nav.Link as={NavLink} to="/admin/dashboard">{labels['nav.dashboard'] || "Dashboard"}</Nav.Link>
                                <Button variant="outline-light" size="sm" onClick={handleLogout} className="ms-2">{labels['nav.logout'] || "Logout"}</Button>
                            </>
                        ) : (
                            <Nav.Link as={NavLink} to="/login">{labels['nav.login'] || "Admin Login"}</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
