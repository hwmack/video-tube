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

    return callback =>
        apiRequest('/login', 'POST', body, callback)

}

/**
 * Build a request to be used for logging out
 */
export function logoutRequest() {
    return callback =>
        apiRequest('/logout', 'POST', callback)
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

    return callback => apiRequest('/video', 'POST', body, callback)
}

/**
 * Request to get recommendations for the home page
 */
export function getRecommendationsRequest(page = 1) {
    const url = `/recommendations?page=${page}`
    return callback => apiRequest(url, 'GET', null, callback)
}

/**
 * Request for a search query
 */
export function getSearchVideosRequest(query, page = 1) {
    const url = `/search/${query}?page=${page}`
    return callback => apiRequest(url, 'GET', null, callback)
}

export function getUserRequest(username = null) {
    const url = '/user' + (username == null ? '' : `/${username}`)
    return callback => apiRequest(url, 'GET', null, callback)
}

export function getFollowRequest(id) {
    return callback =>
        apiRequest(`/follow/${id}`, 'POST', null, callback)
}

export function getUnfollowRequest(id) {
    return callback =>
        apiRequest(`/follow/${id}`, 'DELETE', null, callback)
}