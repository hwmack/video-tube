import React from 'react';
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

import { store } from '../models/Store'
import Alert from "react-bootstrap/Alert";

class Login extends React.Component {

    constructor(props) {
        super(props);

        let params = new URL(window.location).searchParams

        // Set the initial state for this component
        this.state = {
            email: '',
            password: '',
            remember: false,
            error: '',
            redirect: params.get('redirect')
        }
    }

    /**
     * Hit the login endpoint
     *
     * @param event
     */
    handleLogin(event) {
        event.preventDefault()

        let headers = new Headers()
        headers.append('Accept', 'application/json')
        headers.append('Content-Type', 'application/json')

        let body = {
            email: this.state.email,
            password: this.state.password,
        }

        if (this.state.remember) {
            body.remember = this.state.remember
        }

        let data = {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        }

        fetch('api/login', data)
            .then(response => response.json().then(body => {
                if (response.status === 200) {
                    // Logged in, go to home page
                    store.dispatch({
                        type: 'LOGIN',
                        user: body.user
                    })

                    // Route to a new page
                    if (this.state.redirect) {
                        window.location = this.state.redirect
                    }
                    store.getState().history.push('/')
                } else if (response.status === 422) {
                    // Display errors from the server
                    if (body.errors.email.length !== 0) {
                        this.setState({
                            ...this.state,
                            error: body.errors.email[0],
                            password: ''
                        })
                    }
                } else {
                    // Some other error
                    console.error('Unexpected response', response)
                }
            }))
            .catch(err => {
                console.error('Error accessing endpoint', err)
            });
    }

    /**
     * Handle form changes of the login
     *
     * @param event
     */
    updateForm(event) {
        switch (event.target.id) {
            case 'formEmail':
                this.setState({
                    ...this.state,
                    email: event.target.value
                })
                break
            case 'formPassword':
                this.setState({
                    ...this.state,
                    password: event.target.value
                })
                break
            case 'formRemember':
                this.setState({
                    ...this.state,
                    remember: event.target.checked
                })
                break
        }
    }

    /**
     * Render the login page
     *
     * @returns {*}
     */
    render() {
        return (
            <Container fluid className='offsetContainer'>
                <Row className='justify-content-xl-center'>
                    <h1>
                        <img src='/logo.svg' id='public-logo'/>
                        VideoTube
                    </h1>
                </Row>
                <Row className='justify-content-xl-center'>
                    <Col lg={4}>
                        <Form onSubmit={this.handleLogin.bind(this)}>
                            <Alert variant='warning' className={!this.state.redirect ? 'd-none' : 'd-block'}>
                                You need to be logged in to view this page
                            </Alert>
                            <Alert variant='danger' className={this.state.error === '' ? 'd-none' : 'd-block'}>
                                {this.state.error}
                            </Alert>
                            <Form.Group controlId='formEmail'>
                                <Form.Label>Email:</Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder='Enter email'
                                    onChange={this.updateForm.bind(this)}/>
                            </Form.Group>

                            <Form.Group controlId='formPassword'>
                                <Form.Label>Password:</Form.Label>
                                <Form.Control
                                    value={this.state.password}
                                    type='password'
                                    placeholder='Enter password'
                                    onChange={this.updateForm.bind(this)}/>
                            </Form.Group>

                            <Form.Group controlId='formRemember'>
                                <Form.Check
                                    type="switch"
                                    label="Remember me"
                                    onChange={this.updateForm.bind(this)}/>
                            </Form.Group>

                            <Button type='submit' variant='primary'>
                                Log In
                            </Button>
                            {' '}
                            <Link to='/register'>
                                <Button variant='outline-primary'>
                                    Register
                                </Button>
                            </Link>
                        </Form>
                        { /* TODO Forgotten password */ }
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default withRouter(Login);