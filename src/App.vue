<script setup>
  import { computed, ref, watch } from 'vue';
  import TaskCounter from './components/TaskCounter.vue';
  import { loadItems, saveItems } from './utils/storage.js';

  const tasks = ref(loadItems())

  function summarizeTasks(tasks) {
    return tasks.reduce((stats, task) => {
      stats.total += 1
      if (task.done) {
        stats.done += 1
      } else {
        stats.active += 1
      }
      return stats
    }, {total: 0, done: 0, active: 0})
  }

  const stats = computed(() => summarizeTasks(tasks.value))

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

  const sortedTask = computed(
    () =>[...visibleTasks.value].sort((a, b) => a.title.length - b.title.length))

  const newTitle = ref('')

  const notice = ref(null) 
  let noticeTimer = null

  function setNotice(text) {
    notice.value = text
    if (noticeTimer !== null) {
      clearTimeout(noticeTimer)
    }
    noticeTimer = setTimeout(() => {
        notice.value = null
        noticeTimer = null
      }, 
      2000
    )
  }

  function addTask() {
    if (newTitle.value === '') return
    setNotice("Задача добавлена")
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

  const editingTaskId = ref(null)
  const editingTask = computed(() => { return editingTaskId.value !== null })

  function startEdit(task) {
    editingTaskId.value = task.id
    newTitle.value = task.title
  }

  function stopEdit() {
    editingTaskId.value = null
    newTitle.value = ''
  }

  function saveEdit() {
    if (newTitle.value === '') return
    setNotice("Задача измененна")
    const found = tasks.value.find(task => task.id === editingTaskId.value)
    found.title = newTitle.value
    editingTaskId.value = null
    newTitle.value = ''
  }

  function markAllActive() {
    tasks.value = tasks.value.map(task => { return { ...task, done: false }})
  }
</script>

<template>
  <main class="card">
    <div v-if="notice" class="toast">{{ notice }}</div>
    <div class="stats">
      <span>Всего {{ stats.total }}</span> 
      <span>|</span> 
      <span>В работе {{ stats.active }}</span> 
      <span>|</span> 
      <span>Готово {{ stats.done }}</span> 
    </div>
    <div class="controls">
      <select id="task-filter" v-model="selectedTaskFilter">
        <option value="all">Все</option>
        <option value="active">В работе</option>
        <option value="done">Готово</option>
      </select>
      <button @click="markAllActive()" >Все активны</button>
    </div>  

    <ul>
      <li v-for="task in sortedTask" :key="task.id">
        <span class="task-title">{{ task.title }}</span>
        <div class="task-actions">
          <button @click="task.done = !task.done" >
            <span v-if="task.done">Готов</span>
            <span v-else>В работе</span>
          </button>
          <button  @click="removeTask(task.id)">Удалить</button>
          <button  @click="startEdit(task)">Редактировать</button>
        </div>
      </li>
    </ul>

    <div class="task-input">
      <form @submit.prevent="editingTask ? saveEdit() : addTask()">
        <input placeholder="Задача" v-model.trim="newTitle"/>
        <button type="submit">
          <span v-if="editingTask">Редактировать</span>
          <span v-else>Добавить</span>
        </button>
      </form>
      <button @click="stopEdit()">Сбросить</button>
    </div>

    <TaskCounter 
      :done="stats.done" 
      :total="stats.total"
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

  .card button {
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

  .task-title {
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  .card ul {
    padding-left: 0;
    list-style: none;
  }

  .task-actions {
    display: flex;  
    gap: 1px;
  }

  .task-input {
    display: flex;
    gap: 8px;
  }

  .task-input form {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .controls {
    display: flex;
    gap: 20px;
    border: 1px solid #ddd;
    align-items: center;
    justify-content: center;
    padding: 10px;
  }

  .stats {
    display: flex;
    gap: 5px;
  }

  .toast {
    position: fixed;
    right: 24px;
    bottom: 24px;
    padding: 12px 16px;
    background-color: #222;
    color: white;
    border-radius: 8px;
  }
</style>
