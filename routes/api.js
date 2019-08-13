'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const BoxClass = require('../models/BoxClass');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/adduser', async (req, res, next) => {
  try{
    const { username, password } = req.body;
    const checkUser = await User.find({username});
    if(checkUser){
     res.status(500).json({ username: "Must be unique."})
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await User.create({
      username,
      password: hashedPassword
    });
    res.status(200).json(user);
  }catch(err){
    next(err)
  }
})

router.get('/friends/:username', async (req, res, next) => {
  // Take all apps from database
  try {
    const currentUser = req.params.username;
    const user = await User.findOne({username: currentUser}).populate('friends');
    const friends = user.friends;
    res.status(200).json(friends);
  } catch (err) {
    next(err);
  }
});

router.post('/addclass', async (req, res, next) =>{
  try{
    const { typeOfClass, maxParticipants, date } = req.body;
    const newClass = await BoxClass.create({typeOfClass,maxParticipants,date});
    res.status(200).json(newClass);
  }catch(err){
    next(err)
  }
})

router.post('/getcalendardates', async (req, res, next) =>{
  try{
    const dateToCompare = req.body;
    const allClasses = await BoxClass.find();
    const allClassesWithNewDate = allClasses.map((classe)=>{
    const newDate = classe.date.toLocaleDateString().split('-').reduce((a,b) =>{
        return b + a;
      });
      classe.newDate = (newDate === dateToCompare[0] ?  true : false);
      return classe;
    })
    console.log(allClassesWithNewDate[0].newDate)
    
    const classesToSend = allClassesWithNewDate.filter((classe)=>{
      return classe.newDate
    })

    res.status(200).json(classesToSend)
  }catch(err){
    next(err)
  }
})

// router.post('/apps/new', async (req, res, next) => {
//   // Create new app
//   try {
//     const newApp = req.body;
//     const appCreated = await App.create(newApp);
//     res.status(200).json(appCreated);
//   } catch (err) {
//     next(err);
//   }
// });

// router.put('/apps/:id/update', async (req, res, next) => {
//   // update app by id
//   const { id } = req.params;
//   const appUpdated = req.body;
//   try {
//     const updated = await App.findByIdAndUpdate(id, appUpdated, { new: true });
//     res.status(200).json(updated);
//   } catch (err) {
//     next(err);
//   }
// });

// router.delete('/apps/:id/delete', async (req, res, next) => {
//   // delete app by id
//   const { id } = req.params;
//   const appDeleted = await App.findByIdAndDelete(id);
//   res.json(appDeleted);
// })
// ;
module.exports = router;
