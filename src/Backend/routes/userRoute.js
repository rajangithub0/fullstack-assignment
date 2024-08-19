const express=require('express');
const UserModel=require('../model/userModel')
const bcrypt=require('bcrypt')
const router=express.Router();

//get all user 
router.get('/',async(req,res)=>{
    try {
        const users =await UserModel.find()
        res.status(200).send(users)
    } catch (error) {       
        res.send(error)
    }
})
//get user by id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findById(id);
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Some Internal error occured", error })
    }
})

//create user
router.post('/',async(req,res)=>{
   try {
    const {name,email,username,password}=req.body
    if(!name || !username || !email || !password){
        return res.status(403).send('all filed are mandatory')
    }
    let user =await UserModel.findOne({email});
    if(user){
        return res.status(403).send({massage:"email is already register"})
    }
    user=await UserModel.findOne({username})
    if(user){
        return res.status(403).send({massage:"username is already used"})
    }
    const hashPassword =await bcrypt.hash(password,10)
    const newUser=new UserModel({name,username,email,password:hashPassword})
    const resp=await newUser.save();
    return res.status(201).send({massage:'user created',resp})
    } catch (error) {
        console.log(error);
        res.status(500).send({massage:'error internal error',error})
   }
})

//upadate the import data name and password
router.put('/:id',async(req,res)=>{
    try {
        const id = req.params.id;
        const {name,password}= req.body;
        await UserModel.findByIdAndUpdate(id,{name,password})
        res.status(200).send({massage:"user updated sucessfully"})
    } catch (error) {
        console.log(error);
        res.status(500).send({massage:"some error"})
    }
})

// delete a user by
router.delete('/:id',async(req,res)=>{
    try {
        const id= req.params.id;
        const resp=await UserModel.findByIdAndDelete(id);
        if(resp){
            console.log(resp);
            res.status(201).send({massage:'user deleted',resp})
        }else{
            res.status(404).send({massage:"user not found"})
        }
    } catch (error) {
        res.status(500).send({massage:"error",error})
    }
    
})

module.exports=router;