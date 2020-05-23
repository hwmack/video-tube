import { createStore } from 'redux'
import { createBrowserHistory } from 'history'
import * as actions from './Actions'


// TODO Refactor this into multiple reducers eventually

/**
 * Acts as the global store for the whole project
 */
const seedState = {
    history: createBrowserHistory(),
    isUserAuthenticated: false,
    userFollowCount: 0,
    displayVideoDialog: false,
}

const reducer = (state = seedState, action) => {
    switch (action.type) {
        case actions.LOGIN:
        case actions.REGISTER:
            return {
                ...state,
                isUserAuthenticated: action.user,
                userFollowCount: action.followCount,
            }
        case actions.LOGOUT:
            return {
                ...state,
                isUserAuthenticated: false,
            }
        case actions.VIDEO_DISPLAY:
            return {
                ...state,
                displayVideoDialog: action.display,
            }
        default:
            return state
    }
}

/**
 * Export the store object for the provider
 */
export const store = createStore(reducer, seedState);