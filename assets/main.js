var contactsList = document.getElementById('contacts');
var firstNameNode = document.getElementById('firstName');
var surnameNode = document.getElementById('surname');
var phoneNode = document.getElementById('phoneNumber');
var emailNode = document.getElementById('emailAddress');
var addContactButton = document.getElementById('contacts-addButton');
var removeSelectedButton = document.getElementById('contacts-removeButton__selected');

syncContacts();

addContactButton.addEventListener('click', validateNewContactData);

phoneNode.addEventListener('focusout', function () {
    validatePhoneNumber(phoneNode.value)
});

emailNode.addEventListener('focusout', function () {
    validateEmailAddress(emailNode.value)
});

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
    var editModeButton = document.createElement('div');
    contactNode.classList.add('contact-card');
    contactCheckbox.type = 'checkbox';
    contactCheckbox.classList.add('contacts-checkbox');
    contactCheckbox.title = 'Select to remove multiple';
    contactCheckbox.id = contact.id;
    contactNode.id = contact.id;
    fillCardWithData(contact, name, phoneNumber, email);
    addDeleteButtonToCard(deleteSingle, contact);
    addEditButtonToCard(editModeButton, contact, contactNode);
    contactNode.append(name);
    contactNode.append(phoneNumber);
    contactNode.append(email);
    contactNode.append(contactCheckbox);
    contactNode.append(editModeButton);
    contactNode.append(deleteSingle);
    contactsList.append(contactNode);
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
    button.classList.add('btn');
    button.title = 'Delete this contact';
    button.addEventListener('click', function () {
        removeContact(contact.id)
    })
}

function addEditButtonToCard (button, contact, container) {
    button.classList.add('contacts-single__edit');
    button.classList.add('btn');
    button.title = 'Edit this contact';
    button.addEventListener('click', function () {
        var editModeDiv = document.querySelector('.edit-mode');
        if (!document.body.contains(editModeDiv)) {
            showEditMode(contact)
        } else {
            container.removeChild(editModeDiv)
        }
    })
}

function showEditMode (contact) {
    var editForm = document.createElement('div');
    var listElement = document.getElementById(contact.id);
    editForm.classList.add('edit-mode');
    editModeForm(editForm, contact);
    listElement.append(editForm);
    return editForm
}

function editModeForm (container, contact) {
    var saveButton = document.createElement('button');
    var editFirstName = document.createElement('input');
    var editLastName = document.createElement('input');
    var editPhoneNumber = document.createElement('input');
    var editEmailAddress = document.createElement('input');
    saveButton.classList.add('contacts-button__save');
    saveButton.classList.add('btn');
    editFirstName.value = contact.firstName;
    editFirstName.classList.add('edited-element');
    editLastName.value = contact.lastName;
    editLastName.classList.add('edited-element');
    editPhoneNumber.value = contact.phoneNumber;
    editPhoneNumber.classList.add('edited-element');
    editEmailAddress.value = contact.email;
    editEmailAddress.classList.add('edited-element');
    container.append(editFirstName);
    container.append(editLastName);
    container.append(editPhoneNumber);
    container.append(editEmailAddress);
    container.append(saveButton);
    editPhoneNumber.addEventListener('focusout', function() {
        validatePhoneNumber(editPhoneNumber.value)
    });
    editEmailAddress.addEventListener('focusout', function () {
        validateEmailAddress(editEmailAddress.value)
    });

    saveButton.addEventListener('click', function () {
        if(!validateEditedContactData()) {
         updateContact(editFirstName.value, editLastName.value, editPhoneNumber.value, editEmailAddress.value,
                       contact.id)
        } else {
          alert('Please fill all fields before submitting')
         }
    })
}

function validateNewContactData() {
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

function validateEditedContactData() {
    var editedData = Array.from(document.getElementsByClassName('edited-element'));
    var editedDataValues = editedData.map(input => input.value);
    var isEveryFieldFilled = function (input) {
        return input === '';
    };
    return editedDataValues.some(isEveryFieldFilled)
}

function validatePhoneNumber(phone) {
    var validPhoneCharacters = new RegExp(/^\d{9}$/g);
    if (phone.match(validPhoneCharacters)) {
        return true
    } else if (phone === '') {
        return true
    } else {
        alert('Number needs to contain 9 digits without blank spaces. Please try again')
    }
}

function validateEmailAddress(mail) {
    var validEmailCharacters = new RegExp(/[a-z0-9._]+@[a-z0-9.-]+\.[a-z]/gi);
    if (mail.match(validEmailCharacters)) {
        return true
    } else if (mail === '' ) {
        return true
    } else {
        alert ('This email address is not correct. Please try again');
    }
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

function syncContacts() {
    getContacts().then(displayContacts)
}