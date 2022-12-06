const express = require("express");
const appController = require('../controllers/appControler');
const isAuth = require("../middleware/isAuth");
const router = express.Router()

router.post('/signup', appController.createUser)
router.post('/login', appController.login)
router.post('/panel/block',isAuth, appController.blockUsers)
router.post('/panel/unblock',isAuth, appController.unblockUser)
router.post('/panel/delete',isAuth, appController.deleteUser)
router.get('/panel', appController.getUsers)
router.get('/', appController.getUsers)

// router.post('/changepassword',isAuth, appController.changePassword)
// router.get('/', appController.welcome)

module.exports = router;
