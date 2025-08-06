<template>
  <div class="charts-container">
    <div
      v-for="metricName in metricNames"
      :key="metricName"
      class="chart-wrapper"
    >
      <h3>{{ metricName }}</h3>
      <Line
        :data="generateChartData(metricName)"
        :options="chartOptions"
        :height="400"
        :width="null" 
      />
    </div>
  </div>
</template>

<script>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "MetricsCharts",
  components: { Line },
  props: {
    processedData: Object,
    experimentColors: Object
  },
  computed: {
    metricNames() {
      const firstId = Object.keys(this.processedData)[0];
      return Object.keys(this.processedData[firstId]);
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false, // щоб висота працювала
        plugins: {
          legend: { position: "top" },
          tooltip: { mode: "index", intersect: false }
        },
        interaction: { mode: "nearest", axis: "x", intersect: false },
        elements: {
          point: {
            radius: 0 // прибирає кружечки
          }
        }
      };
    }
  },
  methods: {
    generateChartData(metricName) {
      return {
        labels: this.processedData[Object.keys(this.processedData)[0]][
          metricName
        ].map((p) => p.step),
        datasets: Object.keys(this.processedData).map((id) => ({
          label: id,
          data: this.processedData[id][metricName].map((p) => p.value),
          borderColor: this.experimentColors[id],
          backgroundColor: this.experimentColors[id],
          fill: false
        }))
      };
    }
  }
};
</script>

<style scoped>
.charts-container {
  width: 100%;
  /* overflow: hidden; */
}
.chart-wrapper {
  padding: 20px;
  width: 100%;
  min-width: 900px;
  /* overflow: hidden; */
  height: 400px;
}
canvas {
  overflow-x: scroll;
}
</style> 
