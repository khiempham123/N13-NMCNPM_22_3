const express = require('express');
const router = express.Router();

const controller = require('../../controllers/client/product.controller');

router.get('/', controller.index); 
router.get('/:id', controller.detail); 
router.get("/categories", controller.getCategories);
router.post('/', controller.create); 
router.put('/:id', controller.update); 
router.delete('/:id', controller.delete); 

module.exports = router;
