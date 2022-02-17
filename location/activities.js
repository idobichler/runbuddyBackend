const persist = require('../persist');

async function getActivitiesForUser(username){
    let user = await persist.findUser(username);
    let otherUsers = await persist.getAllUsersExceptThis(username);
    let activities = [];

    for(let i=0; i<otherUsers.length; i++){
        let distance = getDistanceFromLatLonInKm(user.latitude, user.longitude, otherUsers[i].latitude, otherUsers[i].longitude);
        let radiusSum = user.radius + otherUsers[i].radius;
        if(radiusSum > distance){
            let userActivities = await persist.getActivities(otherUsers[i].username);
            activities = activities.concat(userActivities);
        }
    }
    return activities;
}

async function clearPassedActivities(){
    let now = new Date().getTime()/1000;
    let userActivities = await persist.getActivities(null);
    for (let i=0; i<userActivities.length; i++){
        if (now > new Date(userActivities[i].time).getTime()) {
            await persist.removeActivity(userActivities[i]._id);
        }
    }
}


function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);  // deg2rad below
    let dLon = deg2rad(lon2-lon1);
    let a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

module.exports = {getActivitiesForUser,clearPassedActivities};