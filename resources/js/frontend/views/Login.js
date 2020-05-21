import React from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { loginRequest } from '../models/Requests'

import { store } from '../models/Store'
import Alert from 'react-bootstrap/Alert';
import { apiRequest } from '../helpers/utils';
import { LOGIN } from '../models/Actions';

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
            redirect: params.get('redirect'),

            // Modal related fields
            showModal: false,
            modalEmail: '',
            modalError: '',
            modalSuccess: false,
        }
    }

    /**
     * Hit the login endpoint
     *
     * @param event
     */
    handleLogin(event) {
        event.preventDefault()

        const callback = (response, body) => {
            if (response.status === 200) {
                // Logged in, go to home page
                store.dispatch({
                    type: LOGIN,
                    user: body.user,
                })

                // Route to a new page
                if (this.state.redirect) {
                    // Get the url out of the param and decode it
                    window.location = decodeURIComponent(this.state.redirect)
                } else {
                    store.getState().history.push('/')
                }
            } else if (response.status === 422) {
                // Display errors from the server
                if (body.errors.email.length !== 0) {
                    this.setState({
                        ...this.state,
                        error: body.errors.email[0],
                        password: '',
                    })
                }
            } else {
                // Some other error
                console.error('Unexpected response', response)
            }
        }

        // Build the request and perform it
        loginRequest(this.state.email, this.state.password, this.state.remember)(callback)

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
                    email: event.target.value,
                })
                break
            case 'formPassword':
                this.setState({
                    ...this.state,
                    password: event.target.value,
                })
                break
            case 'formRemember':
                this.setState({
                    ...this.state,
                    remember: event.target.checked,
                })
                break
            case 'modalEmail':
                this.setState({
                    ...this.state,
                    modalEmail: event.target.value,
                })
                break
        }
    }

    forgotPasswordModal() {
        this.setState({
            ...this.state,
            showModal: !this.state.showModal,
            modalEmail: '',
        })
    }

    sendForgotPasswordEmail() {
        this.setState({
            ...this.state,
            modalError: '',
            modalSuccess: false,
        })

        let body = {
            'email': this.state.modalEmail,
        }

        apiRequest('/email/reset', 'POST', body, (response, body) => {
            if (response.status === 200) {
                this.setState({
                    ...this.state,
                    modalError: '',
                    modalSuccess: true,
                })
            } else {
                if (body.errors !== null) {
                    this.setState({
                        ...this.state,
                        modalError: body.errors.email[0],
                    })
                } else {
                    this.setState({
                        ...this.state,
                        modalError: 'Could not send reset password link.',
                    })
                }
            }
        })
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

                            <Row>
                                <Col>
                                    <Form.Group controlId='formRemember'>
                                        <Form.Check
                                            type="switch"
                                            label="Remember me"
                                            onChange={this.updateForm.bind(this)}/>
                                    </Form.Group>
                                </Col>

                                <Col className='d-flex justify-content-end'>
                                    <Button variant='link' onClick={this.forgotPasswordModal.bind(this)}>
                                        Forgot your password?
                                    </Button>
                                </Col>
                            </Row>

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
                        { /* TODO Forgotten password */}
                    </Col>
                </Row>

                {/* Forgotten password modal  */}
                <Modal show={this.state.showModal}
                       onHide={this.forgotPasswordModal.bind(this)}>
                    <Modal.Header>
                        <Modal.Title>
                            Forgot Password
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert variant='danger' className={this.state.modalError === '' ? 'd-none' : 'd-block'}>
                            {this.state.modalError}
                        </Alert>
                        <Alert variant='success' className={this.state.modalSuccess === false ? 'd-none' : 'd-block'}>
                            We have sent a reset password link to you. This will expire in 60 minutes.
                        </Alert>
                        <Form.Group controlId='modalEmail'>
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter email'
                                onChange={this.updateForm.bind(this)}/>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.forgotPasswordModal.bind(this)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.sendForgotPasswordEmail.bind(this)}>
                            Reset Password
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        )
    }
}

export default withRouter(Login);