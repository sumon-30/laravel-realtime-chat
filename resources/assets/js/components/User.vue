<template>
<div class="btn-group-vertical" >
  <label> Received Message : {{receivemessage}} </label>
  <label> Chat with : {{chatuserid}} </label>
  <label @click="fetchMessagesWithUser(user.id)" class="btn btn-primary label-primary" v-for="user in users" >
	 <strong class="primary-font" >
         {{user.name }}
     </strong>
  </label>
  
</div>
 
</template>

<script>
  export default {
    props: ['users','loginuser','receivemessage','chatuserid'],
    created () {
        console.log("enter");
        console.log(this.loginuser);
        localStorage.setItem('login_user_id', this.loginuser.id);
    },

     methods: {
            fetchMessagesWithUser(id) {
                this.$emit('fetchmessageswithuser', {
                    id: id
                });
            },
            handleFileUpload(){
                this.file = this.$refs.file.files[0];
            }
        } 
  };
</script>
