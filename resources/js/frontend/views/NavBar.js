import React from "react"
import { Col, Navbar, Dropdown, NavItem, NavLink, Form, FormControl, Button } from "react-bootstrap"

import apiRequest from "../helpers/utils"
import { store } from '../models/Store'

function handleLogout() {
    apiRequest('/logout', 'GET', null, (response, body) => {
        store.dispatch({type: 'LOGOUT'})
        store.getState().history.push('/')
    })
}

function handleProfile() {
    apiRequest('/user', 'GET', null, (response, body) => {
        // Do something here
    })
}

export default function NavBar(props) {
    return (
        <Navbar bg='dark' variant='dark'>
            <Col>
                <Navbar.Brand href='/'>
                    <img
                        alt=""
                        src="../logo.svg"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    VideoTube
                </Navbar.Brand>
            </Col>
            <Col sm={6} className='d-flex justify-content-center'>
                <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="">Search</Button>
                </Form>
            </Col>
            <Col className='d-flex justify-content-end'>
                <Dropdown as={NavItem} id='nav-dropdown'>
                    <Dropdown.Toggle as={NavLink}/>
                    <Dropdown.Menu flip alignRight>
                        <Dropdown.Item onClick={handleProfile}>Profile</Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
            { /* TODO Display notification underneath, if needed, eg. verification */ }
        </Navbar>
    )
}