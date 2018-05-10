<template>
 <div class="container">
   <div class="row">
     <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
       <h1>Http</h1>
       <div class="form-group">
         <label>Username</label>
         <input type="text" class="form-control" v-model="user.username">
       </div>
       <div class="form-group">
         <label>Mail</label>
         <input type="text" class="form-control" v-model="user.email">
       </div>
       <button class="btn btn-primary" @click="submit">Submit</button>
       <hr>
       <button class="btn btn-primary" @click="getData">Get data</button>
       <ul class="list-group">
         <li class="list-group-item" v-for="u in users">{{u.username}} - {{u.email}}</li>
       </ul>
     </div>
   </div>
 </div>
</template>

<script>
  import Auth from '../api/auth'
export default {
  data () {
    return {
      user: {
        username:'',
        email:''
      },
      users:[],
      resource:{}
    }
  },
  methods:{
    // async
    submit(){
      // this.$http.post('test.json' , this.user)
      //   .then(response => {
      //     console.log(response)
      //   }, error => {
      //     console.log(error)
      //   });
      // this.resource.save({}, this.user);
      this.resourse.saveAlt(this.user)
      // const response =  await Auth.register({
      //   username: this.user.username,
      //   email: this.user.email
      // })
    },
    getData(){
      this.$http.get('test.json')
        .then(response =>{
          return  response.json();
        })
        .then(data => {
          const arrRes = [];
          for(let k in data){
            arrRes.push(data[k])
            this.users = arrRes
          }
        });
    }
  },
  created(){
    const customAct = {
      saveAlt:{method: "POST",  url: "alt.json"}
    };
    this.resource = this.$resource('test.json', {}, customAct);
  }
}
</script>

<style>

</style>
