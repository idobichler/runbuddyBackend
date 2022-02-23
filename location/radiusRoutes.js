const express = require('express');
const router = express.Router();
router.use(express.json());

const persist = require('../persist');
const activities = require('./activities');

router.post('/set_radius',async (req,res)=>{
    try {
        let radius = req.body.radius;
        let longitude = req.body.longitude;
        let latitude = req.body.latitude;
        await persist.setRadius(req.session.user.username, radius, latitude, longitude);

        await activities.getActivitiesForUser(req.session.user.username);
        res.sendStatus(200);
    }
    catch (error){
        res.sendStatus(500);
    }
});

router.post('/add_activity',async (req,res)=>{
    let distance = req.body.distance;
    let time = req.body.time;
    try{
        await persist.addActivity(req.session.user.username, distance, time);
        await persist.addNotification(req.session.user.username, distance);
        res.sendStatus(200);
    }
    catch (error){
        res.sendStatus(500);
    }
});

router.get('/get_activities', async (req,res) => {
    try{
        let act = await activities.getActivitiesForUser(req.session.user.username);
        res.send(act);
    }
    catch (error){
        res.sendStatus(500);
    }

});



module.exports = router;
