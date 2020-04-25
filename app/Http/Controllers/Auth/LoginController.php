<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use http\Env\Response;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;

/**
 * Class LoginController
 * @package App\Http\Controllers
 *
 * Handles requests related to the authentication of users
 */
class LoginController extends Controller
{
    use AuthenticatesUsers;

    public function __construct() {
        $this->middleware('auth')->except('login');
    }

    public function authenticated(Request $request, $user) {
        return response()->json([
            "message" => "Authenticated",
        ]);
    }

    public function loggedOut(Request $request) {
        return response()->json([
            "message" => "Logged out"
        ]);
    }

}
