---- Setting at laravel ------
1. create new laravel app
composer create-project --prefer-dist laravel/laravel laravel-real-time-chat

Before we start using Laravel event broadcasting, we first need to register the App\Providers\BroadcastServiceProvider. Open config/app.php and uncomment the following line in the providers array.

2. To register the App\Providers\BroadcastServiceProvider in config/app.php in ther providers array
// App\Providers\BroadcastServiceProvider

3. Need to tell Laravel that we are using the Pusher driver in the .env file:

// .env

BROADCAST_DRIVER=pusher

4. Install Pusher php SDK
composer require pusher/pusher-php-server

Once the installation is done, we need to configure our Pusher app credentials in config/broadcasting.php. To get our Pusher app credential, we need to have a Pusher account.

------  SETTING UP PUSHER  ------
If you don't have one already, create a free Pusher account at https://pusher.com/signup then login to your dashboard and create an app.
5. Fill in our Pusher app credentials. If you open the config/broadcasting.php

'pusher' => [
      'driver' => 'pusher',
      'key' => env('PUSHER_APP_KEY'),
      'secret' => env('PUSHER_APP_SECRET'),
      'app_id' => env('PUSHER_APP_ID'),
      'options' => [
          'cluster' => env('PUSHER_CLUSTER'),
          'encrypted' => true,
      ],
  ],

6.  Update the .env file to contain our Pusher app credentials
// .env

PUSHER_APP_ID=xxxxxx
PUSHER_APP_KEY=xxxxxxxxxxxxxxxxxxxx
PUSHER_APP_SECRET=xxxxxxxxxxxxxxxxxxxx
PUSHER_CLUSTER=xx

7. install dependencies

npm install

8. need to install it along with the Pusher JavaScript library

npm install --save laravel-echo pusher-js

To subscribe and listen to events, Laravel provides Laravel Echo, which is a JavaScript library that makes it painless to subscribe to channels and listen for events broadcast by Laravel

9. need to tell Laravel Echo to use Pusher

At the bottom of the resources/assets/js/bootstrap.js file
// resources/assets/js/bootstrap.js

import Echo from "laravel-echo"

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'xxxxxxxxxxxxxxxxxxxx',
    cluster: 'eu',
    encrypted: true
});

Remeber to replace xxxxxxxxxxxxxxxxxxxx with PUSHER_APP_KEY

--------AUTHENTICATING USERS --------
10. authentication

php artisan make:auth

11. To update database detail in env

// .env

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel-chat
DB_USERNAME=root
DB_PASSWORD=root

12. Database Migration

php artisan migrate

There's a bug in Laravel 5.4 if you're running a version of MySQL older than 5.7.7 or MariaDB older than 10.2.2. More info here. This can be fixed by replacing the boot() of app/Providers/AppServiceProvider.php with:
// app/Providers/AppServiceProvider.php

// remember to use
Illuminate\Support\Facades\Schema;

/**
 * Bootstrap any application services.
 *
 * @return void
 */
public function boot()
{
  Schema::defaultStringLength(191);
}

----- MESSAGE MODEL AND MIGRATION ----
13. Create a Message Model

php artisan make:model Message -m

// app/Message.php

/**
 * Fields that are mass assignable
 *
 * @var array
 */
protected $fillable = ['message'];

14. Crate Migration for messages table
Within the databases/migrations directory, open the messages table migration

Schema::create('messages', function (Blueprint $table) {
  $table->increments('id');
  $table->integer('user_id')->unsigned();
  $table->text('message');
  $table->timestamps();
});

15. run migration
php artisan migrate

------USER TO MESSAGE RELATIONSHIP ---
16. In User Model
// app/User.php

/**
 * A user can have many messages
 *
 * @return \Illuminate\Database\Eloquent\Relations\HasMany
 */
public function messages()
{
  return $this->hasMany(Message::class);
}

17. In Message Model

// app/Message.php

/**
 * A message belong to a user
 *
 * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
 */
public function user()
{
  return $this->belongsTo(User::class);
}

------DEFINING APP ROUTES-------
18. Create Route
// routes/web.php

Auth::routes();

Route::get('/', 'ChatsController@index');
Route::get('messages', 'ChatsController@fetchMessages');
Route::post('messages', 'ChatsController@sendMessage');

19. Create ChatController
php artisan make:controller ChatsController

// app/Http/Controllers/ChatsController.php

use App\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

  $message = $user->messages()->create([
    'message' => $request->input('message')
  ]);

  return ['status' => 'Message Sent!'];
}

