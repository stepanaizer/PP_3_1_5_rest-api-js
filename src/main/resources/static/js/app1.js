
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

const editModal = new bootstrap.Modal(document.getElementById('editModal'));
const myEditForm = document.getElementById('editUserForm');
// const idEdit = document.getElementById('idEdit');
// const firstNameEdit = document.getElementById('firstNameEdit');
// const lastNameEdit = document.getElementById('lastNameEdit');
// const ageEdit = document.getElementById('ageEdit');
// const emailEdit = document.getElementById('emailEdit');
// const passwordEdit = document.getElementById('passwordEdit');
// сделать роли

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
                                <button type="button" id="editTestBtn" data-userid="${user.id}" data-action="edit" class="btn btn-info" 
                                data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger" 
                                data-bs-toggle="modal" data-bs-target="#someDefaultModal">Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })
    
        $("#editTestBtn").on('click', (event) => {
            let editModal = $('#editModal');
            let targetButton = $(event.target);
            let buttonUserId = targetButton.attr('data-userid');
            let buttonAction = targetButton.attr('data-action');
    
            editModal.attr('data-userid', buttonUserId);
            editModal.attr('data-action', buttonAction);
            editModal.modal('show');
        })
}

// const on = (element, event, selector, handler) => {
//     //console.log(element)
//     //console.log(event)
//     //console.log(selector)
//     //console.log(handler)
//     element.addEventListener(event, e => {
//         if(e.target.closest(selector)){
//             handler(e)
//         }
//     })
// }

// let idForm = 0
// on(document, 'click', '.editTestBtn', e => {    
//     const fields = e.target.parentNode.parentNode
//     idForm = fields.children[0].innerHTML
//     const firstNameForm = fields.children[1].innerHTML
//     const lastNameForm = fields.children[2].innerHTML
//     const ageForm = fields.children[4].innerHTML
//     const emailForm = fields.children[5].innerHTML
//     const passwordForm = fields.children[6].innerHTML

//     firstNameEdit.value =  firstNameForm
//     lastNameEdit.value =  lastNameForm
//     ageEdit.value =  ageForm
//     emailEdit.value =  emailForm
//     passwordEdit.value =  passwordForm

//     editModal.show()
     
// })


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
async function getEditModal() {
    $('#editModal').modal()
    .on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        editUser(thisModal, userid);
        editModal.hide();
    })
}

// async function getDefaultModal() {
//     $('#someDefaultModal').modal({
//         keyboard: true,
//         backdrop: "static",
//         show: false
//     }).on("show.bs.modal", (event) => {
//         let thisModal = $(event.target);
//         let userid = thisModal.attr('data-userid');
//         let action = thisModal.attr('data-action');
//         switch (action) {
//             case 'edit':
//                 editUser(thisModal, userid);
//                 break;
//             case 'delete':
//                 deleteUser(thisModal, userid);
//                 break;
//         }
//     }).on("hidden.bs.modal", (e) => {
//         let thisModal = $(e.target);
//         thisModal.find('.modal-title').html('');
//         thisModal.find('.modal-body').html('');
//         thisModal.find('.modal-footer').html('');
//     })
// }


// редактируем юзера из модалки редактирования, забираем данные, отправляем
async function editUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();

    user.then(user => {
        let bodyForm = `
            <div class="modal-body">
                <div class="mb-3">
                    <label for="idEdit" class="col-form-label">ID:</label>
                    <input id="idEdit" type="text" class="form-control" value="${user.id}" readonly>
                </div>
                <div class="mb-3">
                    <label for="firstNameEdit" class="col-form-label">First name:</label>
                    <input id="firstNameEdit" type="text" class="form-control" value="${user.firstName}">
                </div>
                <div class="mb-3">
                    <label for="lastNameEdit" class="col-form-label">Last name:</label>
                    <input id="lastNameEdit" type="text" class="form-control" value="${user.lastName}">
                </div>
                <div class="mb-3">
                    <label for="ageEdit" class="col-form-label">Age:</label>
                    <input id="ageEdit" type="number" class="form-control" value="${user.age}">
                </div>
                <div class="mb-3">
                    <label for="emailEdit" class="col-form-label">Email:</label>
                    <input id="emailEdit" type="email" class="form-control" value="${user.email}">
                </div>      
                <div class="mb-3">
                    <label for="passwordEdit" class="col-form-label">Password:</label>
                    <input id="passwordEdit" type="password" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="rolesEdit" class="col-form-label">Roles:</label>
                    <select id="rolesEdit" class="form-select">
                        <option>
                                            
                        </option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary">Edit</button>
            </div>`;

        modal.find('.form-group').append(bodyForm);
    })

    $("#editUserForm").on('submit', async () => {
        let id = modal.find("#idEdit").val().trim();
        let firstName = modal.find("#firstnameEdit").val().trim();
        let lastName = modal.find("#lastNameEdit").val().trim();
        let age = modal.find("#ageEdit").val().trim();
        let email = modal.find("#emailEdit").val().trim();
        let password = modal.find("#passwordEdit").val().trim();
        
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