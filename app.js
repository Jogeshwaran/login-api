const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/loginDb", { useNewUrlParser: true , useUnifiedTopology: true })

const loginSchema = new mongoose.Schema({
  username:String,
  password:String
})

const Login = mongoose.model("Login",loginSchema);

app.route("/login")

.get(function(req,res){
  Login.find({},function(err,foundlogins){
    if(!err){
      res.send(foundlogins)
    }else {
      res.send(err);
    }
  })
})

.post(function(req,res){
  console.log(req.body.username);
  console.log(req.body.password);

  const newlogin = new Login({
    title:req.body.username,
    content:req.body.password
  });

  newlogin.save(function(err){
    if(!err){
      res.send("login added sucessfully")
    }
    else{
      res.send(err)
    }
  });
})

.delete(function(req,res){
  Login.deleteMany({},function(err,deletedlogin){
    if(!err){
      res.send(deletedlogin)
    }else{
      res.send(err);
    }
  })
});

//////request Targeting a specfic login///////

app.route("/logins/:specficlogin")

.get(function(req,res){

  Login.findOne({title:req.params.specficlogin},function(err,foundLogin){
    if(foundLogin){
      res.send(foundLogin);
    }
    else{
      res.send("no found");
    }
  })

})

.put(function(req,res){
  Login.update(
    {title:req.params.specficlogin},
    {title:req.body.username,content:req.body.password},
    {overwrite:true},
    function(err){
      if(!err){
        res.send("updated sucessfully")
      }
    }
  )
})

.patch(function(req,res){
  Login.update(
    {title:req.params.specficlogin},
    {$set:req.body},
    function(err){
      if(err){
        res.send(err)
      }
      else{
        res.send("sucessfully updated patch request")
      }
    }
  )
})

.delete(function(req,res){
  Login.deleteOne(
    {title:req.params.specficlogin},
    function(err){
      if(!err){
        res.send("Deleted sucessfully")
      }
      else{
        res.send(err)
      }
    }
  )
})



app.listen("3000",function(){
  console.log("sucessfully connected to port 3000");
})
