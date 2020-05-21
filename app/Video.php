<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static where(string $string, $id)
 */
class Video extends Model
{

    /*
     * A video has an owner
     */
    public function owner() {
        return $this->belongsTo('App/User');
    }

    /**
     * A video can have many tags
     */
    public function tags() {
        return $this
            ->belongsToMany('App\Tag')
            ->withTimestamps();
    }
}
