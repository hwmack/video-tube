<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/**
 * Endpoints related to authentication of users
 */
Route::namespace('Auth')->group(function() {
    Route::post('/login', 'LoginController@login')->name('login');
    Route::get('/logout', 'LoginController@logout')->name('logout');
    Route::post('/register', 'RegisterController@register')->name('register');
//Route::post('/password/reset', '');
//Route::get('/password/reset/{token}', '');
//Route::post('/password/reset/{token}', '');
//Route::get('/email/verify/{token}', '');
});

/**
 *
 */
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::fallback(function() {
    return response()->setStatusCode(404)->json([
        'error' => 'Unknown endpoint'
    ]);
});
