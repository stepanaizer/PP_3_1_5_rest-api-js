$(async function () {
    await getTableWithUsers();
    await getAuthenticatedUserTable();
    getDefaultModal();
    addNewUser();
})


const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllRoles: async () => await fetch('api/roles'),
    findAllUsers: async () => await fetch('api/users'),
    findAuthUser: async () => await fetch('api/user'),
    findOneUser: async (id) => await fetch(`api/${id}`),
    addNewUser: async (user) => await fetch('api/new', {method: 'POST', headers: userFetchService.head, body: JSON.stringify(user)}),
    updateUser: async (user, id) => await fetch(`api/${id}/edit`, {method: 'PUT', headers: userFetchService.head, body: JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`api/${id}/delete`, {method: 'DELETE', headers: userFetchService.head})
}
   

async function getTableWithUsers() {
    let table = $('#usersTable tbody');
    table.empty();

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                const userRoles = user.roles.map((role) => role.roleName).join(" ")
                    .replace(/ROLE_/g, "");
                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>
                            <td>${user.email}</td>
                            <td>${userRoles}</td>     
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info" 
                                data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger" 
                                data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    // обрабатываем нажатие на любую из кнопок edit или delete
    // достаем из нее данные и отдаем модалке, которую к тому же открываем
    $("#usersTable").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

async function getAuthenticatedUserTable() {
    let table = $('#authTable tbody');
    table.empty();

    await userFetchService.findAuthUser()
    .then(res => res.json())
    .then(user => {
            const userRoles = user.roles.map((role) => role.roleName).join(" ")
                .replace(/ROLE_/g, "");
            let tableFilling = `$(
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${userRoles}</td>     
                    </tr>
            )`;
            table.append(tableFilling);
        })
    }


// что то деалем при открытии модалки и при закрытии
// основываясь на ее дата атрибутах
async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", async (event) => {
        let thisModal = $(event.target);    

        let roles = await userFetchService.findAllRoles().then((res) => res.json());
        
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid, roles);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}


// редактируем юзера из модалки редактирования, забираем данные, отправляем
async function editUser(modal, id, roles) {
    let userToJson = await userFetchService.findOneUser(id);
    let user = userToJson.json();

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  class="btn btn-info" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group" id="editUser">
                <div class="mb-3">
                    <label for="id" class="col-form-label">ID:</label>
                    <input id="id" name="id" type="text" class="form-control" value="${user.id}" readonly>
                </div>
                <div class="mb-3">
                    <label for="firstName" class="col-form-label">First name:</label>
                    <input id="firstName" name="firstName" type="text" class="form-control" value="${user.firstName}">
                </div>
                <div class="mb-3">
                    <label for="lastName" class="col-form-label">Last name:</label>
                    <input id="lastName" name="lastName" type="text" class="form-control" value="${user.lastName}">
                </div>
                <div class="mb-3">
                    <label for="age" class="col-form-label">Age:</label>
                    <input id="age" name="age" type="number" class="form-control" value="${user.age}">
                </div>
                <div class="mb-3">
                    <label for="email" class="col-form-label">Email:</label>
                    <input id="email" name="email" type="email" class="form-control" value="${user.email}">
                </div>      
                <div class="mb-3">
                    <label for="password" class="col-form-label">Password:</label>
                    <input id="password" name="password" type="password" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="selectRoles" class="col-form-label">Roles:</label>
                    <select id="selectRoles" name="roles" class="form-select" multiple>
                        
                    </select>
                </div>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
        
    
        $.each(roles, function(i, item) {   
            roleName = item.roleName.replace(/ROLE_/g, "");
            $('#selectRoles').append($('<option>', { 
                value: item.id,
                text : roleName
            }));
        });
        

    })

    $("#editButton").on('click', async () => {
        let id = modal.find('input[name="id"]').val().trim();
        let firstName = modal.find('input[name="firstName"]').val().trim();
        let lastName = modal.find('input[name="lastName"]').val().trim();
        let age = modal.find('input[name="age"]').val().trim();
        let email = modal.find('input[name="email"]').val().trim();
        let password = modal.find('input[name="password"]').val().trim();
        let selectedValues = $('#selectRoles').val();
                    
        let data = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: getSelectedRoles(selectedValues,roles)
        }

        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="someError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

function getSelectedRoles(selectedValues, roles){
    let rolesSelected = [];
    
    roles.forEach(role => {
        for(const value of selectedValues){
            if(value === role.id.toString()) {
                rolesSelected.push(role);
            }
        }
    })
    return rolesSelected;
}




async function deleteUser(modal, id) {
    let userToJson = await userFetchService.findOneUser(id);
    let user = userToJson.json();

    modal.find('.modal-title').html('Delete user');

    let editButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group" id="deleteUser">
                <div class="mb-3">
                    <label for="id" class="col-form-label">ID:</label>
                    <input id="id" name="id" type="text" class="form-control" value="${user.id}" readonly>
                </div>
                <div class="mb-3">
                    <label for="firstName" class="col-form-label">First name:</label>
                    <input id="firstName" name="firstName" type="text" class="form-control" value="${user.firstName}" readonly>
                </div>
                <div class="mb-3">
                    <label for="lastName" class="col-form-label">Last name:</label>
                    <input id="lastName" name="lastName" type="text" class="form-control" value="${user.lastName}" readonly>
                </div>
                <div class="mb-3">
                    <label for="age" class="col-form-label">Age:</label>
                    <input id="age" name="age" type="number" class="form-control" value="${user.age}" readonly>
                </div>
                <div class="mb-3">
                    <label for="email" class="col-form-label">Email:</label>
                    <input id="email" name="email" type="email" class="form-control" value="${user.email}" readonly>
                </div>      
                <div class="mb-3">
                    <label for="password" class="col-form-label">Password:</label>
                    <input id="password" name="password" type="password" class="form-control" readonly>
                </div>
                <div class="mb-3">
                    <label for="roles" class="col-form-label">Roles:</label>
                    <select id="roles" name="roles" class="form-select">
                        <option>
                                    
                        </option>
                    </select>
                </div>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#deleteButton").on('click', async () => {
        await userFetchService.deleteUser(id);
        getTableWithUsers();
        modal.modal('hide');
    })
}



async function addNewUser() {
    $('#newUserBtn').click( async (event) => {
        event.preventDefault();

        let addUserForm = $('#newUserForm');
        let firstName = addUserForm.find('#firstName').val().trim();
        let lastName = addUserForm.find('#lastName').val().trim();
        let age = addUserForm.find('#age').val().trim();
        let email = addUserForm.find('#setEmail').val().trim();
        let password = addUserForm.find('#setPassword').val().trim();
        
        let data = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: [
                {
                    id: 2,
                    roleName: "ROLE_USER",
                    authority: "ROLE_USER"
                }
            ]
        }
        
        const response = await userFetchService.addNewUser(data);
        
        if (response.ok) {
            getTableWithUsers();

            $('#myTab a[href="#home"]').tab('show');
            addUserForm.find("#firstName").val('');
            addUserForm.find("#lastName").val('');
            addUserForm.find("#age").val('');
            addUserForm.find("#email").val('');
            addUserForm.find("#setPassword").val('');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="someError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert)
        }
    })
}