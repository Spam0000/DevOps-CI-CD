const { v4: uuidv4 } = require('uuid');

const tasks = [];

function cloneTask(task) {
  return { ...task };
}

async function createTask({ description, status }) {
  const now = new Date().toISOString();
  const task = {
    id: uuidv4(),
    description,
    status,
    createdAt: now,
    updatedAt: now
  };

  tasks.push(task);
  return cloneTask(task);
}

async function listTasks() {
  return tasks.map(cloneTask);
}

async function getTaskById(id) {
  const task = tasks.find((item) => item.id === id);
  return task ? cloneTask(task) : null;
}

async function updateTask(id, updates) {
  const index = tasks.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  const currentTask = tasks[index];
  const updatedTask = {
    ...currentTask,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  tasks[index] = updatedTask;
  return cloneTask(updatedTask);
}

async function deleteTask(id) {
  const index = tasks.findIndex((item) => item.id === id);
  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);
  return true;
}

async function init() {
  return undefined;
}

module.exports = {
  init,
  createTask,
  listTasks,
  getTaskById,
  updateTask,
  deleteTask
};
