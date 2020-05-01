<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\User;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Http\Request;

class ResetPasswordController extends Controller {

    /**
     * Allows a user to reset their password when they forget
     */

    use ResetsPasswords;

    /**
     * Override the default password validation rules
     *
     * @return array
     */
    protected function rules() {
        return [
            'token' => 'required',
            'email' => 'required|email',
            'password' => User::getPasswordValidation(true),
        ];
    }

    protected function sendResetResponse(Request $request, $res) {
        return response()->json([
            'message' => $res,
            'user' => $request->user()
        ]);
    }
}
