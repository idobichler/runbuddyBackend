const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
router.use(express.json());

const persist = require('../persist');


router.post("/register", async (req, res) => {

});

router.post('/login', async (req,res)=>{

});


router.get('/logout', (req, res) => {});

router.get("/connected", (req, res) => {
    if (req.session.user) {
        res.send({connected: true, username: req.session.user.username});
    } else {
        res.send({connected: false, username: null});
    }
})



module.exports = router;
