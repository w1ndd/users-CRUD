const tableBody = document.querySelector('#table-body')
const table = document.querySelector('main-table')
const searchInput = document.querySelector('#search-input')
const popup = document.getElementById("popup");
const addButton = document.getElementById("add-button");
const span = document.getElementsByClassName("close")[0];

var selectedId = null;
var users = []

fetch('https://jsonplaceholder.typicode.com/users')
.then(res => res.json())
.then(data => {
    users = data.map(user => {
        const markup = 
        `<tr id="${user.id}">
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.address.street}</td>
            <td>${user.phone}</td>
            <td>${user.website}</td>
            <td>${user.company.name}</td>
            <td> <button class="delete-button" onclick="deleteUserById(${user.id})"> Delete </button> </td>
            <td> <button class="edit-button" onclick="editUserById(${user.id})"> Edit </button> </td>
        </tr>`
        tableBody.insertAdjacentHTML('beforeend', markup)
        return {...user, street: user.address.street, companyName: user.company.name};
    });
})
.catch(e => console.log(e))

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase()
    users.forEach(user => {
        const isVisible = user.name.toLowerCase().includes(value)
        document.getElementById(user.id).classList.toggle("hide", !isVisible)
    })
})

addButton.onclick = function() {
    popup.style.display = "block";
    popup.querySelector("h2").innerHTML = "Add a user"
}
  
span.onclick = function() {
    popup.style.display = "none";
    resetForm()
}

window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none";
        resetForm()
    }
}

function deleteUserById(id){
    const userIndexInArray = users.findIndex(user => user.id === id)
    users = users.filter(user => user.id !== id)
    tableBody.deleteRow(userIndexInArray)
}

function editUserById(id){
    selectedId = id;
    userToEdit = findUserById(id)

    setFormData(userToEdit)

    popup.querySelector("h2").innerHTML = "Edit a user"
    popup.style.display = "block";
}

function onFormSubmit(e) {
	event.preventDefault();
        var formData = readFormData();
        if (selectedId == null){
            appendTable(formData);
		}
        else{
            updateTableRow(formData);
		}
        resetForm();  
        popup.style.display = "none";  
}

function appendTable(data) {
    let lastId;
    if(users.length > 0){
        lastId = users[users.length - 1]?.id
    } else {
        lastId = 0
    }

    const markup = 
        `<tr id="${lastId + 1}">
            <td>${data.name}</td>
            <td>${data.username}</td>
            <td>${data.email}</td>
            <td>${data.street}</td>
            <td>${data.phone}</td>
            <td>${data.website}</td>
            <td>${data.companyName}</td>
            <td> <button class="delete-button" onclick="deleteUserById(${lastId + 1})"> Delete </button> </td>
            <td> <button class="edit-button" onclick="editUserById(${lastId + 1})"> Edit </button> </td>
        </tr>`
    tableBody.insertAdjacentHTML('beforeend', markup)
    users.push({id: lastId + 1, ...data})  
}

function readFormData() {
    var formData = {};
    formData["name"] = document.getElementById("name").value;
    formData["username"] = document.getElementById("username").value;
    formData["email"] = document.getElementById("email").value;
    formData["street"] = document.getElementById("street").value;
    formData["phone"] = document.getElementById("phone").value;
    formData["website"] = document.getElementById("website").value;
    formData["companyName"] = document.getElementById("companyName").value;
    return formData;
}

function resetForm() {
    document.getElementById("name").value = '';
    document.getElementById("username").value = '';
    document.getElementById("email").value = '';
    document.getElementById("street").value = '';
    document.getElementById("phone").value = '';
    document.getElementById("website").value = '';
    document.getElementById("companyName").value = '';
    selectedId = null;
}

function setFormData(user){
    document.getElementById("name").value = user.name;
    document.getElementById("username").value = user.username;
    document.getElementById("email").value = user.email;
    document.getElementById("street").value = user.street;
    document.getElementById("phone").value = user.phone;
    document.getElementById("website").value = user.website;
    document.getElementById("companyName").value = user.companyName;
}

function updateTableRow(formData){
    let index = findUserIndexInArrayOfUsersById(selectedId)
    let tableRowToUpdate = tableBody.rows[index].cells

    let arr = [...tableRowToUpdate]

    //remove buttons from an array
    arr.pop()
    arr.pop()

    arr[0].innerHTML = formData.name
    arr[1].innerHTML = formData.username
    arr[2].innerHTML = formData.email
    arr[3].innerHTML = formData.street
    arr[4].innerHTML = formData.phone
    arr[5].innerHTML = formData.website
    arr[6].innerHTML = formData.companyName

    updateUsersArray(formData)
}

function updateUsersArray(formData){
    let userToUpdateIndexInArray = findUserIndexInArrayOfUsersById(selectedId)
    users[userToUpdateIndexInArray] = {id: users[userToUpdateIndexInArray].id, ...formData}
}

function findUserById(id){
    return users.find(user => user.id === id)
}

function findUserIndexInArrayOfUsersById(id){
    return users.findIndex(user => user.id === id)
}
