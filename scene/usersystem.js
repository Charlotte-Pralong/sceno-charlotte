import useFirebase from '/libs/firebase.js'
import config from '/firebaseconfig.js'
import { ref, getDatabase, onValue } from 'firebase/database'

const firebase = useFirebase(config)

const list = [];

const api = {
    list,
    onNew: (user) => { },
    
    onRemove: (user) => { },
}

firebase.onLogin = async (id, user) => {
    console.log('logged in', id);

    const users = ref(getDatabase(), 'users');

    let currUsers = {};

    onValue(users, (snapshot) => {
        const updatedUsers = snapshot.val();
        const { added, removed } = checkChanges(updatedUsers, currUsers);

        currUsers = updatedUsers;

        Object.keys(added).forEach((id) => {
            const newEntry = { id, fireData: updatedUsers[id], userData: {} };
            list.push(newEntry);
            api.onNew(newEntry);
        });

        Object.keys(removed).forEach((id) => {
            const removedIndex = list.findIndex((user) => user.id === id);
            if (removedIndex === -1) return;
            const removedUser = list[removedIndex];
            api.onRemove(removedUser);
            list.splice(removedIndex, 1);
        });

        // update entries
        list.forEach((user) => {
            const dataEntry = updatedUsers[user.id];
            if (dataEntry === undefined) return;
            user.fireData = dataEntry;
        });
    });
};

function checkChanges(value, oldValue) {
    const added = {};
    const removed = {};
    const updated = {};

    for (const key in value) {
        if (oldValue[key] === undefined) {
            added[key] = value[key];
        }
        // else if (oldValue[key] !== value[key]) {
        //     // updated[key] = value[key];
        // }
    }

    for (const key in oldValue) {
        if (value[key] === undefined) {
            removed[key] = oldValue[key];
        }
    }

    return { added, removed };
}

export default api;