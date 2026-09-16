<script setup>
  defineProps(['done', 'total'])
  const emit = defineEmits(['clear'])
</script>

<template>
  <p>Готово {{ done }} из {{ total }}</p>
  <button @click="emit('clear')">Очистить готовые</button>
</template>

