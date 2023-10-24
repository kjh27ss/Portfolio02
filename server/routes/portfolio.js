const express = require('express');
const Category = require('../schemas/category');
const Portfolio = require('../schemas/portfolio');
const upload = require('../upload');
const fs = require('fs-extra');

const router = express.Router();
router.route('/list')
    .get(async (req,res,next)=>{
        try{
            let show = '';
            show = req.query.show;
            let maxNum = 0;
            const row = await Portfolio.find({});         
            const rs = await Category.find().sort({'num':"desc"}); // asc,desc
            if(rs.length>0) maxNum = rs[0].num;
            res.render('portfolio', { row, rs, maxNum, title:"나의 포트폴리오" ,show:show});
        }catch(err){
            console.error(err);
            next(err);
        }
    });

router.route('/write')
    .get(async(req,res,next)=>{
        try{
            const row = await Category.find().sort({"num":"desc"});
            res.render('portfolio_write', {title:"포트폴리오", row});
        }catch(err){
            console.error(err);
            next(err);
        }
    })
    .post( upload.single("img"), async (req, res, next)=>{
        try{
            fs.moveSync('./img/'+req.file.filename, './img/portfolio/'+req.file.filename);
            var fileupload = '';
            if(req.file) {
               fileupload = {
                  orimg: req.file.originalname,
                  img: req.file.filename
               }
            }  
            // const addCategory = await Category.create({
            //     name:req.body.category,
            // });

            const data = {
               category : req.body.category,
               title : req.body.title,
               content:req.body.content,
               link : req.body.link, 
            }
            const datas = {...data, ...fileupload}
            const portfolio = await Portfolio.create(datas);

            console.log(portfolio);
            res.redirect('/portfolio/list');

         }catch(err){
            console.error(err);
            next(err);
         }
     });

router.route('/category/write')    
    .post(async (req,res,next)=>{
        try{
        // const num = Number(req.body.num) + 1;    
        const addCategory = await Category.create({
            name:req.body.category,
            num : req.body.num
        });
        console.log(addCategory);
        res.send('1');
        }catch(err){
            console.error(err);
            next(err);
            res.send('0');

        }
    });

router.route('/category/update')    
    .post(async (req,res,next)=>{ 
        try{  
            const formData = req.body;
            // console.log(formData);
            let cate = formData['category[]'].reverse(); // 배열을 역순으로
            let id = formData['cate_id[]'].reverse(); 
            
            for(let i=0; i< id.length; i++){ // 배열변수에 업데이트 할 구문 추가
                let updateNum = i + 1;
                try{
                    let rs = await Category.updateOne({_id:id[i]},{
                        name : cate[i],
                        num : updateNum
                    });
                    console.log(rs);
                }catch(err){
                    console.error(err);
                }
            }  
            return res.send('1');
            }catch(err){
                console.error(err);
                next(err);
                return res.send('0');                         
        }
    });    

router.route('/category/del')
    .post(async (req,res,next)=>{ 
        try{              
            const id = req.body.id;
            const rs = await Category.deleteOne({_id:id});
            console.log(rs);
            res.send('1');
        }catch(err){
            console.error(err);
            res.send('0');
            next(err);
        }
    });
module.exports = router;