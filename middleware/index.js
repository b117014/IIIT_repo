var ob={};


ob.isloggedin= function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    
    res.redirect("/login");
}


module.exports = ob