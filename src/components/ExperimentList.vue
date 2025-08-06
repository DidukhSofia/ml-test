<template>
  <div class="experiment-list" v-if="ids.length">
    <h3>Experiments:</h3>
    <Button
      @click="toggleAll"
      class="mb-2"
      :label="allSelected ? 'Cancel All' : 'Select All'"
      size="medium"
    />

    <div class="card">
      <div
        v-for="(id, index) in ids"
        :key="index"
        class="flex items-center gap-2 experiment-item"
      >
        <Checkbox
          v-model="selectedIds"
          :inputId="'exp-' + index"
          :value="id"
          @change="emitSelection"
        />
        <label :for="'exp-' + index" class="text-sm">{{ id }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";

export default {
  name: "ExperimentList",
  components: { Checkbox, Button },
  props: { ids: Array },
  data() {
    return {
      selectedIds: [...this.ids] // за замовчуванням всі вибрані
    };
  },
  computed: {
    allSelected() {
      return this.selectedIds.length === this.ids.length;
    }
  },
  watch: {
    ids(newVal) {
      this.selectedIds = [...newVal];
      this.emitSelection();
    }
  },
  methods: {
    emitSelection() {
      this.$emit("selection-changed", this.selectedIds);
    },
    toggleAll() {
      this.selectedIds = this.allSelected ? [] : [...this.ids];
      this.emitSelection();
    }
  },
  mounted() {
    this.emitSelection();
  }
};
</script>

<style scoped>
.experiment-list {
  padding: 1rem;
}
.experiment-item {
    display: flex;
    margin: 10px 0px;
    gap: 10px;
}
</style>
