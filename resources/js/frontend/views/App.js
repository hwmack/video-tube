import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Provider } from 'react-redux'

import { store } from '../models/Store'

import Home from './Home'
import Login from './Login'
import Register from './Register'

export default class App extends React.Component {
    constructor(props, context) {
        super(props, context)

        // Create the history
        this.routerHistory = createBrowserHistory()
    }

    onlyAuthed(component) {
        return () => store.getState().isUserAuthenticated ? component : <Login/>
    }

    onlyNotAuthed(component) {
        return () => !store.getState().isUserAuthenticated ? component : <Home/>
    }

    render() {
        return (
            <Provider store={store}>
                <Router history={this.routerHistory}>
                    { /* Need to authenticated for these */ }
                    <Switch>
                        <Route exact path='/video/:id' component={null}/>
                        <Route exact path={'/profile/:id'} component={null}/>
                        <Route exact path={'/profile/:query'} component={null}/>

                        { /* These should only display if logged out */ }
                        <Route exact path='/login' component={this.onlyNotAuthed(<Login test='hello'/>)}/>
                        <Route exact path='/register' component={this.onlyNotAuthed(<Register/>)}/>

                        <Route exact path='/' component={this.onlyAuthed(<Home/>)}/>

                        { /* Show 404 if the route is not found */ }
                        <Route render={() => {
                            // TODO Create a component for this
                            return (
                                <h2>404: Not Found</h2>
                            )
                        }}/>
                    </Switch>
                </Router>
            </Provider>
        )
    }
}
