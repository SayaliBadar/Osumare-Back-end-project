const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 9001;

app.use(bodyParser.json());

let tasks = [];
let currentId = 1;

// Validation function
const validateTask = (task) => {
    if (!task.task_title || !task.description) {
        return false;
    }
    return true;
};

// Get : retrieve all the list of tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// Get a specific task by ID
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
});

// Create a new task
app.post('/tasks', (req, res) => {
    const task = req.body;
    if (!validateTask(task)) {
        return res.status(400).json({ error: 'Title and description are required' });
    }
    task.id = currentId++;
    tasks.push(task);
    res.status(201).json(task);
});

// Update an existing task by ID
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const updatedTask = req.body;
    if (!validateTask(updatedTask)) {
        return res.status(400).json({ error: 'Title and description are required' });
    }
    task.task_title = updatedTask.task_title;
    task.description = updatedTask.description;
    res.status(200).json(task);
});

// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Task Manager API is running at http://localhost:${port}`);
});