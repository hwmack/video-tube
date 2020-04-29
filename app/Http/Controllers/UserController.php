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
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|object
     */
    protected function get(Request $request, $id = null) {
        $user = $id != null ?
            User::where('id', $id)->first()
            : $request->user();

        if ($user == null) {
            return response()->json([
                'errors' => [
                    'user' => 'Could not retrieve user'
                ]
            ])->setStatusCode(400);
        }

        $videos = Video::where('owner', $user->id);

        return response()->json([
            'user' => $user,
            'videos' => $videos,
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
        // TODO Need to test this endpoint
        $validator = Validator::make($request->all(), [
            'email' => ['email', 'unique:users'],
            'password' => User::getPasswordValidation()
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ]);
        }

        if ($request->filled('email')) {
            $update['email'] = $request->input('email');
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
