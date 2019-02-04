var   express   =   require('express'),
      mongoose  =   require('mongoose'),
      bodyparser =  require('body-parser'),
      passport    =   require('passport'),
      passport_l  =   require('passport-local'),
      passport_lm =   require('passport-local-mongoose'),
      bid         =   require('./models/bid'),
      User        =  require('./models/user'),
       app  =   express();


       mongoose.connect('mongodb://localhost/bid');
     
          app.use(bodyparser.urlencoded({extended:true}));
       app.use(express.static(__dirname+"/public"));
       app.set("view engine","ejs");


       
       app.use(require("express-session")({
    	  secret:"this is your booking",
    	  resave:false,
    	  saveUninitialized:false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

 
    

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    passport.use(new passport_l(User.authenticate()));

     
       

     app.get('/dashboard',(req,res)=>{
     	  bid.find({}).then((data)=>res.render('dashboard',{data:data})).catch((err)=>console.log(err));
     })
     
     app.get('/new',(req,res)=>{
     	  res.render('new');
     })
    
     app.post('/new',(req,res)=>{
     	bid.create(req.body.new_data)
     	    .then((data)=>res.redirect('/dashboard'))
     	    .catch((err)=>console.log(err));
     })




       //=========================
       // Authentication
       //=========================

       app.get('/register',(req,res)=>{
       	       res.render('register');
       })

       app.post("/register",function(req,res){
    
           
	User.register(new User({username:req.body.username}) , req.body.password , function(err,user){
		  if(err){
		  	console.log(err);
            res.redirect("/dashboard");
		  }else{
		  	passport.authenticate("local")(req,res,function(){
		  		  res.redirect("/dashboard");
		  	})
		  }
	})

});


   app.get('/login',(req,res)=>{
   	  res.render('login');
   })

   app.post("/login" , passport.authenticate("local",{
 	                 successRedirect:"/land",
 	                 failureRedirect:"/login"
 }), function(req,res){});

 app.get("/logout",function(req,res){
 	   req.logout();
 	   res.redirect("/dashboard");
 })





 app.listen(3000);