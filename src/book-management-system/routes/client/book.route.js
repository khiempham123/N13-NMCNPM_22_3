const express = require('express')
const router = express.Router();

const controller = require('../../controllers/client/book.controller')

router.get('/', controller.index)

router.post('/', controller.add)
router.get('/search',controller.search)
router.get('/:id',controller.update)
router.put('/:id',controller.update)
router.delete('/:id',controller.delete)
module.exports= router;