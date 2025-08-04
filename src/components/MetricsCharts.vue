<template>
  <div class="charts-scroll-wrapper">
    <div class="charts-container">
      <div
        v-for="(metric, metricName) in metricsByName"
        :key="metricName"
        class="chart-wrapper"
      >
        <h3>{{ metricName }}</h3>
        <Line :data="generateChartData(metricName)" :options="chartOptions" />
      </div>
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
  LinearScale,
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
  name: "MetricCharts",
  components: {
    Line,
  },
  props: {
    processedData: {
      type: Object,
      required: true,
    },
  },
  computed: {
    metricsByName() {
      const metrics = {};
      for (const experimentId in this.processedData) {
        const experimentMetrics = this.processedData[experimentId];
        for (const metricName in experimentMetrics) {
          if (!metrics[metricName]) {
            metrics[metricName] = {};
          }
          metrics[metricName][experimentId] = experimentMetrics[metricName];
        }
      }
      return metrics;
    },
  },
  methods: {
    generateChartData(metricName) {
      const metricData = this.metricsByName[metricName];
      return {
        labels: this.generateLabels(metricData),
        datasets: Object.entries(metricData).map(
          ([experimentId, points], index) => ({
            label: experimentId,
            data: points.map((p) => p.value),
            borderColor: this.getColor(index),
            fill: false,
            tension: 0.2,
          })
        ),
      };
    },
    generateLabels(metricData) {
      const allSteps = new Set();
      for (const points of Object.values(metricData)) {
        points.forEach((p) => allSteps.add(p.step));
      }
      return Array.from(allSteps).sort((a, b) => a - b);
    },
    getColor(index) {
      const colors = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#E7E9ED",
        "#8B0000",
      ];
      return colors[index % colors.length];
    },
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Step",
            },
          },
          y: {
            title: {
              display: true,
              text: "Value",
            },
          },
        },
        elements: {
        point: {
          radius: 0,
          hoverRadius: 0,
        },
      },
      },
    };
  },
};
</script>

<style scoped>
.charts-scroll-wrapper {
  overflow-x: auto;
  padding-bottom: 1rem;
}

.charts-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-top: 2rem;
  min-width: 900px;
}

.chart-wrapper {
  height: 400px;
  width: 2000px; /* Фіксована ширина */
}

</style>
