<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Comment;

class CommentController extends Controller
{
    public function __construct() {
        $this->middleware('auth');
    }

    /**
     * Get all the comments for a video
     */
    public function get(Request $request, $id) {
        return Comment::where('video_id', $id)->get();
    }

    /**
     * Create a comment for a video
     */
    public function create(Request $request, $id) {
        $comment = new Comment;

        if (!$request->has('content')) {
            return response()
                ->json([
                    'errors' => ['Empty comment content']
                ])
                ->setStatusCode(400);
        }

        $comment->video_id = $id;
        $comment->user_id = $request->user()->id;
        $comment->content = $request->input('content');

        $comment->save();

        $comment->user;

        return response()->json([
            'message' => 'success',
            'comment' => $comment,
        ]);
    }
}
