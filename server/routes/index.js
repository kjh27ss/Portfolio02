const express = require("express");
const router = express.Router();

router.get('/', (req,res,next)=>{
    // write, end => html
    res.render('index', {title:'관리자모드'});
});

module.exports = router;