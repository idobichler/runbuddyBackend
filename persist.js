
const fs = require('fs')
const {AsyncNedb} = require('nedb-async')
const bcrypt = require("bcrypt");
const USERS_DB_PATH = './DB/users.db';
const ACTIVITIES_DB_PATH = './DB/activities.db';
const NOTIFICATION_DB_PATH = './DB/notification.db';

let usersDB;
let activitiesDB;
let notificationDB;

async function initDB() {
    let checkIfExistsUsers;

    try {
        checkIfExistsUsers = fs.existsSync(USERS_DB_PATH);
    } catch (err) {
        console.error(err)
    }

    usersDB = new AsyncNedb({filename: USERS_DB_PATH, autoload: true});
    activitiesDB = new AsyncNedb({filename: ACTIVITIES_DB_PATH, autoload: true});
    notificationDB = new AsyncNedb({filename: NOTIFICATION_DB_PATH, autoload: true});


    if (!checkIfExistsUsers) {
        await addNewUser({username:'admin', password: 'admin', radius: null, latitude: null, longitude: null});
    }
    return true;
}


async function addNewUser(user){
    const exists = await findUser(user.username);
    if (!exists){
        const hashedPassword = await bcrypt.hash(user.password, 10);
        let newUser = {
            username: user.username,
            password: hashedPassword,
            radius: null,
            latitude: null,
            longitude: null
        };

        return await usersDB.asyncInsert(newUser);
    }
    else{
        return false;
    }
}

async function setRadius(username, radius, latitude, longitude){
    let user = await findUser(username);

    if (user){
        await usersDB.asyncUpdate(
            { username: username},
            { $set: { radius: radius, latitude: latitude, longitude: longitude} },
            {}
        );
    }
    else{
        console.log("Error user not exists");
    }
}

async function findUser(username) {
    return await usersDB.asyncFindOne({username: username});
}

async function getAllUsersExceptThis(username){
    // console.log(users);
    return await usersDB.asyncFind({username: {$ne: username}});
}

async function addActivity(username, distance, time){
    let now = new Date().getTime()/1000;
    if(new Date(time).getTime() > now ){
        let activity = {
            starterUser: username,
            distance: distance,
            time: time
        }

        return await activitiesDB.asyncInsert(activity);
    }
    else{
        throw new Error("Date is in the past");
    }
}

async function addNotification(username,distance){
    let notify = {
        notifierUser: username,
        distance: distance
    }

    return await activitiesDB.asyncInsert(notify);
}

async function getActivities(username){
    if (username){
        return await activitiesDB.asyncFind({starterUser: username});
    }
    else{
        return await activitiesDB.asyncFind({});
    }
}

async function removeActivity(id){
    return await activitiesDB.asyncRemove({_id: id});
}


initDB().then(res => {
    if (res) console.log('DB`s initialized successfully.')
});


module.exports = {addNewUser,findUser, setRadius, getAllUsersExceptThis, addActivity, removeActivity, getActivities, addNotification};