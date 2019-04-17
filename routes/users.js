const express=require('express');
const router=express.Router();
const Users=require('../model/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const config=require('../config/config');

//funções auxiliares
const createUserToken=(userId)=>{
    return jwt.sign({id:userId},config.jwt_pass,{expiresIn:config.jwt_expires_in});
}


router.get('/',async(req,res)=>{
    try{
        const users = await Users.find({});
        return res.send(users);
    }
    catch(err){
        return res.status(500).send({error:'Erro na consulta de usuário.'});
    }
});

router.post('/create', async(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password) return res.status(400).send({error:'Dados insuficientes.'});

    try{
        if (await Users.findOne({email})) return res.send({error:'Usuário já cadastrado.'});

        const user= await Users.create(req.body);
        user.password=undefined;
        return res.status(201).send({user,token:createUserToken(user.id)});
    }
    catch(err){
        return res.status(500).send({error:'Erro ao buscar usuário.'});
    }
});

router.post('/auth', async(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password) return res.status(400).send({error:'Dados insuficientes.'});

    try{
        const user=await Users.findOne({email}).select('+password');
        if (!user) return res.status(400).send({error:'Usuário não cadastrado.'});

        const pass_ok=await bcrypt.compare(password,user.password);
        if(!pass_ok) return res.status(401).send({error:'Erro ao autenciar usuário.'});

        user.password=undefined;
        return res.send({user, token:createUserToken(user.id)});
    }
    catch(err){
        return res.status(500).send({error:'Erro ao buscar usuário.'});
    }
});

module.exports=router;



/* STATUS CODE
200 - OK
201 - CREATED
202 - ACCEPTED

400 - BAD REQUEST
401 - UNAUTHORIZED
403 - FORBIDDEN
404 - NOT FOUND

500 - INTERNAL SEVER ERROR
501 - NOT IMPLEMENTED
503 - SERVICE UNVAILABLE 
*/