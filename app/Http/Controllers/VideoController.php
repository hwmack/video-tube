<?php

namespace App\Http\Controllers;

use App\Video;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Upload a video to the platform
     */
    public function create(Request $request)
    {
        $rules = [
            'video' => 'mimes:mpeg,ogg,mp4,webm,3gp,mov,flv,avi,wmv,ts|max:100040|required',
            'description' => 'required',
            'title' => 'required',
            'tags' => 'nullable'
        ];

        // Validate the incoming data with the rules
        Validator($request->all(), $rules)->validate();

        // Create a new video and fill in its values
        $video = new Video();

        $video->owner = $request->user()->id;
        $video->title = $request->input('title');
        $video->description = $request->input('description');

        // Store the video on a public disk
        $video->location = $request->file('video')
            ->store('videos', $options = [ 'disk' => 'public' ]);

        $video->save();

        // FIXME Create and reference tags

        return response()->json([
            'message' => 'success',
            'video' => $video->id,
        ]);
    }

    public function upload(Request $request, $id)
    {
        // FIXME Must have a video file and an id

        $video = Video::find($id);

        dd($video);

        return response()->json([
            'message' => 'success'
        ]);
    }

    /**
     * User must be owner of the video to update
     */
    public function edit(Request $request)
    {

    }
}
