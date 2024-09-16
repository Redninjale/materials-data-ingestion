import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { PlusCircle, Gear } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function SideBar() {
    return (
        <Nav className="flex-column bg-dark text-white p-3" style={{ width: '20vw', height: '100vh' }}>
            <Button variant="outline-light" className="mb-3 text-start">
                <PlusCircle className="me-2" /> New Chat
            </Button>
            <div className="flex-grow-1 overflow-auto mb-3">
                <Nav.Link href="#" className="text-white">Chat 1</Nav.Link>
                <Nav.Link href="#" className="text-white">Chat 2</Nav.Link>
                <Nav.Link href="#" className="text-white">Chat 3</Nav.Link>
            </div>
            <Button variant="outline-light" className="text-start">
                <Gear className="me-2" /> Settings
            </Button>
        </Nav>
    );
}