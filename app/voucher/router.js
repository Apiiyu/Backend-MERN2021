var express = require('express');
var router = express.Router();
const multer = require('multer')
const os = require('os')
const { index, viewCreate, createData, viewUpdate, updateData, deleteData, changeStatus } = require('./controller')
const { isLoginAdmin } = require('../middleware/auth')

/* Router Vouchers Page */
router.use(isLoginAdmin)

router.get('/', index)
router.get('/create', viewCreate)
router.post('/create', multer({ dest: os.tmpdir()}).single('thumbnail'), createData)
router.get('/update/:id', viewUpdate)
router.put('/update/:id', multer({ dest: os.tmpdir()}).single('thumbnail'), updateData)
router.delete('/delete/:id', deleteData)
router.put('/status/:id', changeStatus)

module.exports = router;
