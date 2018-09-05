<?php

namespace App\Http\Controllers;

use App\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
//remember to use
use App\Events\MessageSent;
use Log;

class ChatsController extends Controller
{
   // app/Http/Controllers/ChatsController.php



public function __construct()
{
  $this->middleware('auth');
}

/**
 * Show chats
 *
 * @return \Illuminate\Http\Response
 */
public function index()
{
  return view('chat');
}

/**
 * Fetch all messages
 *
 * @return Message
 */
public function fetchMessages()
{
  return Message::with('user')->get();
}

/**
 * Persist message to database
 *
 * @param  Request $request
 * @return Response
 */
public function sendMessage(Request $request)
{
  $user = Auth::user();
  $ext = '';
  $fileUrl = '';
  Log::debug($request);
  if ($request->hasFile('file'))
        {
            $file = $request->file;
            $ext = $file->getClientOriginalExtension();
            $fileName= explode('.'.$ext, $file->getClientOriginalName());

            $fileUrl = $fileName[0];
            Storage::putFileAs('/public/' , $file, $fileName[0].'.' . $ext);
        }
  $message = $user->messages()->create([
    'message' => $request->input('message'),
    'file_url'=>$fileUrl,
    'file_type'=>$ext
  ]);

  broadcast(new MessageSent($user, $message))->toOthers();

  return ['status' => 'Message Sent!'];
}
}
