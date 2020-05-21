/**
 * Library of requests that can be used to retrieve data from the server
 *
 * Each of these methods will return a method that when called, will initiate the call to the server
 * A callback can be passed into the method it returns which happens when a request was successful
 */

import { apiRequest } from '../helpers/utils'

/**
 * Create a login body object and return it from this method, ready to be called with a callback
 */
export function loginRequest(username, password, remember = false) {
    const body = {
        email: username,
        password: password,
    }

    if (remember) {
        body.remember = true
    }

    return callback => {
        apiRequest('/login', 'POST', body, callback)
    }
}

/**
 * Build a request to be used for logging out
 */
export function logoutRequest() {
    return callback => {
        apiRequest('/logout', 'POST', callback)
    }
}

/**
 * Request to create a new video for a user
 */
export function uploadVideoRequest(title, description, tags, video) {
    const body = new FormData()
    body.set('title', title)
    body.set('description', description)
    body.set('tags', tags)
    body.append('video', video)

    return callback => {
        apiRequest('/video', 'POST', body, callback)
    }
}