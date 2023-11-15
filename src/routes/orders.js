const express = require("express")
const orderItemsSchema = require('../models/order')
const router = express.Router();

router.get('/', (req, res, next)=>{
    "List code"
})

router.get('/:id', (req, res, next)=>{
    "Get for id code"
})

router.delete('/:id/:item_id', (req, res, next)=> {
    "Delete code"
})

router.post('/customers', (req, res, next) => {
    "Post code"
})

router.put('/:id/:item_id', (req, res, next)=>{
    "Put code"
})