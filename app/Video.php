<?php

namespace App;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

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

    public function getCreatedAtAttribute() {
        $created = new Carbon($this->attributes['created_at']);
        $now = now();

        $minuteDiff = $created->diffInMinutes($now);
        $hourDiff = $created->diffInHours($now);
        $dayDiff = $created->diffInDays($now);
        $monthDiff = $created->diffInMonths($now);
        $yearDiff = $created->diffInYears($now);

        if ($created->isCurrentMinute() || $minuteDiff == 0) {
            return 'a minute ago';
        }

        if ($created->isCurrentHour() || $hourDiff == 0) {
            return $minuteDiff . ' minutes ago';
        }

        if ($created->isCurrentDay() || $dayDiff == 0) {
            return  $hourDiff . ' hours ago';
        }

        if ($created->isCurrentMonth() || $$monthDiff == 0) {
            return $dayDiff . ' days ago';
        }

        if ($created->isCurrentYear() || $yearDiff == 0) {
            return  $monthDiff . ' months ago';
        }

        return $yearDiff . ' years ago';
    }

    protected function serializeDate(DateTimeInterface $date) {
        return $date->getTimestamp();
    }

}
