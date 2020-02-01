const jwt = require("jsonwebtoken");

const User = require("../models/user")

module.exports = {
    registerUser: (req, res, next) => {
        try {
            User.create(req.body.user, (err, user) => {
                if (err) return next(err);
                if (!user) {
                    return res
                        .status(400)
                        .json({ msg: "Please Try Again", success: false });
                }

                res.json({ success: true, msg: "You Are Successfully Registered" });
            });
        } catch (err) {
            next(err);
        }
    },

    loginUser: (req, res, next) => {
        try {
            const { email, password } = req.body.user;
            User.findOne({ email }, (err, user) => {
                if (err) return next(err);
                if (!user) return res.json({ success: false, msg: "Invalid Credential" });
                user.verifyPassword(password, (err, matched) => {
                    if (err) return next(err);
                    if (!matched)
                        return res.status(401).json({ success: false, msg: "Unauthorized" });
                    jwt.sign(
                        {
                            userId: user._id,
                            username: user.username,
                            email: user.email,
                            isadmin: user.isAdmin
                        },
                        process.env.SECRET,
                        (err, token) => {
                            if (err) return next(err);
                            res.json({ success: true, msg: "You Are Logged In", id: user._id, token });
                        }
                    );
                });
            });
        } catch (err) {
            next(err);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body)
            if (!user) return (
                res
                    .status(400)
                    .json({ success: false, msg: "User Not Found" })
            )
            res.json({ success: true, msg: "Profile Is Updated" });
            
        } catch (err) {
            next(err);
        }
    },

    aboutUser: async (req, res, next) => {
        try {
            const user = await User.findById(req.user.userId, "-password");
            if (!user) return res.status(400).json({ success: false, msg: "User Not Found" });
            res.json({ success: true, user });
        } catch (err) {
            next(err)
        }
    }
}