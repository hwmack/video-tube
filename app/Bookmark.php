<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Bookmark extends Model
{
    protected $fillable = [
        'user_id', 'video_id'
    ];

    public function user() {
        return $this->hasOne('App\User', 'id', 'user_id');
    }

    public function video() {
        return $this->hasOne('App\Video', 'id', 'video_id');
    }
}
