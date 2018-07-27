var contactsList = document.getElementById('contacts');
var firstNameNode = document.getElementById('firstName');
var surnameNode = document.getElementById('surname');
var phoneNode = document.getElementById('phoneNumber');
var emailNode = document.getElementById('emailAddress');

syncContacts();

function getContacts() {
    return fetch (
        'http://localhost:3000/contacts'
    ).then(
        function (response) {
            return response.json()
        }
    )
}

function syncContacts() {
    getContacts().then(displayContacts)
}

function displayContacts(contacts) {
    contactsList.innerHTML = '';
    contacts.sort(sortContacts);
    contacts.forEach(function(contact){
        createContactCard(contact)
    })
}

function createContactCard(contact) {
    var contactNode = document.createElement('li');
    var name = document.createElement('li');
    var phoneNumber = document.createElement('p');
    var email = document.createElement('p');
    var contactCheckbox = document.createElement('input');
    contactCheckbox.type = 'checkbox';
    contactCheckbox.classList.add('contacts-checkbox');
    contactCheckbox.id = contact.id;
    fillCardWithData(contact, name, phoneNumber, email);
    contactNode.append(name);
    contactNode.append(phoneNumber);
    contactNode.append(email);
    contactNode.append(contactCheckbox);
    contactsList.append(contactNode);
}

function fillCardWithData(contact, name, phone, mail) {
    name.innerHTML = contact.firstName + ' ' + contact.surname;
    phone.innerHTML = contact.phoneNumber;
    mail.innerHTML = contact.email;
}

function sortContacts(contactA, contactB) {
    if (contactA.surname < contactB.surname) {
        return -1;
    } else if (contactA.surname> contactB.surname) {
        return 1;
    }
    return 0;
}