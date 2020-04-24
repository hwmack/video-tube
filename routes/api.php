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

use Illuminate\Support\Facades\Mail;
use App\Mail\VerifyEmail;

/**
 *
 */
Route::get('/login', function (Request $request) {

    // Try to send an email

    Mail::to('hayden@example.com')->send(new VerifyEmail());

    return 'some text';
});

Route::middleware('auth:api')->post('/logout', function (Request $request) {
    // Destroys the logged in users authentication
});

/**
 *
 */
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
