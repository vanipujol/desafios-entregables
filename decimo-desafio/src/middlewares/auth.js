export const checkRole = (roles)=>{
    return (req,res,next)=>{
        console.log(req.session.user.role)
        if(!req.session.user.role){
            return res.json({status:"error", message:"You need to be authenticated"});
        }
        if(!roles.includes(req.session.user.role)){
            return res.json({status:"error", message:"Unauthorized user"});
        }
        next();
    }
}