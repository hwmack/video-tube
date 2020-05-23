<?php

namespace App\Http\Controllers;

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
        // TODO Add a where clause for the owners username
        return Video::where('title', 'ILIKE', "%$query%")
            ->orWhere('description', 'ILIKE', "%$query%")
            ->paginate(15);
    }

    /**
     * Return a list of videos for the home page, based on recommendations
     */
    public function videos(Request $request) {
        // This will return a list of videos based on the recommendations

        // TODO Use the user's most recently watched videos, to find more videos they'll like

        // For now we will just return a random series of videos
        return Video::inRandomOrder()
            ->paginate(15);
    }
}
