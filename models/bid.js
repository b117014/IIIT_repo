var mongoose   =   require("mongoose");

var bidSchema  =  new mongoose.Schema({
	                 text:String,
	                 bid:Number,
					 image:String,
					 time:String,
	                 author:{
	                   	  id:{
	                   	  	  type:mongoose.Schema.Types.ObjectId,
	                   	  	  ref:"User"
	                   	  },
	                   	  username:String
	                   }

})



module.exports =  mongoose.model('bid',bidSchema);