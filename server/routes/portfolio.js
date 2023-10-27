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
            const row = await Portfolio.find({}).populate("category"); // 외래키 join
            console.log(row);
            const rs = await Category.find().sort({"num":"desc"}); // asc,desc
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
    .post( upload.array("img"), async (req, res, next)=>{
        try{
            let fileupload = '';
            for(let i=0; i<req.files.length; i++){
                fs.moveSync('./img/'+req.files[i].filename, './img/portfolio/'+req.files[i].filename);  
            }                        
            if(req.files) {
               fileupload = {
                    orimg:req.files.map(file => file.originalname),
                    img:req.files.map(file => file.filename)
               }                
            }

            const portfolio = await Portfolio.create({
                ...fileupload,
                category:req.body.category,
                title : req.body.title,
                content:req.body.content,
                link : req.body.link
            });

            console.log(portfolio);
            return res.redirect('/portfolio/list');

         }catch(err){
            console.error(err);
            return next(err);
         }
     });

router.route('/edit/:id')     
     .get(async (request,result,next)=>{
        try{
            const id = request.params.id;
            const rs = await Category.find().sort({"num":"desc"});
            const row = await Portfolio.find({_id:id});
            const res = row[0];
            result.render("portfolio_update", {res,rs,title:"포트폴리오 수정"});
        }catch(err){
            console.log(err);
            next(err);
        }
     })

router.route('/edit')
     .post( upload.single("img"), async(req, res, next)=>{
        // const { title,content, id } = req.body;
        // console.log(title,content, id);       

        try{      
            // const {id} = req.params;
           let fileupload = {};
           if(req.body.imgchk == 1){
              //기존의 파일을 삭제
              fs.removeSync('./img/portfolio/'+req.body.imgname);
              //새로 업로드된 파일 이동
              fs.moveSync('./img/'+req.files[i].filename, './img/portfolio/'+req.files[i].filename);
              //새로운 파일을 등록
              fileupload = {
                 orimg:req.files.map(file => file.originalname),
                 img:req.files.map(file => file.filename)
              }
           }
           const portfo = {
              title: req.body.title,
              content:req.body.content
           } 
           const portfolio = await Portfolio.updateOne({_id : req.body.id}, {
              ...portfo,
              ...fileupload
           });
           console.log(portfolio);
           res.redirect("/portfolio/list");
        }catch(err){
           console.error(err);
           next(err);
        }
     });            

router.route('/del/:id')
     .get(async(req, res, next)=>{
           try{
              const  {id } = req.params;
              const row = await Portfolio.deleteOne({_id: id});
              const rs = row[0];
              res.render('portfolio', { rs });
              }catch(err){
                 console.error(err);
                 next(err);
              }
           });  

// router.route('/del')
//    .post(async(req, res, next)=>{
//          try{
//             const id  = req.body.id;
//             const img = req.body.img;
//             // 파일 삭제
//             if(fs.existsSync('./img/portfolio/'+img)){
//                fs.removeSync('./img/portfolio/'+img);
//             }
//             // db 삭제
//             const rs = await Portfolio.deleteOne({_id:id});
//             console.log(rs);
//             res.send('1');
//             }catch(err){
//                console.error(err);
//                res.send('0');
//                next(err);
//             }
//          });

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