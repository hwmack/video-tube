<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Bookmark extends Model
{
    protected $primaryKey = 'bookmark_id';

    public function video() {
        return $this->hasOne('App\Video', 'id', 'video_id');
    }
}
