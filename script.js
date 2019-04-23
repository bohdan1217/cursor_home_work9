const API = 'https://test-users-api.herokuapp.com/';
let users = [];


const preloader = () => {
    document.getElementById('loading').style.display = 'block';
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 200);
}


const getUsers = () => {
    return fetch(API + 'users').then(res => {
        return res.json();
    }).then(user => {
        return user.data;
    }).catch(err => {
        console.log('couldnt get users', err);
        return [];
    })
};

const deleteUser = async (userId, userElement) => {
    try {
        await fetch (API + "users/"+userId, {
            method:"DELETE"
        });
        users = users.filter((user)=>user.id !== userId);
        preloader();
        userElement.remove();
    }
    catch (err) {
        console.log ("Failed to delete user:", err)
    }
}

const renderUsers = () => {
        const container = document.querySelector('.users-list');
        container.innerHTML = '';
        users.forEach(user => {
        const userElement = document.createElement('div');
                userElement.classList.add('user-list');
                userElement.innerHTML = `
                    <input class="form-control class-name-${user.id}" type="text" value="${user.name}" required="">
                    <input class="form-control class-age-${user.id}" type="number" value="${user.age}" required="">
                `;

            //remove button
            const removeBtn = document.createElement('button');
            removeBtn.classList.add('table-link');
            removeBtn.classList.add('delete-button');
            removeBtn.textContent = 'X';
            removeBtn.addEventListener('click', () => {
                deleteUser(user.id, userElement)
            });

            //save changes
            const saveChangesBtn = document.createElement("button");
            saveChangesBtn.classList.add("table-link");
            saveChangesBtn.classList.add("save-button");
            saveChangesBtn.textContent = "Save";
            saveChangesBtn.addEventListener("click", () => saveChanges(user.id));

            //add in div
            userElement.append(saveChangesBtn);
            userElement.append(removeBtn);
            container.append(userElement);
        });
}

const loadUsers = async () => {
    users = await getUsers();
    renderUsers();
    preloader();
}

const saveChanges = (updateUserId) => {
    this.newNameUser = document.querySelector(".class-name-"+updateUserId).value;
    this.newAgeUser = document.querySelector (".class-age-"+updateUserId).value;

        if ((this.newNameUser.length === 0) || (this.newAgeUser.length === 0)) {
            return;
        }
        preloader();
        fetch(API + "users/" + updateUserId, {
            method: "PUT",
            body: JSON.stringify({
                name: this.newNameUser,
                age: this.newAgeUser
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => res)
}


const createUser = () => {
    const name = document.querySelector('.name').value;
    const age = document.querySelector('.age').value;

    if ((name.length === 0) || (age.length === 0)) {
        return;
    }
    preloader();
    fetch(API + 'users/', {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            age: age
        }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(res => {
        return res.json();
    }).then(({id}) => {
        const user = {
            name,
            age,
            id
        };
        users.unshift(user);
        renderUsers();

        document.querySelector('.name').value = '';
        document.querySelector('.age').value = '';
    })
    .catch(err => {
        console.log('Failed to create a user', err);
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const loadBtn = document.querySelector('.load-users');
    loadBtn.addEventListener('click', loadUsers);

    const createUserBtn = document.querySelector('.create-user-btn');
    createUserBtn.addEventListener('click', createUser);
});