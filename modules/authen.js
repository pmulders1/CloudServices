module.exports = function(role){
	return function(req, res, next){
		if(!req.user){
			console.log("NIET INGELOGD------------------")
			res.sendStatus(401);
			var err = {
				errors: {
					message: {
						message: "You need to be logged in to execute this action."
					}
				}
				
			}
			res.json(err);
		}else if(!role || req.user.isInRole(role)){
			next();
		}else{
			console.log("GEEN ADMIN!!!------------------")
			res.sendStatus(403);
			var err = {
				errors: {
					message: {
						message: "You don't have the right permissions to execute this action."
					}
				}
				
			}
			res.json(err);
		}
	}
}