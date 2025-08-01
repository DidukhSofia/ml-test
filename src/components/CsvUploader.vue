<template>
  <div class="csv-uploader">
    <h2>Upload CSV file</h2>
    <input type="file" accept=".csv" @change="handleFileUpload" />

    <div v-if="columnData.length > 0">
      <h3>Experiments "{{ targetColumnName }}":</h3>
      <ul>
        <li v-for="(item, index) in columnData" :key="index">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Papa from "papaparse";

export default {
  name: "CsvUploader",
  data() {
    return {
      columnData: [],
      targetColumnName: "experiment_id",
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data;

          const values = data
            .map((row) => row[this.targetColumnName])
            .filter((value) => value !== undefined && value !== "");

          this.columnData = [...new Set(values)];
        },
        error: (err) => {
          console.error("Помилка при обробці CSV:", err);
        },
      });
    },
  },
};
</script>

<style scoped>
.csv-uploader {
  max-width: 600px;
  margin: 2rem auto;
}
ul {
  margin-top: 1rem;
  padding-left: 20px;
}
</style>
