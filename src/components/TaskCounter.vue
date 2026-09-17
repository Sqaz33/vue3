<script setup>
  import { computed } from 'vue';

  const props = defineProps(['done', 'total'])
  const emit = defineEmits(['clear'])
  const progressPercent = computed(
    () => props.total !== 0 ? props.done / props.total * 100 : 0 );
  const isComplete = computed( 
    () => props.total !== 0 && props.total === props.done)
</script>

<template>
  <main class="card">
    <div class="stats">
      <span>Готово {{ done }} из {{ total }}</span>
      <span>|</span>
      <div class="progress-bar">
        <div class="progress-bar__value" 
          :style="{ width: progressPercent + '%' }"
          :class="{ complete: isComplete }"
        >
        </div>
      </div>
    </div>
    <button @click="emit('clear')">Очистить готовые</button>
  </main>
</template>


<style scoped> 
  .card {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .stats {
    display: flex;
    flex-direction: row;
    gap: 6px
  }

  .progress-bar {
    flex: 1;
    height: 12px;
    background-color: #c5c1eb;
    border-radius: 6px;
    overflow: hidden;
  }

  .progress-bar .progress-bar__value {
    height: 100%;
    background-color: #5c4fd6;
    transition: width 250ms ease, background-color 250ms ease;
  }

  .progress-bar__value.complete {
    background-color: #4fd68c;
  }
</style>