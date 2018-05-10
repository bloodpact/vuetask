<template>
  <div class = 'chart'>
    <chart-axis :data='chartData'></chart-axis>
  </div>
</template>

<script>

  import { ChartAxis } from 'vue-d2b'
  export default {
    props:['chartData'],
    data () {
      return {

      }
    },

    components: {
      ChartAxis
    }
  }
</script>

<style scoped>
  /*
    The chart dimensions is bound by the outer container in this case '.chart'.
  */
  .chart{
    height: 500px;
  }
</style>
