<script setup>
  import { computed, ref, watch } from 'vue';
  import TaskCounter from './components/TaskCounter.vue';
  import { loadItems, saveItems } from './utils/storage.js';

  const tasks = ref(loadItems())

  let curId = tasks.value.length === 0 
    ? 0
    : tasks.value[tasks.value.length - 1].id + 1 

  const totalTaskCount = computed(() => tasks.value.length)
  const doneTaskCount = computed(() => tasks.value.filter(task => task.done).length)

  const selectedTaskFilter = ref('all')

  const visibleTasks = computed(() => {
    if (selectedTaskFilter.value === 'active') {
      return tasks.value.filter(task => !task.done)
    }

    if (selectedTaskFilter.value === 'done') {
      return tasks.value.filter(task => task.done)
    }

    return tasks.value
  })

  const newTitle = ref('')

  function addTask() {
    if (newTitle.value === '') return
    tasks.value.push({title: newTitle.value, done: false, id: curId++})
    newTitle.value = ''
  }

  function removeTask(id) {
    tasks.value = tasks.value.filter(task => task.id !== id)
  }

  function clearDoneTasks() {
    tasks.value = tasks.value.filter(task => !task.done)
  }

  watch(
    tasks, 
    (updatedTasks) => { saveItems(updatedTasks) }, 
    {deep: true}
  )

</script>

<template>
  <main class="card">
    <label for="task-filter">Показать:</label>
    <select id="task-filter" v-model="selectedTaskFilter">
      <option value="all">Все</option>
      <option value="active">В работе</option>
      <option value="done">Готово</option>
    </select>

    <ul>
      <li v-for="task in visibleTasks" :key="task.id">
        {{ task.title }}
        <div class="task-actions">
          <button @click="task.done = !task.done" class="button">
            <span v-if="task.done">Готов</span>
            <span v-else>В работе</span>
          </button>
          <button class="button" @click="removeTask(task.id)">Удалить</button>
        </div>
      </li>
    </ul>

    <form @submit.prevent="addTask()">
      <input placeholder="Добавить задачу" v-model.trim="newTitle"/>
      <button class="button" type="submit">Добавить</button>
    </form>


    <TaskCounter 
      :done="doneTaskCount" 
      :total="totalTaskCount"
      @clear="clearDoneTasks()"
    />
  </main>   
</template>

<style scoped>
  .card {
    max-width: 400px;
    margin: 40px auto;
    padding: 24px;
    border: 1px solid #ddd;
    border-radius: 12px;
  }

  .button {
    background-color: #2563eb;
    color: white;
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
  }
  
  .card li {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin-bottom: 1px;
    border: 1px solid #405b97;
    align-items: flex-start;
    padding: 10px 10px;
  }

  .card ul {
    padding-left: 0;
    list-style: none;
  }

  .task-actions {
    display: flex;
    gap: 8px;
  }
</style>
