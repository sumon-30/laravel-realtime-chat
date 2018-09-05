<template>
    <ul class="chat">
        
        <li class="left clearfix" v-for="message in messages">
            <div class="chat-body clearfix" v-if="loginuser.id == message.user.id" align="right">
                <div class="header">
                    <strong class="primary-font" >
                       
                        {{ message.user.name }}
                    </strong>
                </div>
                <p>
                    {{ message.message }}
                </p>
                <p class="image is-4by3" v-if="message.file_url">
                     <!-- <img :src="'/storage/' + message.file_url + '.' +message.file_type " /> -->
                     <a :href="'/storage/' + message.file_url + '.' +message.file_type " class="icon fa-twitter"><span class="label">{{message.file_url}}</span></a>
                </p>
            </div>
            <div class="chat-body clearfix" v-else>
                <div class="header">
                    <strong class="primary-font">
                       
                        {{ message.user.name }}
                    </strong>
                </div>
                <p>
                    {{ message.message }}
                </p>
                <p class="image is-4by3" v-if="message.file_url">
                   <!-- <img :src="'/storage/' + message.file_url + '.' +message.file_type " /> -->
                     <a :href="'/storage/' + message.file_url + '.' +message.file_type " class="icon fa-twitter"><span class="label">{{message.file_url}}</span></a>
                </p>
            </div>
        </li>
    </ul>
</template>

<script>
  export default {
    props: ['messages','loginuser']
  };
</script>
