const express = require('express');
const router = express.Router();
router.use(express.json());

const persist = require('../persist');

router.post('/set_radius',async (req,res)=>{
    try {
        let radius = req.body.radius;
        let longitude = req.body.longitude;
        let latitude = req.body.latitude;
        await persist.setRadius(req.session.user.username, radius, latitude, longitude);
        console.log("OK");
        res.sendStatus(200);
    }
    catch (error){
        res.sendStatus(500);
    }
});

module.exports = router;
