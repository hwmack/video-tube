import React from 'react'
import { Router, Redirect } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Spinner, Row } from "react-bootstrap";

import { store } from '../models/Store'

import Home from './Home'
import Video from './Video'
import Profile from './Profile'
import Login from './Login'
import Register from './Register'
import NotFound from './NotFound'
import LoggedInPage from '../components/LoggedInPage'
import AddVideo from "./AddVideo";
import ResetPassword from './ResetPassword'

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

                this.setLoading(false)
            }))
            .catch(err => console.error(err))
    }

    setLoading(loading) {
        this.setState({
            ...this.state,
            isLoading: loading
        })
    }

    render() {
        return (
            <Provider store={store}>
                {!this.state.isLoading ? (
                <Router history={store.getState().history}>
                    <Switch>
                        <CustomRoute exact path='/' title='Home'>
                            <LoggedInPage>
                                <Home/>
                            </LoggedInPage>
                        </CustomRoute>

                        { /* These should only display if logged out */ }
                        <CustomRoute exact isPublic title='Register' path='/register'>
                            <Register/>
                        </CustomRoute>
                        <CustomRoute exact isPublic title='Login' path='/login'>
                            <Login/>
                        </CustomRoute>
                        <CustomRoute isPublic title='Profile' path='/password/reset/:token'>
                            <ResetPassword/>
                        </CustomRoute>

                        <CustomRoute title='Video' path='/video/add'>
                            <LoggedInPage>
                                <AddVideo/>
                            </LoggedInPage>
                        </CustomRoute>

                        <CustomRoute title='Video' path='/video/:id?'>
                            <LoggedInPage>
                                <Video/>
                            </LoggedInPage>
                        </CustomRoute>

                        <CustomRoute title='Profile' path={['/profile', '/profile/:username']}>
                            <LoggedInPage>
                                <Profile/>
                            </LoggedInPage>
                        </CustomRoute>

                        { /* Show 404 if the route is not found */ }
                        <Route component={NotFound}/>
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

    /**
     * Loop over the children for this component, and pass the new props into it
     *
     * TODO This was a bit of a rushed solution
     */
    const childrenWithProps = childProps =>
        React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, childProps)
            }

            return child;
        })

    return (
        <Route
            exact={true}
            {...rest}
            render={({ location, ...childProps }) =>
                checkAuth ? (
                    <TitleComponent title={title}>{childrenWithProps(childProps)}</TitleComponent>
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
