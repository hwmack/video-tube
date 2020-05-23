import React from 'react'
import {
    Alert,
    Row,
    Col,
    Navbar,
    Dropdown,
    NavItem,
    NavLink,
    Form,
    Button,
    InputGroup,
} from 'react-bootstrap'
import { GoSearch, GoPlus } from 'react-icons/go';
import { Link } from 'react-router-dom'

import { apiRequest } from '../helpers/utils'
import { store } from '../models/Store'
import { LOGOUT, VIDEO_DISPLAY } from '../models/Actions'
import AddVideo from './AddVideo'

function handleLogout() {
    apiRequest('/logout', 'GET', null, _ => {
        store.dispatch({type: LOGOUT})
        store.getState().history.push('/')
    })
}

function handleAddVideo() {
    store.dispatch({
        type: VIDEO_DISPLAY,
        display: true,
    })
}

function handleProfile() {
    store.getState().history.push('/profile')
}

function handleSearch(e) {
    e.preventDefault()
    const query = encodeURIComponent(document.getElementById('search-field').value)
    store.getState().history.push(`/search/${query}`)
}

function resendVerificationEmail() {
    apiRequest('/email/resend', 'POST', null, _ => {
        // TODO add toast to state instead of alert
        alert('Email sent')
    })
}

function displayNotifications(_) {
    if (store.getState().isUserAuthenticated['email_verified_at'] == null) {
        return (
            <Row className='d-flex justify-content-center'>
                <Alert variant='warning'>
                    Please verify your email.
                    If you haven't received it, click{' '}
                    <Alert.Link onClick={resendVerificationEmail}>
                        here
                    </Alert.Link>
                    {' '}and we'll send another.
                </Alert>
            </Row>
        )
    }
}

export default function NavBar(props) {
    let [displayed, setDisplay] = React.useState(false)

    // Hopefully only one of these methods are subscribed, seems like it at the moment
    store.subscribe(_ => {
        setDisplay(store.getState().displayVideoDialog)
    })

    return (
        <>
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
                <Col xs={5} className='d-flex justify-content-center'>
                    <Form id='search-box' onSubmit={handleSearch}>
                        <InputGroup>
                            <Form.Control id='search-field' type='text' placeholder="Search"/>
                            <InputGroup.Append>
                                <Button type='submit' variant="outline-primary"><GoSearch/></Button>
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
            </Navbar>
            {displayNotifications(props.update)}
            {displayed ? <AddVideo/> : ''}
        </>
    )
}