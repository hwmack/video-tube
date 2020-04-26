<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/**
 * By default return the standard view
 */
Route::get('/', function() {
    return view('index');
})->name('home');

/**
 * Verification endpoint for the user's email
 */
Route::namespace('Auth')->group(function() {
    Route::get('/verify/{hash}/{id}/', 'VerificationController@verify')
        ->name('verify');
});

/**
 * Always return the default view, and the frontend wll handle the error
 */
Route::fallback(function () {
    return view('index');
});
