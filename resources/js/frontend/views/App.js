import React from 'react'
import { Router, Redirect } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Spinner, Row } from "react-bootstrap";

import { store } from '../models/Store'

import Home from './Home'
import Login from './Login'
import Register from './Register'

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true
        }

        this.fetchInitialState()
    }

    fetchInitialState() {
        let headers = new Headers()
        headers.append('Accept', 'application/json')

        let data = {
            method: 'GET',
            headers
        }

        fetch('/api/user', data)
            .then(response => response.json().then(result => {
                if (result.user) {
                    store.dispatch({
                        type: 'LOGIN',
                        user: result.user
                    })
                }

                this.setState({
                    ...this.state,
                    isLoading: false
                })
            }))
            .catch(err => console.error(err))
    }

    render() {
        return (
            <Provider store={store}>
                {!this.state.isLoading ? (
                <Router history={store.getState().history}>
                    <Switch>
                        <Route exact path='/video/:id' component={null}/>
                        <Route exact path={'/profile/:id'} component={null}/>
                        <Route exact path={'/profile/:query'} component={null}/>

                        { /* These should only display if logged out */ }
                        <CustomRoute isPublic title='Register' path='/register'>
                            <Register/>
                        </CustomRoute>

                        <CustomRoute isPublic title='Login' path='/login'>
                            <Login history={store.getState().history}/>
                        </CustomRoute>

                        <CustomRoute path='/' title='Home'>
                            <Home/>
                        </CustomRoute>

                        { /* Show 404 if the route is not found */ }
                        <Route render={() => {
                            // TODO Create a component for this
                            return (
                                <h2>404: Not Found</h2>
                            )
                        }}/>
                    </Switch>
                </Router>
                    ) : (<CustomSpinner/>)}
            </Provider>
        )
    }
}

/******************************************
 * Private components
 ******************************************/

// Can set routes to be either public or private and redirect if the user is authenticated (or not)
function CustomRoute({ children, isPublic, title, ...rest }) {
    // Defaults to a private route
    let checkAuth = store.getState().isUserAuthenticated
    let pathName = '/login'

    // If we want a public route
    if (isPublic === true) {
        checkAuth = !checkAuth
        pathName = '/'
    }

    return (
        <Route
            {...rest}
            exact
            render={({ location }) =>
                checkAuth ? (
                    <TitleComponent title={title}>{children}</TitleComponent>
                ) : (
                    <Redirect
                        to={{
                            pathname: pathName,
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    )
}

// Display a spinner in the middle of the page
function CustomSpinner() {
    return (
        <Row className='align-items-center justify-content-center'
             style={{height: '100vh'}}>
            <Spinner animation="border" />
        </Row>
    )
}

function TitleComponent(props) {
    document.title = props.title + ' | VideoTube'
    return props.children
}
