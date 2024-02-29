export const checkRole = (roles)=>{
    return (req,res,next)=>{
        console.log(req.session.user.role)
        if(!req.session.user.role){
            return res.json({status:"error", message:"Necesitas estar autenticado"});
        }
        if(!roles.includes(req.session.user.role)){
            return res.json({status:"error", message:"Usuario no autorizado"});
        }
        next();
    }
}