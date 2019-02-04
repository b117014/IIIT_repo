var   express   =   require('express'),
      mongoose  =   require('mongoose'),
      bodyparser =  require('body-parser'),
      passport    =   require('passport'),
      passport_l  =   require('passport-local'),
      passport_lm =   require('passport-local-mongoose'),
      bid         =   require('./models/bid'),
      User        =  require('./models/user'),
      multer      =   require('multer'),
      cloudinary  =    require('cloudinary'),
       app  =   express();


       const keySecret  = "sk_test_veBHxIl8huyM1xJ7XYu6Z8Wx";
const keyPublishable = "pk_test_EcDcCoAGVRMU3RPq8ZY6Xyri";

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

     app.use((req,res,next)=>{
        res.locals.current_user = req.user;
      
    next();
     })
       




     //=============
  // Image
  //=============

  var storage = multer.diskStorage({
   filename: function(req, file, callback) {
     callback(null, Date.now() + file.originalname);
   }
 });
 var imageFilter = function (req, file, cb) {
     // accept image files only
     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
         return cb(new Error('Only image files are allowed!'), false);
     }
     cb(null, true);
     
 };
 var upload = multer({ storage: storage, fileFilter: imageFilter})
 
 
 cloudinary.config({ 
   cloud_name: 'tailer', 
   api_key: '973925748676287', 
   api_secret:'CVtBqk-dxZ5rexL7ThR1fLnVBQk'
 });
 
 



     app.get('/dashboard',(req,res)=>{
     	  bid.find({}).then((data)=>res.render('dashboard',{data:data})).catch((err)=>console.log(err));
     })
     
     app.get('/new',(req,res)=>{
     	  res.render('new');
     })
    
     app.post('/new',upload.single("image"),(req,res)=>{
      cloudinary.uploader.upload(req.file.path ,function(result){
         var hel=result.secure_url;
       req.body.new_data.image = hel;
     	bid.create(req.body.new_data)
     	    .then((data)=>res.redirect('/dashboard'))
            .catch((err)=>console.log(err));
      })
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