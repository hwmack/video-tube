import React from 'react'

/**
 * Default error handler
 */
function defaultErrorCallback(err) {
    console.error(err)
}

/**
 * Perform a request to the api
 */
export function apiRequest(url,
                                   method,
                                   body = null,
                                   callback = null,
                                   errorCallback = defaultErrorCallback) {
    const headers = new Headers()
    headers.append('Accept', 'application/json')

    // Convert a JSON object if it isn't form data
    if (body != null && !(body instanceof FormData)) {
        // Set the content type only if we are sending json
        headers.append('Content-Type', 'application/json')
        body = JSON.stringify(body)
    }

    // Combined the data we will send to the server
    const data = {method, headers, body}

    // Perform the request to the server, convert to json and run the callback if it's set
    fetch('/api' + url, data)
        .then(response => response.json().then(
            body => {
                // Only run the callback if it isn't null
                if (callback != null) callback(response, body)
            }).catch(err => console.error(`JSON error while parsing from ${url}\nError is: ${err}`))
        ).catch(errorCallback);
}

/**
 * Loop over the children, and pass props into it
 */
export function childrenWithProps(children, childProps) {
    return React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, childProps)
        }

        return child;
    })
}