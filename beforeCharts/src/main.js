import Vue from 'vue'
import AppTEST from './AppTEST.vue'
// import VueResource from 'vue-resource'
//
// Vue.use(VueResource);
//
// Vue.http.options.root = 'https://vuehttp-38d75.firebaseio.com/';
// Vue.http.interceptors.push((request, next)=> {
//   console.log(request)
//    if (request.method == "POST"){
//      request.method = "PUT"
//    }
//    next((response => {
//      response.json = () => {
//        return {msg: response.body}
//      }
//    }));
// })



new Vue({
  el: '#app',
  render: h => h(AppTEST)
})
