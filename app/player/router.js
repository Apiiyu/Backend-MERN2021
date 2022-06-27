var express = require('express');
var router = express.Router();
const { landingPage, detailPage, category, checkOut, historyTransaction, detailHistory, dashboardOverview, profile, updateProfile } = require('./controller')
const { isLoginPlayer } = require('../middleware/auth')
const multer = require('multer')
const os = require('os')

/* Router Payment of Method Page */

router.get('/landingpage', landingPage)
router.get('/:id/detail', detailPage)
router.get('/category', category)
router.post('/checkout', isLoginPlayer, checkOut)
router.get('/history', isLoginPlayer, historyTransaction)
router.get('/history/:id/detail', isLoginPlayer, detailHistory)
router.get('/dashboard', isLoginPlayer, dashboardOverview)
router.get('/profile', isLoginPlayer, profile)
router.put('/profile', isLoginPlayer, multer({dest: os.tmpdir()}).single('avatar') ,updateProfile)

module.exports = router;
