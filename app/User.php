<?php

namespace App;

use DateTimeInterface;
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
        'password', 'remember_token', 'stripe_ref', 'followers', 'follows', 'notifications'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * A User has many videos
     */
    public function videos() {
        return $this->hasMany('App\Video', 'owner');
    }

    /**
     * A User has many notifications
     */
    public function notifications() {
        return $this->hasMany('App\Notification');
    }

    /**
     * A User has many likes
     */
    public function likes() {
        return $this->hasMany('App\Like');
    }

    /**
     * A User can bookmark many videos
     */
    public function bookmarks() {
        return $this->hasMany('App\Bookmark');
    }

    public function bookmarkedVideos() {
        $bookmarkedVideos = [];
        foreach ($this->bookmarks as $bookmark) {
            $bookmarkedVideos[] = $bookmark->video;
        }
        $this->bookmarkedVideos = $bookmarkedVideos;
    }

    /**
     * A User can follow many other users
     */
    public function follows() {
        return $this->hasMany('App\Follow', 'follower');
    }

    /**
     * A User can be followed by many other users
     */
    public function followers() {
        return $this->hasMany('App\Follow', 'followee');
    }

    /**
     * A User can have a history
     */
    public function history() {
        return $this->hasMany('App\History');
    }

    /**
     * A User can write many comments
     */
    public function comments() {
        return $this->hasMany('App\Comment');
    }

    /**
     * Return the number of followers this user has
     */
    public function followCount() {
        return count($this->followers);
    }

    protected function serializeDate(DateTimeInterface $date) {
        return $date->getTimestamp();
    }

    /**
     * The validator for a valid User object
     */
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
