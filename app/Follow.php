<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    protected $fillable = [
        'follower', 'followee',
    ];

    public function follower() {
        return $this->hasOne('App\User', 'follower');
    }

    public function followee() {
        return $this->hasOne('App\User', 'followee');
    }
}
