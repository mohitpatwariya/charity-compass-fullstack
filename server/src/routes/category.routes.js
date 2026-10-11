const categoryRouter = require('express').Router();
const { addCategory, getAllCategories } = require('../controllers/category.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

categoryRouter.post('/addCategory', verifyToken, addCategory); //temporary route
categoryRouter.get('/getAllCategories', verifyToken, getAllCategories);

module.exports = categoryRouter;