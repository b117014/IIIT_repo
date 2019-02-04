var mongoose   =   require("mongoose");

var bidSchema  =  new mongoose.Schema({
	                 text:String,
	                 Bid:Number,
	                 image:String,
	                 author:{
	                   	  id:{
	                   	  	  type:mongoose.Schema.Types.ObjectId,
	                   	  	  ref:"User"
	                   	  },
	                   	  username:String
	                   }

})



module.exports =  mongoose.model('bid',bidSchema);