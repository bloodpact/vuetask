<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
        <input placeholder="Enter id" class="form-control" v-model="dataReq.id">
        <span @click="calendar = !calendar"  v-show="!calendar" class="calendar glyphicon glyphicon-calendar"></span>
        <div v-show="calendar">
          <div>
            <date-picker v-model="dataReq.dateFrom" :lang="lang" :first-day-of-week="1"></date-picker>
            <date-picker v-model="dataReq.dateTo" :lang="lang" :first-day-of-week="1"></date-picker>
          </div>
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
    <calendar :chartData="chartData"></calendar>

  </div>
</template>

<script>
  import { svgArea, svgLine, svgScatter } from 'd2b'
  import DatePicker from 'vue2-datepicker'
  import calendar from  './calendar'
  import axios from 'axios'
  import _ from 'lodash'
  import numberSeparator from "number-separator";
  export default {
    components: {
      calendar,
      DatePicker
    },
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
        calendar:false,
        lang:'en',
        chartData: {
          sets: [
            {
              generators: [svgArea(), svgLine(), svgScatter()],
              graphs: [
                {
                  label: 'area 1',
                  values: [
                    {x: 1, y: 25},
                    {x: 2, y: 38},
                    {x: 3, y: 24},
                    {x: 4, y: 60},
                    {x: 5, y: 22}
                  ]
                },
                {
                  label: 'area 2',
                  values: [
                    {x: 1, y: 15},
                    {x: 2, y: 8},
                    {x: 3, y: 54},
                    {x: 4, y: 22},
                    {x: 5, y: 20}
                  ]
                }
              ]
            }
          ]
        }
      }
    },
    watch:{
       "dataReq.id"(){
        this.checkStat()
         this.showStats = true
      },
      "dataReq.dateFrom"(){
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
      },

    },
    computed:{
      dateDiff(date){
        date = new Date();
        return  date.setDate(date.getDate() + 30);
        console.log(date)
      }
    }
  }
</script>


<style>
  .btn, input{
    margin: 10px 0;
  }
  .alert{
    margin-bottom: 0;
  }
  .calendar{
    cursor: pointer;
  }

</style>
