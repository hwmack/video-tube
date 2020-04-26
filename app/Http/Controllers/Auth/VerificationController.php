<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\VerifiesEmails;
use Illuminate\Http\Request;

class VerificationController extends Controller {
    use VerifiesEmails;

    public function __construct() {
        $this->middleware('auth');
        $this->middleware('signed')->only('verify');
        $this->middleware('throttle:6,1')->only('verify', 'resend');
    }

    public function verified(Request $request) {
        // Redirect to the frontend, which will display a success page
        return response()
            ->redirectTo('verified');
    }
}
