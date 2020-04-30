import React from "react"
import {
    Col,
    Navbar,
    Dropdown,
    NavItem,
    NavLink,
    Form,
    FormControl,
    Button,
    InputGroup
    } from "react-bootstrap"
import { GoSearch, GoPlus } from "react-icons/go";

import apiRequest from "../helpers/utils"
import { store } from '../models/Store'
import {Link} from "react-router-dom";

function handleLogout() {
    apiRequest('/logout', 'GET', null, (response, body) => {
        store.dispatch({type: 'LOGOUT'})
        store.getState().history.push('/')
    })
}

function handleAddVideo() {
    store.getState().history.push('/video/add')
}

function handleProfile() {
    store.getState().history.push('/profile')
}

export default function NavBar(props) {
    return (
        <Navbar bg='light' variant='light'>
            <Col>
                <Link to='/'>
                    <Navbar.Brand>
                        <img
                            src="/logo.svg"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        VideoTube
                    </Navbar.Brand>
                </Link>
            </Col>
            <Col sm={8} className='d-flex justify-content-center'>
                <Form inline>
                    <InputGroup>
                        <FormControl type="text" placeholder="Search" className='flex-fill' />
                        <InputGroup.Append>
                            <Button variant="outline-primary"><GoSearch/></Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
            </Col>
            <Col className='d-flex justify-content-end'>
                <Button onClick={handleAddVideo}><GoPlus/></Button>
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