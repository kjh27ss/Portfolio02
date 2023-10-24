const mongoose = require('mongoose');

require('dotenv').config();

const mongodbid = process.env.MONGODB_ID;
const mongodbpass = process.env.MONGODB_PASS;
const mongodbhost = process.env.MONGODB_HOST;
const mongodbport = process.env.MONGODB_PORT;
const mongodb = process.env.MONGODB_DB;

// console.log(mongodbid, mongodbpass,mongodbhost,mongodbport,mongodb);

//connection
const connect = () => {
    // console.log('몽고디비에 접속!');
    if(process.env.NODE_ENV !== 'production'){
        mongoose.set('debug',true);
    }
    mongoose.connect(
        //mongodb://아이디:비번@주소:포트번호/admin
        `mongodb://${mongodbid}:${mongodbpass}@${mongodbhost}:${mongodbport}/${mongodb}`,{
            dbName : 'mydb',
            useNewUrlParser:true
        }   
    ).then(()=>{
        console.log('몽고DB 연결 성공!');
    }).catch((err)=>{
        console.error('몽고DB 연결 에러!!!🤮',err);
    });
};

mongoose.connection.on('error',(error)=>{
    console.error('db연결 실패!!😫', error);
})

mongoose.connection.on('disconnected', ()=>{
    console.error('db연결 끊김.. 연결 재시도 중..');
    connect();
})

module.exports =  connect;