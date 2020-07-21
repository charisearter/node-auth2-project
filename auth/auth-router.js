const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken"); 
const router = require("express").Router();
const Users = require("../users/users-model.js");
const { isValid } = require("../users/users-service.js");

router.post("/register", (req, res) => {
    const credentials = req.body;

    if (isValid(credentials)) {
        const rounds = process.env.BCRYPT_ROUNDS || 8;
        const hash = bcryptjs.hashSync(credentials.password, rounds);

        credentials.password = hash;

        Users.add(credentials)
            .then(user => {
                const token = makeJwt(user);

                res.status(201).json({ data: user, token });
            })
            .catch(error => {
                res.status(500).json({ message: error.message });
            });
    } else {
        res.status(400).json({
            message: "provide a username and password",
        });
    }
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (isValid(req.body)) {
        Users.findBy({ username: username })
            .then(([user]) => {
                console.log("user", user);
                if (user && bcryptjs.compareSync(password, user.password)) {
                    const token = makeJwt(user);

                    res.status(200).json({ message: "This is the API", token });
                } else {
                    res.status(401).json({ message: "Your credentials are invalid." });
                }
            })
            .catch(error => {
                res.status(500).json({ message: error.message });
            });
    } else {
        res.status(400).json({
            message: "please provide username and password.",
        });
    }
});

function makeJwt(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        role: user.role,
    };

    const secret = process.env.JWT_SECRET || "keep it a secret";

    const options = {
        expiresIn: "1h",
    };

    return jwt.sign(payload, secret, options);
}

module.exports = router;
