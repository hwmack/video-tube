import { createStore } from 'redux'
import { createBrowserHistory } from 'history'

// TODO Refactor this into multiple reducers eventually

/**
 * Acts as the global store for the whole project
 */
const seedState = {
    history: createBrowserHistory(),
    isUserAuthenticated: false
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isUserAuthenticated: action.user
            }
        case 'LOGOUT':
            return {
                ...state,
                isUserAuthenticated: false
            }
    }
    return state
}

/**
 * Export the store object for the provider
 */
export const store = createStore(reducer, seedState);