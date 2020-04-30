
function defaultErrorCallback() {

}


function apiRequest(url, method, body = null, callback = null, errorCallback = defaultErrorCallback) {
    let headers = new Headers()
    headers.append('Accept', 'application/json')
    headers.append('Content-Type', 'application/json')

    let data = {
        method,
        headers,
        body: body != null ? JSON.stringify(body) : null
    }

    return fetch('/api' + url, data)
        .then(response => response.json().then(body => callback(response, body))).catch(errorCallback);
}

export default apiRequest