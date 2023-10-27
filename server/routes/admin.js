const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('../schemas/admin');
const router = express.Router();
require('dotenv').config();
//process.env.SALT_ROUNDS
router.route('/write')
    .get((req,res,next)=>{
        res.render('admin');
        // console.log(process.env.SALT_ROUNDS);
    })
    .post((req,res,next)=>{
        let { userid, userpass } = req.body;
        Admin.findOne({userid:userid}, async(err,doc)=>{
            try{

            }catch(err){
                console.error(err);
            }
        });
        console.log(myadmin.length);
        // 암호화
        // const myhash = bcrypt.hash(userpass, process.env.SALT_ROUNDS);

    });

module.exports = router;    