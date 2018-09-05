
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

const app = new Vue({
    el: '#app',

    data: {
        messages: [],
    },

    created() {
        this.fetchMessages();
        Echo.private('my-channel')
        .listen('MessageSent', (e) => {
            alert("new message");
            this.messages.push({
            message: e.message.message,
            user: e.user,
            file_url: e.message.file_url,
            file_type: e.message.file_type 
            });
        });
    },

    methods: {
        fetchMessages() {
            axios.get('/messages').then(response => {
                console.log("messages");
                console.log(response.data);
                this.messages = response.data;
            });
        },
        
        addMessage(message) {
            let formData = new FormData()

            console.log(message);
            this.messages.push(message);
            formData.append('message', message.message);
            formData.append('file', message.file)
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
