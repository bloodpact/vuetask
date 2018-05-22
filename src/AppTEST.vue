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
    <awesomecharts :chart-data="datacollection" :options="optionsChart">
    </awesomecharts>
    <button class="btn btn-info" @click="fillData()">Chart</button>

  </div>
</template>

<script>

  import DatePicker from 'vue2-datepicker'
  import finity from 'finity-js';
  import DateEQ from 'date-eq'
  import calendar from  './calendar'
  import awesomecharts from './lineChart'
  import axios from 'axios'
  import _ from 'lodash'
  import numberSeparator from "number-separator";
  export default {
    components: {
      awesomecharts,
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
        datacollection: null,
        optionsChart:{responsive: true, maintainAspectRatio: false}

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


            if (cpaLenght !== 0){
              this.cpa = numberSeparator((_.sumBy(sumArr, 'event_value') / cpaLenght).toFixed(2), ",");
            } else {
              this.cpa = 0;
            }
            let pays = 0;
            for (let i in sumArr){
              if (sumArr[i].event === 'PAYMENT'){
                pays += sumArr[i].event_value
                this.sum = pays
              }
            }
            this.sum = numberSeparator(this.sum, ",")
          })
          .catch(error => console.log(error))
      },
      fillData () {
        this.datacollection = {
          labels: [],
          datasets: [
            {
              label: 'Сумма выплат',
              data: [],
              borderColor: '#FC2525',
              pointBackgroundColor: '#FC2525',
              pointBorderColor: '#FC2525',
              borderWidth: 1
            },
            {
              label: 'Количество дейтсвий',
              data: [],
              borderColor: '#05CBE1',
              pointBackgroundColor: '#05CBE1',
              pointBorderColor: '#05CBE1',
              borderWidth: 1
            }
          ]
        };

        let arrDates = [];
        let coord1 = this.datacollection.datasets[0].data;
        let coord2 = this.datacollection.datasets[1].data;
        for (let i = 0; i < 30; i++){
          arrDates.push(finity.addDays(new Date(this.dataReq.dateFrom), i));
          arrDates[i] = Number.parseInt(finity.format(arrDates[i],'YYYYMMDD')) ;//массив дат 30 + от выбранной
          this.datacollection.labels[i] = arrDates[i]
        }

        axios.post('http://localhost:8081',  this.dataReq)
          .then((response) => {
            let sumArr = response.data.answer;
            let payValues = [];
            let sumCoords = []; // координтаы сум выплат
            let actArr= []; // массив кол-ва действий
            for (let i  in sumArr){
              //вычисляем кол-во действий
              if (sumArr[i].event === 'LINK_VISITOR' || sumArr[i].event === 'REGISTRATION') {
                actArr[i] = Number.parseInt(i) + 1
              }
              if (actArr[i] === undefined){
                actArr[i] = 0 ;
                if (actArr[i - 1] > actArr[i]){
                  actArr[i] = actArr[i-1]
                }
              }

              //массив дат к общему формату, для сравнения
              sumArr[i].date = Number.parseInt(finity.format(sumArr[i].date,'YYYYMMDD'));
              for (let k in arrDates){
                if (sumArr[i].date === arrDates[k]){
                  coord2[i] = actArr[i]
                  //коордитаны кол-ва действий



                 if (sumArr[i].event  === 'PAYMENT') {
                    payValues.push(sumArr[i].event_value);
                    sumCoords = new Array(payValues.length);
                    //вычисление массива с данными сложения выплат
                    for (let j in payValues){
                      sumCoords[j] = 0;
                      let sum = sumCoords[j];
                      for (let q = 0; q <= j; q++){
                        sum += payValues[q]
                      }
                      sumCoords[j] = sum;
                      coord1[k] = sumCoords[j];
                    }
                  }
                }
              }
            }
            //устанавливаем промежуточные точки вместо undefined
            for (let i = 0; i <coord1.length; i++){
                if (coord1[i] === undefined){
                  coord1[i] = 0;
                  if (coord1[i-1] > coord1[i]){
                    coord1[i] = coord1[i-1]
                  }
                }
            }
          })
          .catch(error => console.log(error));
      },
      getAnswer(){

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
