const express = require('express');
const taskRepository = require('../models/taskRepository');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const task = await taskRepository.createTask(req.body || {});
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const tasks = await taskRepository.listTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const task = await taskRepository.getTaskById(req.params.id);

    if (!task) {
      throw taskRepository.createHttpError(404, 'Task not found');
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const task = await taskRepository.updateTask(req.params.id, req.body || {});

    if (!task) {
      throw taskRepository.createHttpError(404, 'Task not found');
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await taskRepository.deleteTask(req.params.id);

    if (!deleted) {
      throw taskRepository.createHttpError(404, 'Task not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
