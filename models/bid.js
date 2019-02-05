var mongoose   =   require("mongoose");

var bidSchema  =  new mongoose.Schema({
	                 title:String,
	                 text:String,
	                 bid:Number,
					 image:String,
					 time:String,
					 clients_username:[{username:String,
					                     cost:Number}],
	                 author:{
	                   	  id:{
	                   	  	  type:mongoose.Schema.Types.ObjectId,
	                   	  	  ref:"User"
	                   	  },
	                   	  username:String
	                   }

})



module.exports =  mongoose.model('bid',bidSchema);