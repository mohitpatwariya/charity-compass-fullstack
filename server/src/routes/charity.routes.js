const { registerCharity, getCharityByCategory, getCharityById } = require('../controllers/charity.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const charityRouter = require('express').Router();

charityRouter.get('/getCharityById/:id', verifyToken, getCharityById);
charityRouter.post('/getCharityByCategory', verifyToken, getCharityByCategory);
charityRouter.post('/registerCharity', verifyToken, registerCharity);

module.exports = charityRouter;