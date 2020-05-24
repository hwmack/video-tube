<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    protected $table = 'history';

    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id', 'video_id'
    ];

    protected function user() {
        return $this->hasOne('App\User');
    }

    protected function video() {
        return $this->hasOne('App\Video');
    }
}
