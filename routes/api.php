<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \Illuminate\Support\Facades\Auth;

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
    Route::post('/email/resend', 'RegisterController@resendEmail')->name('resendVerification');

    // Routes dealing with resetting a forgotten password
    Route::post('/email/reset', 'ForgotPasswordController@sendResetLinkEmail');
    Route::post('/password/reset', 'ResetPasswordController@reset');
});

/**
 * Retrieve information about the current user (or a specified user)
 */
Route::get('/user/{username?}', 'UserController@get')->name('getUser');

/**
 * Allows a user to update their own personal details
 */
Route::put('/user', 'UserController@update')->name('updateDetails');

Route::post('/follow/{id}', 'UserController@followUser')->name('followUser');
Route::delete('/follow/{id}', 'UserController@unFollowUser')->name('unFollowUser');

/**
 * Routes related to video uploading and downloading
 */
Route::post('/video', 'VideoController@create')->name('createVideo');
Route::put('/video/{id}', 'VideoController@update')->name('updateVideo');
Route::delete('/video/{id}', 'VideoController@delete')->name('deleteVideo');
Route::get('/video/{id}', 'VideoController@get')->name('videoDetails');

Route::post('/bookmark/{id}', 'BookmarkController@addBookmark')->name('addBookmark');
Route::delete('/bookmark/{id}', 'BookmarkController@removeBookmark')->name('rmBookmark');

/*
 * TODO This will probably be moved to websockets later
 */
//    Route::get('/comments/{video_id}')->name('getComments');
//    Route::post('/comments/{video_id}')->name('createComment');

//    Route::post('/like/{object_id}', 'LikeController@like')->name('createLike');
//    Route::delete('/like/{object_id}', 'LikeController@dislike')->name('createLike');


Route::get('/search/{query}', 'HomeController@search')->name('searchVideos');
Route::get('/recommendations', 'HomeController@videos')->name('getRecommendations');

Route::any('/', function (){
    return response()->json([
        'message' => 'Welcome'
    ])->setStatusCode(200);
});

Route::any('{all}', function() {
    return response()->json([
        'error' => 'Unknown endpoint'
    ])->setStatusCode(404);
})->where('all', '.*');
