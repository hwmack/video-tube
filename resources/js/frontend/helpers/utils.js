
function defaultErrorCallback() {

}


function apiRequest(url, method, body, callback = null, errorCallback = defaultErrorCallback) {
    let headers = new Headers()
    headers.append('Accept', 'application/json')
    headers.append('Content-Type', 'application/json')

    let data = {
        method,
        headers,
        body: JSON.stringify(body)
    }

    return fetch('/api' + url, data)
        .then(response => response.json().then(body => callback(response, body))).catch(errorCallback);
}

export default apiRequest