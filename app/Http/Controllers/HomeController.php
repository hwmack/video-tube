<?php

namespace App\Http\Controllers;

use App\History;
use Illuminate\Http\Request;
use App\Video;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth')->except('index');
    }

    /**
     * Return the main page of the application
     */
    public function index(Request $request) {
        return view('index');
    }

    /**
     * Perform a search over users and videos and return a list
     */
    public function search(Request $request, $query) {
        // Join all the tables we'll need
        return Video::join('tag_video', 'tag_video.video_id', '=', 'videos.id')
            ->join('tags', 'tags.id', '=', 'tag_video.tag_id')
            ->join('users', 'users.id', '=', 'videos.owner')

            // Make sure we retain the video id as the main id
            ->select('*', 'videos.id as id')

            // Check if the title, description, tag name or username matches
            ->where('title', 'ILIKE', "$query")
            ->orWhere('description', 'ILIKE', "%$query%")
            ->orWhere('name', 'ILIKE', "%$query%")
            ->orWhere('username', 'ILIKE', "%$query%")

            // Remove any duplicates
            ->distinct('videos.id')

            // Add pagination
            ->paginate(15);
    }

    /**
     * Return a list of videos for the home page, based on recommendations
     */
    public function videos(Request $request) {
        // This will return a list of videos based on the recommendations

        // FIXME Try to update to using a recommendation engine
//        $histories = History::where([
//            'user_id' => $request->user()->id,
//        ])->get();
//
//        $tags = [];
//
//        foreach ($histories as $history) {
//            foreach ($history->video as $video) {
//                foreach ($video->tags as $tag) {
//                    $tags[] = $tag;
//                }
//            }
//        }

        // For now we will just return a random series of videos
        $videos =  Video::paginate(15);

        return $videos;
    }
}
