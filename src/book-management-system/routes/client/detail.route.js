const express = require('express')
const router = express.Router();

const controller = require('../../controllers/client/detail.controller'); 

// start /detail/:id

router.get("/:id", controller.getBookDetailById);

// end detail/:id

// start /related/:id

router.get("/related/:id", controller.getRelatedProducts);

// end /related/:id


module.exports= router;



//   123456