<?php

namespace App\Http\Controllers;

use App\Bookmark;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    public function addBookmark(Request $request, $id) {
        Bookmark::firstOrCreate([
            'user_id' => $request->user()->id,
            'video_id' => $id,
        ]);

        return response()->json([
            'message' => 'success'
        ]);
    }

    public function removeBookmark(Request $request, $id) {
        $bookmark = Bookmark::where([
            'user_id' => $request->user()->id,
            'video_id' => $id,
        ])->first();

        if ($bookmark != null) {
            $bookmark->delete();
        }

        return response()->json([
            'message' => 'success'
        ]);
    }
}
