'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Benchmark = require('../models/Benchmark');
const Mark = require('../models/Mark');
const BoxClass = require('../models/BoxClass');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin
} = require('../helpers/middlewares');

router.post('/adduser', isLoggedIn(), async (req, res, next) => {
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

router.get('/friends/:username', isLoggedIn(), async (req, res, next) => {
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
router.post('/addclass', isLoggedIn(), async (req, res, next) =>{
    const {dateofclass} = req.body.typeOfClass;
    const addedDate = new Date(dateofclass)
    let latency = 30 * 60000;
    const allClases = await BoxClass.find();
    
    let checkedDates = allClases.find((box)=>{
      let boxDate = new Date(box.date)
       if(boxDate.getTime() > addedDate.getTime()){
          return boxDate.getTime() - addedDate.getTime() < latency
       } else {
          return addedDate.getTime() - boxDate.getTime() < latency
       }
      })

    if(!checkedDates){
          try{
            const { typeOfClass, maxParticipants, dateofclass } = req.body.typeOfClass;
            const newClass = await BoxClass.create({typeOfClass,maxParticipants,date: dateofclass});
            res.status(200).json(newClass);
          }catch(err){
            next(err)
          }
        }else{
          return res.status(405).json({error: 'La clase ya existe.'})
        }
    
  })


router.post('/bookclass', isLoggedIn(), async (req, res, next) =>{
  try{
    const { user, classe } = req.body;
    const pushToParticipants = await BoxClass.findByIdAndUpdate(classe._id ,{$push: {participants: user._id}}, {new: true});
    res.status(200).json(pushToParticipants);
  }catch(err){
    next(err)
  }
})
router.post('/unsubclass', isLoggedIn(), async (req, res, next) =>{
  try{
    const { userId, classeId } = req.body;
    const clase = await BoxClass.findByIdAndUpdate(classeId, { $pull: { participants: userId } }, { new: true });
    res.status(200).json(clase);
  }catch(err){
    next(err)
  }
})
router.post('/getuserclasses', isLoggedIn(), async(req,res,next)=>{
  try{
    const {user} = req.body;
    const allClasses = await BoxClass.find();
    const allClassesWithAmI = allClasses.map((clase)=>{
      const newClass = clase.toJSON()
      newClass.participants.forEach((id) => {
        if(id.equals(user)){
          newClass.amI = true;
        }
      })
      return newClass
    })
    //////////////////////////////
    res.status(200).json(allClassesWithAmI)

  }catch(err){
    next(err)
  }
})
router.post('/getcalendardates', isLoggedIn(), async (req, res, next) =>{
  try{
    const {day, user} = req.body;

    //////////////////////////////
    const allClasses = await BoxClass.find().populate('participants');
    const allClassesWithNewDate = allClasses.map((classe)=>{
      const newDate = classe.date.toLocaleDateString().split('/').reverse();
      const newNewDate = [newDate[1],newDate[2],newDate[0]];
      const dat = newNewDate.reduce((a,b)=> a+b)
      console.log(newDate)
      // const newDate = classe.date.toLocaleDateString().split('/').reverse().reduce((a,b) =>{
      //     return b + a;
      //   });
      const classeInJson = classe.toJSON();
      console.log(dat, day[0])
      classeInJson.dat = (dat === day[0] ?  true : false);
      return classeInJson;
    })
    const classesToSend = allClassesWithNewDate.filter((classe)=>{
      return classe.dat
    })
    //////////////////////////////

    const allMyClasses = classesToSend.map((classe) => {
      const participantsArr = classe.participants.map((participant)=>{
        if(participant._id == user){
          classe.AmI = true;
        }
      })
      return classe;
    });
    console.log('Array to show', allMyClasses)
    res.status(200).json(allMyClasses)
  }catch(err){
    next(err)
  }
})

router.get('/user/:id', isLoggedIn(), async (req, res, next) =>{
  try{
    const { id } = req.params;
    const user = await User.findById(id).populate('friends');
    res.status(200).json(user);
  }catch(err){
    next(err)
  }
})
router.post('/createbench', isLoggedIn(), async (req, res, next) => {
  try{
    const {name} = req.body;
    const newbench = await Benchmark.create({
      name
    })
    res.status(200).json(newbench)
  }catch(err){
    next(err)
  }
})
router.post('/addbenchmark', isLoggedIn(), async (req,res,next)=> {
  try{
    const {user, bench } = req.body;

    // const intoUser = await User.findByIdAndUpdate(user, {$set: {$push:{benchmarks: bench}}})s
  }
  catch (err){
    next(err)
  }
})
router.get('/benchmarks', isLoggedIn(), async (req,res,next)=>{
  try{
    const benchs = await Benchmark.find();
    res.status(200).json(benchs)
  }catch(err){
    next(err)
  }
})
router.get('/getmarks/:idusuario/:idbench', isLoggedIn(), async (req, res, next)=>{
  try{
    const {idusuario,idbench} = req.params;
    const bench = await Benchmark.findById(idbench).populate({
      path: 'marks'
    })
    const marks = bench.marks.filter((mark)=>{
      return mark.user == idusuario
    })
    res.status(200).json(marks);
  }catch(err){
    next(err)
  }
})

router.post('/addmark', isLoggedIn(), async (req,res, next)=>{
  const idbench = req.body.idbench;
  const {values} = req.body;
  const user = req.session.currentUser._id
  try{
    const {date, weight,reps} = values;
    const newMark = await Mark.create({
      date,
      weight,
      reps,
      user
    })
    const newMarkOnBench = await Benchmark.findByIdAndUpdate(idbench, {$push:{marks:newMark._id}},{new:true})
    res.status(200).json(newMarkOnBench)
  }catch(err){

  }
})
module.exports = router;
