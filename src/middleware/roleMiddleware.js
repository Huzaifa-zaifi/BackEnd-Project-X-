export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin only access" });
  
    next();
  };
  
  export const authorizeSupervisor = (req, res, next) => {
    if (req.user.role !== "supervisor" && req.user.role !== "admin")
      return res.status(403).json({ message: "Supervisor only" });
  
    next();
  };
  