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
          <button class="btn btn-info" @click="checkStat();  showStats = true">Check</button>
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
  import finity from 'finity-js';
  import DateEQ from 'date-eq'
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
          dateFrom: new Date(2017, 10, 13),
          dateTo: new Date()
          },
        sum:'',
        cpa:'',
        showStats:false,
        calendar:false,
        lang:'en',
        alldates:[],
        chartData: {
          sets: [
            {
              generators: [svgArea(), svgLine(), svgScatter()],
              graphs: [
                {
                  label: 'area 1',
                  values: [
                    {x:0, y:0},
                    {x:2, y:6},
                    {x:3, y:3},
                    {x:4, y:6},
                    {x:5, y:6},
                    {x:6, y:2},
                    {x:7, y:6},
                    {x:8, y:6},
                    {x:9, y:6},
                    {x:10, y:6},
                    {x:11, y:6},
                    {x:12, y:6},
                    {x:13, y:4},
                    {x:14, y:6},
                    {x:15, y:6},
                    {x:16, y:6},
                    {x:17, y:8},
                    {x:18, y:6},
                    {x:19, y:6},
                    {x:20, y:6},
                    {x:21, y:6},
                    {x:22, y:6},
                    {x:23, y:6},
                    {x:25, y:6},
                    {x:26, y:6},
                    {x:27, y:6},
                    {x:28, y:23},
                    {x:29, y:6},
                    {x:32, y:11},
                    {x:33, y:3}
                  ]
                },
                {
                  label: 'area 2',
                  values: [
                    {x: 1, y: 15},
                    {x: 2, y: 8},
                    {x: 3, y: 54},
                    {x: 4, y: 22},
                    {x: 5, y: 20},
                    {x:6, y:2},
                    {x:7, y:6},
                    {x:8, y:6},
                    {x:9, y:6},
                    {x:10, y:6},
                    {x:11, y:6},
                    {x:12, y:6},
                    {x:13, y:4},
                    {x:14, y:6},
                    {x:15, y:6},
                    {x:16, y:6},
                    {x:17, y:8},
                    {x:18, y:22},
                    {x:19, y:6},
                    {x:20, y:6},
                    {x:21, y:54},
                    {x:22, y:6},
                    {x:23, y:3},
                    {x:25, y:5},
                    {x:26, y:6},
                    {x:27, y:6},
                    {x:28, y:23},
                    {x:29, y:6},
                    {x:32, y:11},
                    {x:33, y:3}
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


          let arrDates = [];
          for (let i = 0; i<30; i++){
            arrDates.push(finity.addDays(new Date(this.dataReq.dateFrom), i))
            arrDates[i] = Number.parseInt(finity.format(arrDates[i],'YYYYMMDD')) //массив дат 30 + от выбранной
          }


        this.sum = 0;
        axios.post('http://localhost:8081',  this.dataReq)
          .then((response) => {
          let sumArr = response.data.answer;
            for (let i=0; i<=arrDates.length - 1; i++){
              if (this.chartData.sets[0].graphs[1].values[i] !== undefined || this.chartData.sets[0].graphs[1].values[i] !== undefined){
                //надо запушить в координаты this.chartData.sets[0].graphs[1].values this.chartData.sets[0].graphs[1].values[i]
                let coord1 = this.chartData.sets[0].graphs[0].values[i];

                let coord2 = this.chartData.sets[0].graphs[1].values[i];
                coord1.x = arrDates[i];
                coord2.x = arrDates[i];
              } else {
                console.log('aga')
              }
            }


            let payChart = 0;
            for (let i in sumArr){
              sumArr[i].date = Number.parseInt(finity.format(sumArr[i].date,'YYYYMMDD'));
                  for (let k in arrDates){
                    if (sumArr[i].date === arrDates[k]){
                      if (sumArr[i].event === 'PAYMENT'){
                        payChart += sumArr[i].event_value
                        if (this.chartData.sets[0].graphs[1].values[k] !== undefined){
                          let coord1 = this.chartData.sets[0].graphs[0].values[k];
                          let coord2 = this.chartData.sets[0].graphs[1].values[k];
                          coord1.y += sumArr[i].event_value; //координаты у1
                          // coord2.x = arrDates[i];
                        } else {
                          console.log('aga')
                        }
                      }
                    }
                  }
              }









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
