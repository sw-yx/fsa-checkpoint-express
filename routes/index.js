'use strict';

var express = require('express');
var router = express.Router();
var todos = require('../models/todos')
module.exports = router;

// write your routes here. Feel free to split into multiple files if you like.

router.get('/users/:name/tasks', (req, res) => {
    let newlist = todos.list(req.params.name)
    if (newlist)
        {
            if (req.query.status == 'complete') newlist = newlist.filter(x => x.complete)
            if (req.query.status == 'active') newlist = newlist.filter(x => !x.complete)
            res.json(newlist)
        }
    else
        {res.status(404).json('not found')}
})
router.post('/users/:name/tasks', (req, res) => {
    if (Object.keys(req.body).map(x => ['complete','content'].includes(x)).reduce((a, b) => a && b)) {
        const temp = { content: req.body.content}
        if (req.body.complete) temp.complete = req.body.complete != "false"
        todos.add(req.params.name, temp)
        const newlist = todos.list(req.params.name)
        if (newlist)
            {res.status(201).json(newlist[newlist.length - 1])}
        else
            {res.status(404).json('not found')}
    } else {
        res.status(400).json('done')
    }
})
router.put('/users/:name/tasks/:id', (req, res) => {
    todos.complete(req.params.name, req.params.id)
    res.json('done')
})
router.delete('/users/:name/tasks/:id', (req, res) => {
    todos.remove(req.params.name, req.params.id)
    res.status(204).json('done')
})
router.get('/users', (req, res) => {
    res.json(todos.listPeople())
})