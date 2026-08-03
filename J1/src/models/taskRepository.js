const { v4: uuidv4 } = require('uuid');
const memoryStore = require('./taskMemory');
const postgresStore = require('./taskPg');

const allowedStatuses = ['todo', 'in_progress', 'done'];
const maxDescriptionLength = Number(process.env.MAX_DESCRIPTION_LENGTH || 10000);

function usePostgres() {
  return String(process.env.USE_POSTGRES || '').toLowerCase() === 'true';
}

function getStore() {
  return usePostgres() ? postgresStore : memoryStore;
}

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateDescription(value, fieldName = 'description') {
  if (typeof value !== 'string') {
    throw createHttpError(400, `${fieldName} must be a string`);
  }

  const description = value.trim();

  if (description.length === 0) {
    throw createHttpError(400, `${fieldName} cannot be empty`);
  }

  if (description.length > maxDescriptionLength) {
    throw createHttpError(400, `${fieldName} must be <= ${maxDescriptionLength} characters`);
  }

  return description;
}

function validateStatus(value) {
  if (value === undefined) {
    return 'todo';
  }

  if (typeof value !== 'string') {
    throw createHttpError(400, 'status must be a string');
  }

  if (!allowedStatuses.includes(value)) {
    throw createHttpError(400, `status must be one of: ${allowedStatuses.join(', ')}`);
  }

  return value;
}

async function init() {
  await getStore().init();
}

async function createTask(payload) {
  const description = validateDescription(payload.description);
  const status = validateStatus(payload.status);
  const id = uuidv4();

  return getStore().createTask({ id, description, status });
}

async function listTasks() {
  return getStore().listTasks();
}

async function getTaskById(id) {
  return getStore().getTaskById(id);
}

async function updateTask(id, payload) {
  const updates = {};

  if (payload.description !== undefined) {
    updates.description = validateDescription(payload.description);
  }

  if (payload.status !== undefined) {
    updates.status = validateStatus(payload.status);
  }

  if (Object.keys(updates).length === 0) {
    throw createHttpError(400, 'At least one updatable field is required');
  }

  return getStore().updateTask(id, updates);
}

async function deleteTask(id) {
  return getStore().deleteTask(id);
}

module.exports = {
  allowedStatuses,
  maxDescriptionLength,
  init,
  createTask,
  listTasks,
  getTaskById,
  updateTask,
  deleteTask,
  createHttpError
};
