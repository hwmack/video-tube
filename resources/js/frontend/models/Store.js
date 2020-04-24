import { createStore } from 'redux'

// TODO Refactor this into multiple reducers eventually

/**
 * Acts as the global store for the whole project
 */
const seedState = {
    isUserAuthenticated: false
}

const reducer = (state, action) => {
    debugger
    switch (action) {

    }
    return state
}

/**
 * Export the store object for the provider
 */
export const store = createStore(reducer, seedState);