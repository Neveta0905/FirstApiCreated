const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');

const saucesCtrl = require('../controllers/saucesCtrl')

router.get('/',auth,saucesCtrl.getSauces)

router.post('/',auth,multer,saucesCtrl.addSauces)

router.get('/:id',auth,saucesCtrl.getSaucesById)

router.put('/:id',auth,multer,saucesCtrl.modifySauces)

router.delete('/:id',auth,saucesCtrl.deleteSauces)
router.post('/:id/like',auth,saucesCtrl.likeSauces)

module.exports = router