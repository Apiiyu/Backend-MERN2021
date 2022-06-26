var express = require('express');
var router = express.Router();
const { index, changeStatus } = require('./controller')
const { isLoginAdmin } = require('../middleware/auth')

/* Router Payment of Method Page */
router.use(isLoginAdmin)

router.get('/', index)
router.put('/status/:id', changeStatus)
// router.post('/create', createData)
// router.get('/update/:id', viewUpdate)
// router.put('/update/:id', updateData)
// router.delete('/delete/:id', deleteData)

module.exports = router;
