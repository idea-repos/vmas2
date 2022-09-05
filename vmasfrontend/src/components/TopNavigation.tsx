import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

function TopNavigation() {
    let navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/login')
    }
    return (
        <Navbar>
            <Container>
                <Navbar.Brand >Azhar Uddin Sheikh</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <button onClick={logout} type="button" className="btn btn-outline-danger">Logout</button>
                    </Navbar.Text>
                </Navbar.Collapse>
                </Container>
        </Navbar>
    );
}

export default TopNavigation;