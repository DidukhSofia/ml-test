<template>
  <div>
    <CsvUploader @data-processed="handleProcessedData" />
    <MetricCharts
      v-if="Object.keys(processedData).length"
      :processedData="processedData"
    />
  </div>
</template>

<script>
import CsvUploader from "../components/CsvUploader.vue";
import MetricCharts from "../components/MetricsCharts.vue";

export default {
  components: {
    CsvUploader,
    MetricCharts,
  },
  data() {
    return {
      processedData: {},
    };
  },
  methods: {
    handleProcessedData(data) {
      this.processedData = data;
    },
  },
};
</script>
