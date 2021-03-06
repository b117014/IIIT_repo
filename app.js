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
      middleware  =     require('./middleware/index'),
      override    =      require('method-override'),
       app  =   express();


       const keySecret  = "sk_test_veBHxIl8huyM1xJ7XYu6Z8Wx";
const keyPublishable = "pk_test_EcDcCoAGVRMU3RPq8ZY6Xyri";

       mongoose.connect('mongodb://localhost/bid');
     
          app.use(bodyparser.urlencoded({extended:true}));
          app.use(override("_method"));

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
 
 


 function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
     app.get('/dashboard',(req,res)=>{
      if(req.query.fuzzy)
      {
          const regex = new RegExp(escapeRegex(req.query.fuzzy),"gi");
          bid.find({"title":regex},function(err,data){
              if(err){
                  console.log(err);
              }else{
                  res.render("dashboard",{data:data});
              }
          })
      }
      
      
         bid.find({}).then((data)=>res.render('dashboard',{data:data})).catch((err)=>console.log(err));
     
     })
     
     app.get('/new',middleware.isloggedin,(req,res)=>{
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


   app.get('/dashboard/:id',middleware.isloggedin,(req,res)=>{
            bid.findById(req.params.id).then((data)=>res.render('update_bid',{data:data})).catch((err)=>console.log(err))
   })


     app.put('/dashboard/:id',(req,res)=>{
           bid.findById(req.params.id)
           .then((data)=>{
              console.log(data.bid);
              console.log(req.body.update_bit)
               if(data.bid>req.body.update_bit.bid){
                 res.redirect('/dashboard');
               }else{
                bid.findByIdAndUpdate(req.params.id,req.body.update_bit)
                .then((data)=>{
                    const username =req.user.username;
                    
                     data.clients_username.push({username:username,cost:req.body.update_bit.bid});
                    
                     data.save();
                     console.log(data.clients_username.username);
                   res.redirect('/dashboard')})
                .catch((err)=>console.log(err))
               }
           })
           .catch((err)=>console.log(err));
         
     })

    //======================
    // Fuzzy search
    //======================

  

 




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
 	                 successRedirect:"/dashboard",
 	                 failureRedirect:"/login"
 }), function(req,res){});

 app.get("/logout",function(req,res){
 	   req.logout();
 	   res.redirect("/dashboard");
 })





 app.listen(5000);