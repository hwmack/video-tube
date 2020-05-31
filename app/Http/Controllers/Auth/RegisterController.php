<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\UserController;
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

    /**
     * Register the user but first check the results of the recaptcha token
     */
    protected function registerWithToken(Request $request) {
        if (!$request->has('captcha_token')) {
            return response()->json([
                'captcha' => 'Missing captcha token'
            ])->setStatusCode(422);
        }

        $data = [
            'secret' => env('CAPTCHA_SECRET'),
            'response' => $request->input('captcha_token')
        ];

        $curl = curl_init("https://www.google.com/recaptcha/api/siteverify");
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = json_decode(curl_exec($curl), true);
        curl_close($curl);

        if (isset($response['error-codes'])) {
            return response()->json([
                'errors' => $response['error-codes']
            ])->setStatusCode(422);
        }

        if (!isset($response['success']) || !$response['success']) {
            return response()->json([
                'captcha' => 'Failed Captcha'
            ])->setStatusCode(422);
        }

        return $this->register($request);
    }

    protected function registered(Request $request, $user) {
        // Send verification email to user
        $this->sendVerificationEmail($user);

        // Send the response here
        return response()->json([
            'message' => 'Successfully registered user',
            'user' => UserController::getUserResponse($request->user()),
            'followCount' => $user->followCount(),
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
