const fs = require('fs')
const {AsyncNedb} = require('nedb-async')
const bcrypt = require("bcrypt");
const USERS_DB_PATH = './DB/users.db';
let usersDB;

async function initDB() {
    let checkIfExistsUsers;

    try {
        checkIfExistsUsers = fs.existsSync(USERS_DB_PATH);
    } catch (err) {
        console.error(err)
    }

    usersDB = new AsyncNedb({filename: USERS_DB_PATH, autoload: true});

    if (!checkIfExistsUsers) {
        await addNewUser({username:'admin', password: 'admin'});
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
        };

        return await usersDB.asyncInsert(newUser);
    }
    else{
        return false;
    }
}

async function findUser(username) {
    return await usersDB.asyncFindOne({username: username});
}

initDB().then(res => {
    if (res) console.log('DB`s initialized successfully.')
});

module.exports = {addNewUser,findUser};