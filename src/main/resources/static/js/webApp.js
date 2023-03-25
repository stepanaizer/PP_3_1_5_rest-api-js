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
                                <button type="button" id="editBtn" data-userid="${user.id}" data-action="edit" class="btn btn-info" 
                                data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger" 
                                data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    $("#editBtn").on('click', (event) => {
        let editModal = $('#editModal');
        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        editModal.attr('data-userid', buttonUserId);
        editModal.attr('data-action', buttonAction);
        editModal.modal('show');
    })

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

async function editUser(modal, id) {
    let foundUser = await userFetchService.findOneUser(id);
    let foundRoles = await userFetchService.findAllRoles();
    let user = foundUser.json();
    let roles = foundRoles.json();

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  class="btn btn-info" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group" id="editUser">
                <input type="text" class="form-control" id="id" name="id" value="${user.id}" disabled><br>
                <input class="form-control" type="text" id="firstName" value="${user.firstName}"><br>
                <input class="form-control" type="text" id="lastName" value="${user.lastName}"><br>
                <input class="form-control" type="text" id="age" value="${user.age}"><br>
                <input class="form-control" type="email" id="email" value="${user.email}"><br>
                <input class="form-control" type="password" id="password"><br>
                <select class="form-select" id="roles" multiple"><option>
                
                </option></select>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val().trim();
        let firstName = modal.find("#firstName").val().trim();
        let lastName = modal.find("#lastName").val().trim();
        let age = modal.find("#age").val().trim();
        let email = modal.find("#email").val().trim();
        let password = modal.find("#password").val().trim();
        let roles = modal.find("#roles").val().trim();
        let data = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles : roles
            
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