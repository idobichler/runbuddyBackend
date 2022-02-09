const express = require('express');
const router = express.Router();
router.use(express.json());

const persist = require('../persist');
const bcrypt = require("bcrypt");


router.post("/register", async (req, res) => {
    let user = {
        username: req.body.username,
        password: req.body.password
    };
    console.log(user);
    await persist.addNewUser(user).then((result) => {
        if (result) {
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }

    });
});

router.post('/login', async (req,res)=>{
    let user = req.body.username;
    let pass = req.body.password;
    res.setHeader('Access-Control-Allow-Credentials', 'true')

    try {
        let check_user = await persist.findUser(user);
        if (check_user !== null){
            const validPassword = await bcrypt.compare(pass, check_user.password);
            if (validPassword) {
                req.session.user = {
                    username: user,
                    password: pass
                };
                res.send({result: true});
            } else {
                res.send({result: false, reason: "UP"});
            }
        }
        else {
            res.send({result: false, reason: "U"});
        }
    } catch (error) {
        console.error(error);
    }
});


router.get('/logout', (req, res) => {
    if (req.session.user) {
        let username = req.session.user.username;

        req.session.destroy(error => {
            if (error) {
                res.sendStatus(500).json({message: 'Error trying to logout'})
            } else {
                res.sendStatus(200)
            }
        });
    } else {
        res.sendStatus(200);
    }
});




module.exports = router;
