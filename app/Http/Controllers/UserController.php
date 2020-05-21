<?php

namespace App\Http\Controllers;

use App\User;
use App\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

/**
 * Class UserController
 * @package App\Http\Controllers
 */
class UserController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Fetch a user from the database
     */
    protected function get(Request $request, $username = null) {
        $user = $username != null ?
            User::where('username', $username)->first()
            : $request->user();

        if ($user == null) {
            return response()->json([
                'errors' => [
                    'user' => 'Could not retrieve user'
                ]
            ])->setStatusCode(400);
        }

        // Pull the videos and bookmarks for the user
        $user->videos;
        $user->bookmarks;

        return response()->json([
            'user' => $user,
        ]);
    }

    /**
     * Allows a user to update their details
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    protected function update(Request $request) {
        $update = [];

        $validator = Validator::make($request->all(), [
            'email' => ['email', 'unique:users'],
            'username' => ['unique:users'],
            'password' => User::getPasswordValidation()
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ])->setStatusCode(422);
        }

        if ($request->filled('email')) {
            $update['email'] = $request->input('email');
        }

        if ($request->filled('username')) {
            $update['username'] = $request->input('username');
        }

        if ($request->filled('password')) {
            $update['password'] = Hash::make($request->input('password'));
        }

        $id = $request->user()->id;

         User::where('id', $id)
            ->update($update);

        return response()->json([
            'user' => User::where('id', $id)->first()
        ]);
    }

}
