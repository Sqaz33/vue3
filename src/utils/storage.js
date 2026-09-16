export function loadItems() {
  const saved = localStorage.getItem('tasks')
  return JSON.parse(saved) ?? []
}

export function saveItems(items) {
  localStorage.setItem('tasks', JSON.stringify(items))
}