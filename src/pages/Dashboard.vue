<template>
  <div class="dashboard">
    <CsvUploader @data-processed="handleProcessedData" />
    <div class="dashboard__content">
      <ExperimentList
        v-if="experimentIds.length"
        :ids="experimentIds"
        @selection-changed="updateSelectedExperiments"
      />

      <MetricCharts
        v-if="Object.keys(filteredData).length"
        :processedData="filteredData"
        :experimentColors="experimentColors"
      />
    </div>
  </div>
</template>

<script>
import CsvUploader from "../components/CsvUploader.vue";
import MetricCharts from "../components/MetricsCharts.vue";
import ExperimentList from "../components/ExperimentList.vue";

export default {
  components: { CsvUploader, MetricCharts, ExperimentList },
  data() {
    return {
      processedData: {},
      experimentIds: [],
      selectedIds: [],
      experimentColors: {},
    };
  },
  computed: {
    filteredData() {
      const filtered = {};
      for (const id of this.selectedIds) {
        filtered[id] = this.processedData[id];
      }
      return filtered;
    },
  },
  methods: {
    handleProcessedData(data) {
      this.processedData = data;
      this.experimentIds = Object.keys(data);
      this.generateColorMap();
    },
    updateSelectedExperiments(ids) {
      this.selectedIds = ids;
    },
    generateColorMap() {
      const palette = [
        "#ff6384",
        "#36a2eb",
        "#cc65fe",
        "#ffce56",
        "#4bc0c0",
        "#9966ff",
        "#ff9f40",
        "#66ff66",
      ];
      this.experimentColors = {};
      this.experimentIds.forEach((id, index) => {
        this.experimentColors[id] = palette[index % palette.length];
      });
    },
  },
};
</script>

<style scoped>
.dashboard {
  max-width: 1440px;
  margin: 0px auto;
}
.dashboard__content {
  display: grid;
  grid-template-columns: 1fr 3fr;
  padding: 20px;
  gap: 30px;
}
</style>
