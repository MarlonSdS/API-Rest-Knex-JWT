var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UserController");
const User = require("../models/User");
var adminAuth = require('../middleware/adminAuth');

router.get('/', HomeController.index);
router.post('/user', UserController.create);
router.get('/user',adminAuth, UserController.index);
router.get('/user/:id',adminAuth, UserController.findUser);
router.put('/user',adminAuth, UserController.edit);
router.delete('/user/:id',adminAuth, UserController.remove);
router.post('/passwordRecover', UserController.passwordRecover);
router.post('/changePassword', UserController.changePassword);
router.post('/login', UserController.login);

module.exports = router;