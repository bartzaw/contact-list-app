var contactsList = document.getElementById('contacts');
var firstNameNode = document.getElementById('firstName');
var surnameNode = document.getElementById('surname');
var phoneNode = document.getElementById('phoneNumber');
var emailNode = document.getElementById('emailAddress');
var addContactButton = document.getElementById('contacts-addButton');
var removeSelectedButton = document.getElementById('contacts-removeButton__selected');

syncContacts();

addContactButton.addEventListener('click', validateContactData);

removeSelectedButton.addEventListener('click', function() {
    var selectedContacts = document.querySelectorAll('.contacts-checkbox:checked');
    selectedContacts.forEach(function (selectedItem) {
        var contactId = selectedItem.getAttribute('id');
        removeContact(contactId)
    })
});

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
    var deleteSingle = document.createElement('div');
    var contactCheckbox = document.createElement('input');
    contactCheckbox.type = 'checkbox';
    contactCheckbox.classList.add('contacts-checkbox');
    contactCheckbox.id = contact.id;
    fillCardWithData(contact, name, phoneNumber, email);
    addDeleteButtonToCard(deleteSingle, contact);
    contactNode.append(name);
    contactNode.append(phoneNumber);
    contactNode.append(email);
    contactNode.append(contactCheckbox);
    contactNode.append(deleteSingle);
    contactsList.append(contactNode);
}

function fillCardWithData(contact, name, phone, mail) {
    name.innerHTML = contact.firstName + ' ' + contact.lastName;
    phone.innerHTML = contact.phoneNumber;
    mail.innerHTML = contact.email;
}

function sortContacts(contactA, contactB) {
    if (contactA.lastName < contactB.lastName) {
        return -1;
    } else if (contactA.lastName> contactB.lastName) {
        return 1;
    }
    return 0;
}

function addNewContact() {
    var contact = {
        firstName: firstNameNode.value,
        lastName: surnameNode.value,
        phoneNumber: phoneNode.value,
        email: emailNode.value
    };
    fetch(
        'http://localhost:3000/contacts', {
            method: 'POST',
            body: JSON.stringify(contact),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function () {
            syncContacts()
    })
}

function validateContactData() {
    var newData = Array.from(document.getElementsByClassName('contact-input'));
    var newDataValues = newData.map(input => input.value);
    var isEveryFieldFilled = function (input) {
        return input === '';
    };
    if (newDataValues.some(isEveryFieldFilled)) {
        alert('Please fill all fields before submitting')
    } else {
        addNewContact()
    }
}
function removeContact(id) {
    fetch(
        'http://localhost:3000/contacts/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function () {
        syncContacts()
    })
}

function updateContact(firstName, lastName, phone, mail, id) {
    var updatedContact = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phone,
        email: mail
    };
    fetch(
        'http://localhost:3000/contacts/' + id, {
            method: 'PATCH',
            body: JSON.stringify(updatedContact),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(syncContacts)
}

function addDeleteButtonToCard (button, contact) {
    button.classList.add('contacts-single__delete');
    button.addEventListener('click', function () {
        removeContact(contact.id)
    })
}

