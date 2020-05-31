<?php

namespace App\Http\Controllers;

use App\History;
use App\Video;
use App\Tag;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Get all the information needed to display the video page
     */
    public function get(Request $request, $id) {
        $video = Video::find($id);

        // Update the video count
        $video->timestamps = false;
        $video->watch_count = $video->watch_count + 1;
        $video->save();
        $video->timestamps = true;

        // Add an item to the history table (This will be used for recommendations)
        History::firstOrCreate([
            'user_id' => $request->user()->id,
            'video_id' => $video->id,
        ]);

        // Get these details from the model
        $video->tags;
        $video->user;

        foreach ($video->comments as $comment) {
            $comment->user;
        }

        $video->hasBeenBookmarked($request->user());

        return $video;
    }

    /**
     * Upload a video to the platform
     */
    public function create(Request $request) {
        $rules = [
            'video' => 'mimes:mpeg,ogg,mp4,webm,3gp,mov,flv,avi,wmv,ts|required',
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

        // Set fields related to the video (and process the video)
        $video->setVideo($request->file('video'));

        $video->save();

        $this->createTags($request->input('tags'), $video);

        return response()->json([
            'message' => 'success',
            'video' => $video->id,
        ]);
    }

    /**
     * User must be owner of the video to update
     */
    public function update(Request $request, $id) {

        $video = Video::find($id);

        if ($video->owner != $request->user()->id) {
            return response()
                ->json([
                    'errors' => ['Unauthorised']
                ])
                ->setStatusCode(401);
        }

        if ($request->filled('title')) {
            $video->title = $request->input('title');
        }

        if ($request->filled('description')) {
            $video->description = $request->input('description');
        }

        if ($request->filled('tags')) {
            createTags($request->input('tags'));
        }

        $video->save();

        return response()
            ->json(['message' => 'Success']);
    }

    /**
     * Owner of the video may also delete it
     */
    public function delete(Request $request, $id) {
        $video = Video::find($id);

        if ($video->owner != $request->user()->id) {
            return response()
                ->json([
                    'errors' => ['Unauthorised']
                ])
                ->setStatusCode(401);
        }

        $video->delete();

        return response()
            ->json(['message' => 'Success']);
    }

    private function createTags($tagString, $video) {
        // Create and set tags
        $tags = explode(',', $tagString);
        foreach ($tags as $tag) {
            $tag = Tag::firstOrCreate(['name' => trim($tag)]);
            $video->tags()->save($tag);
        }
    }
}
