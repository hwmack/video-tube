<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\User;
use Illuminate\Foundation\Auth\ResetsPasswords;

class ResetPasswordController extends Controller {

    /**
     * Allows a user to reset their password when they forget
     *
     * This is the controller to
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
}
