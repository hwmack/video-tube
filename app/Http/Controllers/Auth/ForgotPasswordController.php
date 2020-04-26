<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;

class ForgotPasswordController extends Controller {

    /**
     * This controller allows a user to reset their forgotten password
     */

    use SendsPasswordResetEmails;
}
