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

Route::get('/video/{id}', function ($id) {
    // Check the video if it exists
    return view('index');
});

/*
 * Default route
 */
Route::get('/{any?}', function ($any = '') {
    switch ($any) {
        case '':
        case 'login':
        case 'register':
            return view('index');
        default:
            return view('fallback');
    }
})->where('any', '.*');

Route::fallback(function () {
    return view('fallback');
});

Route::get('/home', 'HomeController@index')->name('home');
