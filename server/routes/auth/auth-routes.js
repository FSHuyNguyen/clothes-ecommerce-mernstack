const express = require("express");
const { registerUser, loginUser, logoutUser, authMiddleware } = require("../../controllers/auth/auth-controller");
const { logger } = require("../../logger");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, (req, res) => {
    const user = req.user;
    return logger({
        res,
        success: true,
        data: user,
        key: 'user'
    })
});


module.exports = router;
