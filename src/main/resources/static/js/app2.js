$(async function () {
    await getTableWithUsers();
    getNewUserForm();
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
                                data-toggle="modal" data-target="#someDefaultModal"></button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger" 
                                data-toggle="modal" data-target="#someDefaultModal"></button>
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


async function getNewUserForm() {
    let button = $(`#SliderNewUserForm`);
    let form = $(`#defaultSomeForm`)
    button.on('click', () => {
        if (form.attr("data-hidden") === "true") {
            form.attr('data-hidden', 'false');
            form.show();
            button.text('Hide panel');
        } else {
            form.attr('data-hidden', 'true');
            form.hide();
            button.text('Show panel');
        }
    })
}


// что то деалем при открытии модалки и при закрытии
// основываясь на ее дата атрибутах
async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
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
async function editUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  class="btn btn-outline-success" id="editButton">Edit</button>`;
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

    $("#editButton").on('click', async () => {
        let id = modal.find('input[name="id"]').val().trim();
        let firstName = modal.find('input[name="firstName"]').val().trim();
        let lastName = modal.find('input[name="lastName"]').val().trim();
        let age = modal.find('input[name="age"]').val().trim();
        let email = modal.find('input[name="email"]').val().trim();
        let password = modal.find('input[name="password"]').val().trim();
        
        let data = {
            id: id,
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
        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}


// удаляем юзера из модалки удаления
async function deleteUser(modal, id) {
    await userFetchService.deleteUser(id);
    getTableWithUsers();
    modal.find('.modal-title').html('');
    modal.find('.modal-body').html('User was deleted');
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(closeButton);
}






async function addNewUser() {
    $('#addNewUserButton').click(async () =>  {
        let addUserForm = $('#defaultSomeForm')
        let login = addUserForm.find('#AddNewUserLogin').val().trim();
        let password = addUserForm.find('#AddNewUserPassword').val().trim();
        let age = addUserForm.find('#AddNewUserAge').val().trim();
        let data = {
            login: login,
            password: password,
            age: age
        }
        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
            getTableWithUsers();
            addUserForm.find('#AddNewUserLogin').val('');
            addUserForm.find('#AddNewUserPassword').val('');
            addUserForm.find('#AddNewUserAge').val('');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert)
        }
    })
}