<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\VerifyEmail;
use App\User;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller {
    use RegistersUsers;

    public function __construct() {
        // This stops all these endpoints from being hit when logged in
        $this->middleware('guest')->only('register');

        $this->middleware('auth')->only('resendEmail');
    }

    protected function registered(Request $request, $user) {
        // Send verification email to user


        // Send the response here
        return response()->json([
            "message" => "Successfully registered user",
        ]);
    }

    protected function resendEmail(Request $request) {
        // TODO Check if the user is already verified

        $link = $this->sendVerificationEmail($request->user());

        return response()->json([
            'message' => 'Email sent'
        ]);
    }

    protected function validator(array $data) {
        return Validator::make($data, [
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => User::getPasswordValidation(true),
        ]);
    }

    protected function create(array $data) {
        return User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }

    protected function sendVerificationEmail($user) {
        $verifyEmail = new VerifyEmail($user);
        Mail::to($user)->send($verifyEmail);

        return $verifyEmail->link;
    }
}
