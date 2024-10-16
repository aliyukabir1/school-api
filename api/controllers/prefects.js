const mongoose = require('mongoose')
const User = require('../model/users')


exports.get_prefects = (req,res)=>{
    User.find({role:"Prefect"}).exec().then((prefects)=>{
        if(prefects){
           res.status(200).json(
           { message: "Success",
           body: prefects
            }
           ) 
        }
    })
    }