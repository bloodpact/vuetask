<template>
  <div class = 'chart'>
    <!-- import font awesome for legend icons -->

    <!--
      Both the :data and :config properties are deeply reactive so any changes
      to these will cause the chart to update.
    -->
    <chart-axis :data='chartData'></chart-axis>
    <!--<p>{{test}}</p>-->
  </div>
</template>

<script>

  import { ChartAxis } from 'vue-d2b'
  export default {
    props:['chartData'],
    data () {
      return {
        // Describe the pie-chart data for more information on this checkout
        // the d2bjs.org docs.


        // The chart config property is a callback function that is executed
        // any time the chart undergoes an update. The function receives the
        // d2b chart generator as an argument and can be configured as described
        // as described by the d2bjs.org docs.
        chartConfig (chart) {
          chart.donutRatio(0.5)
        }
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
