const router = require("express").Router();

const Users = require("./users-model.js");

router.get("/", (req, res) => {
    Users.find()
        .then(users => {
            res.status(200).json({ data: users, jwt: req.jwt });
        })
        .catch(err => res.send(err));
});

module.exports = router;
