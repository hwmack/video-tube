import React from 'react'
import { Form, Row, Col, Button } from "react-bootstrap"

import { store } from '../models/Store'
import { apiRequest } from "../helpers/utils";
import { getUserRequest, getUnfollowRequest, getFollowRequest } from '../models/Requests'
import Alert from "react-bootstrap/Alert";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);

        // Set the initial state
        this.state = {
            user: null,
            ownProfile: false,
            followed: false,
        }
    }

    // Once the component has been mounted, get the user
    componentDidMount() {
        this.updateUser()
    }

    // If the url has changed, update the state to the new user
    componentDidUpdate(prevProps) {
        // Update if the props have changed
        if (this.props.match.params.username !== prevProps.match.params.username) {
            this.updateUser()
        }
    }

    // Get the state of the user
    updateUser() {
        const user = store.getState().isUserAuthenticated

        if (this.props.match.params.username !== undefined) {
            /* Get the new user */
            getUserRequest(this.props.match.params.username)((response, body) => {
                if (body.user !== undefined) {
                    this.setState({
                        ...this.state,
                        user: body.user,
                        followed: body.followed,
                        followCount: body.followCount,
                    })
                } else {
                    // No user exists
                }
            })
        } else {
            this.setState({
                ...this.state,
                user,
                ownProfile: true,
                followCount: store.getState().userFollowCount,

                /* State below is only for their own profile */
                formUsername: new String(user.username), // Copy the user's details
                formEmail: new String(user.email),
                formPassword: '',
                editable: false,
                errors: ''
            })
        }
    }

    // Handle when the follow user button was pressed
    handleFollowUser() {
        if (this.state.followed) {
            getUnfollowRequest(this.state.user.id)((request, body) => {
                if (request.status == 200) {
                    this.setState({
                        ...this.state,
                        followed: false,
                        followCount: this.state.followCount - 1,
                    })
                } else {
                    console.error("Error unfollowing user");
                }
            });
        } else {
            getFollowRequest(this.state.user.id)((request, body) => {
                if (request.status == 200) {
                    this.setState({
                        ...this.state,
                        followed: true,
                        followCount: this.state.followCount + 1,
                    })
                } else {
                    console.error("Error following user");
                }
            });
        }
    }

    // Handle input updates to the form
    handleUpdate(event) {
        switch (event.target.id) {
            case 'formEmail':
                this.setState({
                    ...this.state,
                    formEmail: event.target.value
                })
                break
            case 'formUsername':
                this.setState({
                    ...this.state,
                    formUsername: event.target.value
                })
                break
            case 'formPassword':
                this.setState({
                    ...this.state,
                    formPassword: event.target.value
                })
                break
        }
    }

    // Send a request to update the users details
    updateUserDetails(event) {
        event.preventDefault()

        // Send a request to the server
        let body = {}

        if (this.state.formEmail != this.state.user.email) {
            body['email'] = this.state.formEmail
        }

        if (this.state.formUsername != this.state.user.username) {
            body['username'] = this.state.formUsername
        }

        if (this.state.formPassword !== '') {
            body['password'] = this.state.formPassword
        }

        apiRequest('/user', 'PUT', body, (response, body) => {
            // Check if it was a success
            if (response.status === 200) {
                this.setState({
                    ...this.state,
                    user: body.user,
                    errors: ''
                })

                this.toggleEditable()

                store.dispatch({
                    type: 'LOGIN',
                    user: body.user
                })
            } else {
                if (body.errors !== null) {
                    let error = ''
                    if (body.errors.email !== undefined) {
                        error = body.errors.email[0]
                    } else if (body.errors.username !== undefined) {
                        error = body.errors.username[0]
                    } else if (body.errors.password !== undefined) {
                        error = body.errors.password[0]
                    }

                    this.setState({
                        ...this.state,
                        errors: error
                    })
                }
            }
        })
    }

    // Toggle the forms editable state
    toggleEditable() {
        if (this.state.editable === false) {
            this.setState({
                ...this.state,
                editable: !this.state.editable
            })
        } else {
            // Need to reset the values here
            this.setState({
                ...this.state,
                editable: !this.state.editable,
                formUsername: this.state.user.username,
                formEmail: this.state.user.email,
                formPassword: ''
            })
        }
    }

    // Display the form allowing the user to update their details
    currentUserForm() {
        return (
            <Form onSubmit={this.updateUserDetails.bind(this)} style={{marginBottom: '50px'}}>
                <Alert variant='danger' className={this.state.errors === '' ? 'd-none' : 'd-block'}>
                    {this.state.errors}
                </Alert>
                <Form.Group as={Row} controlId='formEmail'>
                    <Form.Label column sm="2">Email: </Form.Label>
                    <Col>
                        <Form.Control type='email'
                                      plaintext={!this.state.editable}
                                      readOnly={!this.state.editable}
                                      value={this.state.formEmail}
                                      onChange={this.handleUpdate.bind(this)}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId='formUsername'>
                    <Form.Label column sm='2'>Username: </Form.Label>
                    <Col>
                        <Form.Control type='text'
                                      plaintext={!this.state.editable}
                                      readOnly={!this.state.editable}
                                      value={this.state.formUsername}
                                      onChange={this.handleUpdate.bind(this)}/>
                    </Col>
                </Form.Group>

                {/* TODO Eventually allow updating password */}
                {!this.state.editable ? null : (
                    <Form.Group as={Row} controlId='formPassword'>
                        <Form.Label column sm="2">Password: </Form.Label>
                        <Col>
                            <Form.Control type='password'
                                          value={this.state.formPassword}
                                          onChange={this.handleUpdate.bind(this)}/>
                        </Col>
                    </Form.Group>
                )}

                {!this.state.editable ? (
                    <Button onClick={this.toggleEditable.bind(this)}>
                        Edit Details
                    </Button>) : (
                    <>
                    <Button type='submit'>
                        Save
                    </Button>{' '}
                    <Button onClick={this.toggleEditable.bind(this)}>
                        Cancel
                    </Button>
                    </>
                    )
                }
            </Form>
        )
    }

    // Show the bookmark button if on another users profile
    showBookmarkButton() {
        // TODO somehow know if the user has been bookmarked
        return (
            <>
                <Button
                    onClick={this.handleFollowUser.bind(this)}>
                    {this.state.followed ? 'Unfollow' : 'Follow'}
                </Button>
            </>
        )
    }

    // Display the profile once its loaded
    showProfile() {
        return (
            <>
                <Row>
                    <Col lg={10}>
                        <h1>{this.state.user.username}'s Profile ({this.state.followCount})</h1>
                    </Col>
                    <Col>
                        {!this.state.ownProfile ? this.showBookmarkButton() : null}
                    </Col>
                </Row>

                {this.state.ownProfile ? this.currentUserForm() : null}

                <hr/>

                <Row>
                    <Col>
                        <h3>Bookmarked Videos</h3>
                        Display liked videos here
                    </Col>
                    <Col>
                        <h3>User's Uploaded Videos</h3>
                        Display the users uploaded videos
                    </Col>
                </Row>
            </>
        )
    }

    // Main render method for component
    render() {
        return (
            <>
                {this.state.user !== null ? this.showProfile() : 'Loading..'}
            </>
        )
    }
}