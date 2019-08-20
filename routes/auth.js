'use strict';

const express = require('express');
const createError = require('http-errors');

const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/User');
const {sendContactMail} = require('../helpers/nodemailer')

const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin
} = require('../helpers/middlewares');

router.get('/me', isLoggedIn(), (req, res, next) => {
  res.json(req.session.currentUser);
});

router.post(
  '/login',
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        next(createError(404));
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        return res.status(200).json(user);
      } else {
        next(createError(401));
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/presignup',
  isLoggedIn(),
  async (req, res, next) =>{
    const  {email} = req.body;
    try{
      const user = await User.findOne({email});
      if(user){
        const otherToken = Math.floor(Math.random()* 1000000) * 876578432;
        const newTokenForUser = await User.findByIdAndUpdate(user._id, {$set:{token:otherToken}})
        res.status(209).json(newTokenForUser);
      }else{
        const token = Math.floor(Math.random()* 1000000) * 876578432;
        const newUser = await User.create({
          token,
          email
        });
        sendContactMail(newUser.email, newUser.token);
        res.status(200).json(newUser);
      }
    }catch(err){
      next(err)
    }
  }
)

router.post(
  '/completesignup',
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { email, password, username, token } = req.body;
    try {
      const user = await User.findOne({ email });
      const rest = user.updatedAt.getTime() - new Date().getTime()
      if (user.token !== token && user.email !== email && rest > 3600000) { // 3600000 es una hora
        return next(createError(419));
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);
        const updatedUser = await User.findByIdAndUpdate(user._id, {$set: {password: hashPass, username, isActive:true}})
        req.session.currentUser = updatedUser;
        res.status(200).json(updatedUser);
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post('/logout', isLoggedIn(), (req, res, next) => {
  req.session.destroy();
  return res.status(204).send();
});

router.get('/private', isLoggedIn(), (req, res, next) => {
  res.status(200).json({
    message: 'This is a private message'
  });
});

module.exports = router;
