<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;

/**
 * Class LoginController
 * @package App\Http\Controllers
 *
 * Handles requests related to the authentication of users
 */
class LoginController extends Controller {
    use AuthenticatesUsers;

    public function __construct() {
        $this->middleware('auth')->except('login');
    }

    public function authenticated(Request $request, $user) {
        return response()->json([
            'message' => 'Authenticated',
            'user' => UserController::getUserResponse($request->user()),
            'followCount' => $request->user()->followCount(),
        ]);
    }

    public function loggedOut(Request $request) {
        return response()->json([
            'message' => 'Logged out',
        ]);
    }

}
