// resources/assets/js/components/ChatForm.vue

<template>
    <div class="input-group">
        <input id="btn-input" type="text" name="message" class="form-control input-sm" placeholder="Type your message here..." v-model="newMessage" @keyup.enter="sendMessage">
          <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
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
                newMessage: '',
                file: ''
            }
        },

        methods: {
            sendMessage() {
                this.$emit('messagesent', {
                    user: this.user,
                    message: this.newMessage,
                    file: this.file
                });

                this.newMessage = ''
            },
            handleFileUpload(){
                this.file = this.$refs.file.files[0];
            }
        }    
    }
</script>
