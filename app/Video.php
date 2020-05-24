<?php

namespace App;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

use ImageResize;
use FFMpeg;

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

    // Handles all the video conversion stuff
    public function setVideo($file) {
        // Store the video on a public disk
        $this->location = $file
            ->store('videos', $options = [ 'disk' => 'public' ]);

        $video = FFMpeg::fromDisk('public')
            ->open($this->location);

        $this->duration = $video->getDurationInSeconds();

        $tmp_name = date('mdYHis') . uniqid() . '.png';

        // Get a frame from the video and save it to a tmp file
        $video->getFrameFromSeconds(floor($this->duration/2))
            ->export()
            ->toDisk('public')
            ->save('thumbnails_full/' . $tmp_name);
        $test_img = Storage::disk('public')
            ->get('thumbnails_full/' . $tmp_name);


        // Create the directory if it's needed
        Storage::disk('public')->makeDirectory('thumbnails');

        // Resize the image
        ImageResize::make($test_img)->resize(300, 200, function ($constraint) {
            $constraint->aspectRatio();
        })->save('storage/thumbnails/' . $tmp_name);

        $this->thumbnail = $tmp_name;
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
