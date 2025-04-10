const express=require('express');
const path=require('path')
const axios = require('axios');
const router=express.Router()
const mangoose=require('mongoose')
const donor=require('../models/donorsignup.js');//donormodel contain  exported model of donorsigup


//below configuaration  email sending
const nodemailer=require('nodemailer');
require('dotenv').config();
//for email sending end


const POSTMARK_API_URL = 'https://api.postmarkapp.com/email';
const SERVER_TOKEN = '2a10a0b9-d204-45bc-9d4d-b9fd1b9a3458'; // Replace with your actual Postmark token


//to get data of all donors
router.get('/getalldonors',(req,res)=>{
 
    donor.find((err, docs) => {
        if (!err) {
            console.log('Display all donors'),res.send(docs);
        }
        else 
            console.log('Error in display all donors' + JSON.stringify(err, undefined, 2));
    });
})





//to post data while signup
router.post('/signup',(req,res)=>{
     var d=new donor({
        hname:req.body.hname,
        email:req.body.email,
        password:req.body.password,
        address:req.body.address,
        contact:req.body.contact,
        count:0,
        todonate:[
            {'food':false},
            { 'cloth': false },
            { 'money': false },
            { 'other': false }
        
        ]

    });
    donor.find({'email':d.email,'password':d.password},(err,doc)=>{
            if(!err)
            {
                if (doc.length)//if present return true
                    res.send(true)
                else{
                    d.save((err, doc) => {
                        if (!err) 
                            console.log('Donor saved to db')
                        else
                            console.log('Error in dsignup data saving to database ', JSON.stringify(err, undefined, 2));
                        res.send(false);//not exist so saving
                    })

                }
            }
        })
});

//to check data 
router.post('/signin',(req,res)=>{
    var password=req.body.password;
    var email=req.body.email;
    var hname=req.body.hname;
    donor.find({ 'email': email,'password':password,'hname':hname},(err,doc)=>{
        if(!err)
        {   
            if(doc.length)
                console.log("Search complete for donor"),res.send(true);
            else
                console.log("donor data not exist"),res.send(false)
        }
        else
        {
            console.log('Error in donor signin in node js ',JSON.stringify(err,undefined,2))
        }
        
    })
})

//to delete donor this is for admin
router.post('/delete',(req,res)=>{
    console.log('inside delete function');
    const id = req.body._id;
    donor.findByIdAndDelete((id),(err)=>{
        if(!err)
        {
            console.log('Donor with ',id, ' Deleted!!');
            res.send(true);
        }
        else 
        {
            console.log('Error in delete donor ',JSON.stringify(err,undefined,2));
            res.send(false);
        }
            
    })
});

//to delete donor with his permission
router.post('/deletebypermission',(req,res)=>{
    var donoremailtodelete = req.body.email
    donor.deleteOne({email:donoremailtodelete},(err)=>{
        if(!err)
        {
            console.log(donoremailtodelete , 'Successfully Deleted with his/her Permission');
            res.send(true)
            
        }
        else
        {
            console.log('Error in Donor inside delete permission');
            res.send(false);
        }
    })
   
})


//to send email notification
router.post('/sendemailll',(req,res)=>{
    var donoraddress=req.body.email;
    var receiveraddress=req.body.address;
    console.log(req.body);
    var flg=0;
    var s='';
    if(req.body.food)
    {
        s = s + 'food ';flg=1
    }
    if(req.body.cloth)
    {
        
        if(flg)
            s = s + ', cloth ';
        else
            s=s+ 'cloth '; 
        flg = 1
    }
    if(req.body.money)
    {
        if (flg)
            s = s + ', money ';
        else
            s = s + ' money';
        flg = 1
    }
    if(req.body.other)
    {
        if(flg)
            s = s + '  and some other things'
        else
            s='something '
    }
        

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'yourmail@gmail.com',
            pass: '**************'
        }
    })

    var mailOption = {
        from: 'yourmail@gmail.com',
        to: receiveraddress,//this is receivers email address
        subject:'From Gather & Give regarding donation',
        // text:emailmeassage,
        html: 
       `<html>
        <body>
        <div style='display:block;width:700px;height:600px;background:rgba(255, 220, 156, 0.836);border:1px solid black;'>
            <h1 style='text-align:center'>Hey Buddy!This is Gather & Give!</h1>
        
            <img src='https://d3ayyz93zozlya.cloudfront.net/uploaded-images/articlemainimage/7-ways-to-upgrade-your-nonprofit-donation-page-588924cc786e8.jpeg' width='300px' height='300px' alt='image' style='display: block;margin-left: auto;margin-right: auto;' />
         
            <h2 style='text-align:center'>Giving is not About making donation it is about making difference </h2>
         
            <h2><p style='padding-left: 10px;'> ${donoraddress} want to donate ${s} to needy people through your home.</p>
         
            <p style='padding-left: 10px;'>You can contact them on ${donoraddress}.</p></h2>
        
        </div>
        </body>
        </html>`
        // text:` <h1>Hello This is Gather & Give</h1> `
        
    }


    transporter.sendMail(mailOption, function (err, data) {
        if (!err) {
            console.log('Email send from ',donoraddress,' to ',receiveraddress)
            donor.updateOne({'Email':donoraddress},{$inc:{'count':1}},(err,doc)=>{
                if(err)
                    console.log('Error'+JSON.stringify(err,undefined,2))
                else    
                    console.log('No error');
            })
            
            res.send(true)
        }
        else {
            console.log('Error in send mail ' + JSON.stringify(err, undefined, 2));
            res.send(false)
        }
    })


})


//to recover passowrd
router.post('/recoverpass',(req,res)=>{
    var demail=req.body.email;
    var pass=req.body.password;
    
    donor.updateOne({ 'email': demail }, { $set:{ 'password':pass }}, (err, doc) => {
        if (!err)
        {
            console.log('password updated successfully');
            res.send(true);
        }
        else
        {
            console.log('error in password update' + JSON.stringify(err, undefined, 2))
            res.send(false);
        }
            
    })
    
})


router.post('/sendemail', async (req, res) => {
  
    try {
     // console.log('get email data request',req.body)
        const response =  await axios.post(POSTMARK_API_URL, req.body, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Postmark-Server-Token': SERVER_TOKEN
            }
        });
       
        res.status(200).json(response.data);
    } catch (error) {
      //console.log('got error response',error)
        res.status(500).json({ error: error.response?.data || 'Error sending email' });
    }
})

//exporting module
module.exports=router