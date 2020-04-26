<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\User;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller {
    use RegistersUsers;

    public function __construct() {
        // This stops all these endpoints from being hit when logged in
        $this->middleware('guest');
    }

    protected function registered(Request $request, $user) {
        // Send verification email to user

        // TODO verification email

        // Send the response here
        return response()->json([
            "message" => "Successfully registered user",
        ]);
    }

    protected function validator(array $data) {
        return Validator::make($data, [
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8',
                'regex:/(?=.*?[A-Z])/', // One uppercase
                'regex:/(?=.*?[a-z])/', // One lowercase
                'regex:/(?=.*?[0-9])/', // One digit
                'regex:/(?=.*?[\/#?!@$%^&*-])/', // One special character
                // Only check matching, once the format of the password is correct
                'confirmed'
            ],
        ]);
    }

    protected function create(array $data) {
        return User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }
}
