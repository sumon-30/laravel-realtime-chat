
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

// resources/assets/js/app.js

Vue.component('chat-messages', require('./components/ChatMessages.vue'));
Vue.component('chat-form', require('./components/ChatForm.vue'));
Vue.component('user', require('./components/user.vue'));
const app = new Vue({
    el: '#app',

    data: {
        messages: [],
        users: [],
        chatUserId: '',
        receiveMessage: 0 ,
    },

    created() {
        this.fetchMessages();
        this.fetchUsers();
        Echo.private('my-channel')
        .listen('MessageSent', (e) => {
           // alert("new message");
            this.messages.push({
            message: e.message.message,
            user: e.user,
            file_url: e.message.file_url,
            file_type: e.message.file_type 
            });
            console.log('chatUserId');
            console.log(this.chatUserId);
            console.log('sent_user_id');
            console.log(e.user.id);
            //check auth_user_id = receive_user_id
            if(localStorage.getItem('login_user_id') == e.message.receive_user_id){

                //check auth_user_id chat with sent_user_id
                if(this.chatUserId == e.user.id){
                    //to make seen
                }else{
                    this.receiveMessage += 1;
                }
                
                if (! ('Notification' in window)) {
                    alert('Web Notification is not supported');
                    return;
                  }
        
                  Notification.requestPermission( permission => {
                    let notification = new Notification('New message alert!', {
                      body: e.message.message, // content for the alert
                      icon: "https://pusher.com/static_logos/320x320.png" // optional image url
                    });
                    notification.onclick = () => {
                        window.open(window.location.href);
                      };
                });
            }
           
    });
       
    },

    methods: {
        fetchMessages() {
            axios.get('/messages').then(response => {
                
                this.messages = response.data;
            });
        },
        fetchMessagesWithUser(id) {
            console.log(id);
            
            let userid = id.id;
            this.chatUserId = userid;
            axios.get('/messagesWithUsers/'+userid).then(response => {
                
                this.messages = response.data;
            });
        },
        fetchUsers() {
            axios.get('/users').then(response => {
                this.users = response.data;
            });
        },
        
        addMessage(message) {
            let formData = new FormData()

            console.log(message);
            this.messages.push(message);
            formData.append('message', message.message);
            formData.append('file', message.file);
            formData.append('receive_user_id', this.chatUserId)
            console.log(this.chatUserId);
            axios.post('/messages', formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
              }).then(response => {
              console.log(response.data);
            });
        }
    }
});
