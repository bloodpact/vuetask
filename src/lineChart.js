import {Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins;

export default({
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  data(){
    return{
      gradient: null,
      gradient2: null
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
    console.log('mount')
  }
})
