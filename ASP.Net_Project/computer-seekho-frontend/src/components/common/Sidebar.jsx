import React, { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
    return (
        <div className="bg-light border-end" style={{ minHeight: '100vh', padding: '20px' }}>
            <h5 className="mb-4 text-center">Admin Menu</h5>
            <ListGroup variant="flush">
                <ListGroup.Item action as={NavLink} to="/admin/dashboard">
                    Dashboard
                </ListGroup.Item>
                <ListGroup.Item action as={NavLink} to="/admin/followups">
                    Follow-ups
                </ListGroup.Item>
                <ListGroup.Item action as={NavLink} to="/admin/enquiries">
                    Enquiries
                </ListGroup.Item>
                <ListGroup.Item action as={NavLink} to="/admin/register-student">
                    Register Student
                </ListGroup.Item>
                <ListGroup.Item action as={NavLink} to="/admin/students">
                    Registered Students
                </ListGroup.Item>
                <ListGroup.Item action as={NavLink} to="/admin/payments">
                    Payments
                </ListGroup.Item>
                <ListGroup.Item action as={NavLink} to="/admin/masters">
                    Masters
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
};

export default Sidebar;
