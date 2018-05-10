<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
        <label >Enter id</label>
        <input  class="form-control" v-model="dataReq.id">
        <span @click="calendar = !calendar"  v-show="!calendar" class="calendar glyphicon glyphicon-calendar"></span>
        <div v-show="calendar">
          <label >Enter Date from</label>
          <input class="form-control" type="date" v-model="dataReq.dateFrom">
          <label >Enter Date to</label>
          <input class="form-control" type="date" v-model="dataReq.dateTo">
        </div>
        <div  v-if="dataReq.id==''" class="alert alert-danger" role="alert">
            <span>Please enter id</span>
        </div>
        <div v-else>
          <button class="btn btn-info" @click="checkStat(); showStats = true">Check</button>
        </div>
        <div v-if="showStats">
          <div class="alert alert-success" role="alert">
            Доход: {{sum}} &#8381;
          </div>
          <div class="alert alert-warning" role="alert">
           CPA: {{cpa}} &#8381;
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import _ from 'lodash'
  import numberSeparator from "number-separator";
  export default {
    data () {
      return {
        dataReq:{
          id:'',
          dateFrom: new Date(2011, 0, 1, 0, 0, 0, 0),
          dateTo: new Date()
          },
        sum:'',
        cpa:'',
        showStats:false,
        calendar:false
      }
    },
    watch:{
       "dataReq.id"(){
        this.checkStat()
         this.showStats = true
      },
      "dataReq.dateFrom"(old, newVal){
         console.log(` new ${old} old ${newVal}`)
        this.checkStat()
      },
      "dataReq.dateTo"(){
        this.checkStat()
      }
    },
    methods:{
        checkStat(){
        this.sum = 0;
        axios.post('http://localhost:8081',  this.dataReq)
          .then((response) => {
           let sumArr = response.data.answer;
           let cpaLenght =  _.filter(sumArr,{'event':'LINK_VISITOR'}).length + _.filter(sumArr,{'event':'REGISTRATION'}).length;
           if (cpaLenght != 0){
             this.cpa = numberSeparator((_.sumBy(sumArr, 'event_value') / cpaLenght).toFixed(2), ",");
           } else {
             this.cpa = 0;
           }
            let pays = 0;
            for (let i in sumArr){
                 if (sumArr[i].event == 'PAYMENT'){
                   pays += sumArr[i].event_value
                   this.sum = pays
               }
            }
            this.sum = numberSeparator(this.sum, ",")
          })
          .catch(error => console.log(error))
      }
    }
  }
</script>

<style>
  .btn, input, label{
    margin: 10px 0;
  }
  .alert{
    margin-bottom: 0;
  }
  .calendar{
    cursor: pointer;
  }

</style>
