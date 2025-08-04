<template>
  <div class="csv-uploader">
    <h2>Завантаження CSV-файлу</h2>
    <input type="file" accept=".csv" @change="handleFileUpload" />

    <div v-if="experimentIds.length > 0" class="experiment-list">
      <h3>Список унікальних Experiment ID:</h3>
      <ul>
        <li v-for="(id, index) in experimentIds" :key="index">{{ id }}</li>
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
      processedData: {},
      experimentIds: [],
      db: null,
    };
  },
  methods: {
    async initDB() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open("csvExperiments", 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("experiments")) {
            db.createObjectStore("experiments", { keyPath: "experimentId" });
          }
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve();
        };

        request.onerror = (event) => {
          console.error("DB error:", event.target.error);
          reject(event.target.error);
        };
      });
    },

    async clearDB() {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(["experiments"], "readwrite");
        const store = tx.objectStore("experiments");
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = (event) => {
          console.error("Помилка при очищенні бази даних:", event.target.error);
          reject(event.target.error);
        };
      });
    },

    async saveToDB(structuredData) {
      await this.clearDB();
      const tx = this.db.transaction(["experiments"], "readwrite");
      const store = tx.objectStore("experiments");

      for (const experimentId of Object.keys(structuredData)) {
        const entry = {
          experimentId,
          metrics: structuredData[experimentId],
        };
        store.put(entry);
      }

      return new Promise((resolve) => {
        tx.oncomplete = () => resolve();
      });
    },

    async loadFromDB() {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(["experiments"], "readonly");
        const store = tx.objectStore("experiments");

        const request = store.getAll();

        request.onsuccess = () => {
          const results = request.result;
          const data = {};
          results.forEach((entry) => {
            data[entry.experimentId] = entry.metrics;
          });

          this.processedData = data;
          this.experimentIds = Object.keys(data);
          this.$emit("data-processed", data);
          resolve();
        };

        request.onerror = (event) => {
          console.error("Помилка при читанні з IndexedDB:", event.target.error);
          reject(event.target.error);
        };
      });
    },

    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const parsedData = await this.parseCSV(file);
        const structured = this.structureData(parsedData);

        this.processedData = structured;
        this.experimentIds = Object.keys(structured);
        await this.saveToDB(structured);
        this.$emit("data-processed", structured);
      } catch (error) {
        console.error("Помилка при обробці файлу:", error);
      }
    },

    parseCSV(file) {
      return new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => resolve(result.data),
          error: (err) => reject(err),
        });
      });
    },

    structureData(data) {
      const structured = {};

      data.forEach((row) => {
        const experimentId = row["experiment_id"];
        const metricName = row["metric_name"];
        const step = Number(row["step"]);
        const value = Number(row["value"]);

        if (!structured[experimentId]) {
          structured[experimentId] = {};
        }

        if (!structured[experimentId][metricName]) {
          structured[experimentId][metricName] = [];
        }

        structured[experimentId][metricName].push({ step, value });
      });

      return structured;
    },
  },
  async mounted() {
    await this.initDB();
    await this.loadFromDB();
  },
};
</script>

<style scoped>
.csv-uploader {
  max-width: 600px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
}
input[type="file"] {
  margin-bottom: 1rem;
}
.experiment-list {
  margin-top: 1.5rem;
}
ul {
  padding-left: 20px;
}
</style>
