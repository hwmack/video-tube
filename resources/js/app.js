/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

import React from 'react'
import * as ReactDOM from "react-dom"
import { store } from './frontend/models/Store'
import App from './frontend/views/App'

require('./bootstrap')

window['store'] = store;

ReactDOM.render(
    <App />,
    document.getElementById('app'))