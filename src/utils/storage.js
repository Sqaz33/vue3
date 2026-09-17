function validateTask(task) {
  return task !== null && 
          typeof task === "object" && 
          Number.isInteger(task.id) &&
          typeof task.title === "string" &&
          typeof task.done === "boolean"
}


export function loadItems() {
  const saved = localStorage.getItem('tasks')
  if (saved === null) { 
    return [] 
  } 

  try {
    const data = JSON.parse(saved)
    if (Array.isArray(data)) {
      if (!data.every(task => validateTask(task))) {
        return []
      }
      console.log(data)
      return data
    }
    return []
  } catch(error) {
    console.log("Error loading", error)
    return []
  }
}

export function saveItems(items) {
  localStorage.setItem('tasks', JSON.stringify(items))
}