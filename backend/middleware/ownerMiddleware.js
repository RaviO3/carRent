import User from "../models/User.js";

const ownerMiddleware = async (req, res, next) => {
    const user = await User.findById(req.userId);

    if (!user || user.role !== "owner") {
        return res.status(403).json({ success: false, message: "Owner access required" });
    }

    next();
};

export default ownerMiddleware;
