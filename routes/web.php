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

Route::namespace('Auth')->group(function() {
    /**
     * Verification endpoint for the user's email
     */
    Route::get('/verify/{hash}/{id}/', 'VerificationController@verify')
        ->name('verify');
});

Route::get('/verified', 'HomeController@index')->name('verified');

/**
 * Display form to reset password (The frontend will handle it)
 */
Route::get('/password/reset/{token}', 'HomeController@index')
    ->name('password.reset');

/**
 * If the user needs to be logged in for a url
 */
Route::get('/login?redirect={url}', 'HomeController@index')->name('login');

/**
 * By default return the standard view
 */
Route::get('/', 'HomeController@index')->name('home');

/**
 * Always return the default view, and the frontend will handle the error
 */
Route::fallback('HomeController@index');
