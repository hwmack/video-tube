<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Comment extends Model
{
    protected function user() {
        return $this->belongsTo('App\User');
    }

    protected function video() {
        return $this->belongsTo('App\Video');
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

}
