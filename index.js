document.addEventListener("DOMContentLoaded", function () {
	renderTasks()
	document.getElementById("task-form").addEventListener("submit", function(e) {
		e.preventDefault()
		addTask()
	})
//	document.getElementById("reset-button").addEventListener("click", resetTasks)
})
function getTasks() {
	return JSON.parse(localStorage.getItem("tasks")) || []
}
function saveTasks(tasks) {
	localStorage.setItem("tasks", JSON.stringify(tasks))
}
function addTask() {
	const taskName = document.getElementById("task-name").value.trim()
	const taskTag = document.getElementById("task-tag").value.trim()
	if (!taskName || !taskTag) return
	const task = {
		id: Date.now(),
		name: taskName,
		tag: taskTag,
		date: `Criado em: ${formatDate(new Date())}`,
		completed: false
	}
	const tasks = getTasks()
	tasks.push(task)
	saveTasks(tasks)
	renderTasks()
	document.getElementById("task-name").value = ""
	document.getElementById("task-tag").value = ""
}
function renderTasks() {
	const taskListUl = document.getElementById("task-list")
	taskListUl.innerHTML = ""
	const tasks = getTasks()
	tasks.forEach(task => {
		const li = document.createElement("li")
		li.className = "task-item"
		li.id = "task-" + task.id
		const taskNameDiv = document.createElement("div")
		taskNameDiv.className = "task-name"
		taskNameDiv.textContent = task.name
		const taskDetailsDiv = document.createElement("div")
		taskDetailsDiv.className = "task-details"
        
        const tagSpan = document.createElement("span")
        tagSpan.className = "task-tag"
        tagSpan.textContent = task.tag

        const dateSpan = document.createElement("span")
        dateSpan.className = "task-date"
        dateSpan.textContent = task.date

        taskDetailsDiv.appendChild(tagSpan)
        taskDetailsDiv.appendChild(dateSpan)
        
		const buttonContainer = document.createElement("div")
		buttonContainer.className = "task-actions"
		const completeButton = document.createElement("button")
		completeButton.className = "complete-button"
		completeButton.dataset.taskId = task.id
		if (task.completed) {
			completeButton.innerHTML = '<img src="./assets/checked.svg" alt="Tarefa concluída" />'
		} else {
			completeButton.textContent = "Concluir"
		}
		completeButton.addEventListener("click", toggleTask)
		buttonContainer.appendChild(completeButton)
		li.appendChild(taskNameDiv)
		li.appendChild(taskDetailsDiv)
		li.appendChild(buttonContainer)
		if (task.completed) {
			li.classList.add("completed")
		}
		taskListUl.appendChild(li)
	})
	updateFooter()
}
function toggleTask(event) {
	const taskId = event.currentTarget.dataset.taskId
	let tasks = getTasks()
	tasks = tasks.map(task => {
		if (task.id == taskId) {
			task.completed = !task.completed
		}
		return task
	})
	saveTasks(tasks)
	renderTasks()
}
function updateFooter() {
	const tasks = getTasks()
	const completedCount = tasks.filter(task => task.completed).length
	document.getElementById("tasks-progress").textContent = `${completedCount} tarefas concluídas`
}
function resetTasks() {
	if (confirm("Tem certeza que deseja resetar todas as tarefas?")) {
		localStorage.removeItem("tasks")
		renderTasks()
	}
}
const formatDate = (date) => {
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()
	return `${day}/${month}/${year}`
}