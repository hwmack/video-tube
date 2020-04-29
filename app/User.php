<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'stripe_ref'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public static function getPasswordValidation($required = false) {
        return [$required ? 'required' : '', 'string', 'min:8',
            'regex:/(?=.*?[A-Z])/', // One uppercase
            'regex:/(?=.*?[a-z])/', // One lowercase
            'regex:/(?=.*?[0-9])/', // One digit
            'regex:/(?=.*?[\/#?!@$%^&*-.])/', // One special character
            // Only check matching, once the format of the password is correct
            $required ? 'confirmed' : ''
        ];
    }
}
