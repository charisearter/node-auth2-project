const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    //
    const token = req.headers.authorization
    const secret = process.env.JWT_SECRET || "keep it a secret";
    console.log(token)
    if (token) {
        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) {
                console.log(err),
                res.status(401).json({ you: "still No" });
            } else {
                req.jwt = decodedToken;
                next();
            }
        });
    } else {
        res.status(401).json({ you: "NOPE!" });
    }
};