---- CREATING THE CHAT APP VIEW ------
19. Create a new resources/views/chat.blade.php 
<!-- resources/views/chat.blade.php -->

@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Chats</div>

                <div class="panel-body">
                    <chat-messages :messages="messages"></chat-messages>
                </div>
                <div class="panel-footer">
                    <chat-form
                        v-on:messagesent="addMessage"
                        :user="{{ Auth::user() }}"
                    ></chat-form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

20. Open resources/views/layouts/app.blade.php
<!-- resources/views/layouts/app.blade.php -->

<style>
  .chat {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .chat li {
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px dotted #B3A9A9;
  }

  .chat li .chat-body p {
    margin: 0;
    color: #777777;
  }

  .panel-body {
    overflow-y: scroll;
    height: 350px;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #F5F5F5;
  }

  ::-webkit-scrollbar {
    width: 12px;
    background-color: #F5F5F5;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #555;
  }
</style>

21. Create a new ChatMessages.vue file within resources/assets/js/components

// resources/assets/js/components/ChatMessages.vue

<template>
    <ul class="chat">
        <li class="left clearfix" v-for="message in messages">
            <div class="chat-body clearfix">
                <div class="header">
                    <strong class="primary-font">
                        {{ message.user.name }}
                    </strong>
                </div>
                <p>
                    {{ message.message }}
                </p>
            </div>
        </li>
    </ul>
</template>

<script>
  export default {
    props: ['messages']
  };
</script>

22. create a new ChatForm.vue file within resources/assets/js/components
// resources/assets/js/components/ChatForm.vue

<template>
    <div class="input-group">
        <input id="btn-input" type="text" name="message" class="form-control input-sm" placeholder="Type your message here..." v-model="newMessage" @keyup.enter="sendMessage">

        <span class="input-group-btn">
            <button class="btn btn-primary btn-sm" id="btn-chat" @click="sendMessage">
                Send
            </button>
        </span>
    </div>
</template>

<script>
    export default {
        props: ['user'],

        data() {
            return {
                newMessage: ''
            }
        },

        methods: {
            sendMessage() {
                this.$emit('messagesent', {
                    user: this.user,
                    message: this.newMessage
                });

                this.newMessage = ''
            }
        }    
    }
</script>


23. Open the resources/assets/js/app.js and update with code below:

// resources/assets/js/app.js

Vue.component('chat-messages', require('./components/ChatMessages.vue'));
Vue.component('chat-form', require('./components/ChatForm.vue'));

const app = new Vue({
    el: '#app',

    data: {
        messages: []
    },

    created() {
        this.fetchMessages();
    },

    methods: {
        fetchMessages() {
            axios.get('/messages').then(response => {
                this.messages = response.data;
            });
        },

        addMessage(message) {
            this.messages.push(message);

            axios.post('/messages', message).then(response => {
              console.log(response.data);
            });
        }
    }
});

----- BROADCASTING MESSAGE SENT EVENT ----
24. To add the realtime interactions to our chat app, we need to broadcast some kind of events based on some activities. In our case, we'll fire a MessageSent when a user sends a message. First, we need to create an event, we'll call it MessageSent:

php artisan make:event MessageSent

// app/Events/MessageSent.php

use App\User;
use App\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * User that sent the message
     *
     * @var User
     */
    public $user;

    /**
     * Message details
     *
     * @var Message
     */
    public $message;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(User $user, Message $message)
    {
        $this->user = $user;
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('chat');
    }
}

25. need to update the sendMessage() of ChatsController to broadcast the MessageSent event:

broadcast(new MessageSent($user, $message))->toOthers();

26. Since we created a private channel, only authenticated users will be able to listen on the chat channel. So, we need a way to authorize that the currently authenticated user can actually listen on the channel. This can be done by in the routes/channels.php file:

// routes/channels.php

Broadcast::channel('chat', function ($user) {
  return Auth::check();
});

-----LISTENING FOR MESSAGE SENT EVENT---
26. Once the MessageSent event is broadcast, we need to listen for this event so we can update the chat messages with the newly sent message. We can do so by adding the code snippet below to created() of resources/assets/js/app.js just after this.fetchMessages():

// resources/assets/js/app.js

Echo.private('chat')
  .listen('MessageSent', (e) => {
    this.messages.push({
      message: e.message.message,
      user: e.user
    });
  });



when git clone 
1. composer install

2. Duplicate .env.example and rename it .env

3. php artisan key:generate

4. pusher data update in env

5. Change PrivateChannel in MessageSent.php

6. channels.php

7. php artisan migrate
 
8. npm run dev

9. php artisan serve