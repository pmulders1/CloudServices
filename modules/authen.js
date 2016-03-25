module.exports = function(role){
	console.log("returning middleware");
	return function(req, res, next){
		console.log(" haha")
		if(req.user.isInRole(role)){
			console.log("hahaha");
			next();
		} else {
			console.log("haha")
			res.json("Error Error")
		}
	}
}