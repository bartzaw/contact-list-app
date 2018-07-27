var contactsList = document.getElementById('contacts');

function getContacts() {
    return fetch (
        'http://localhost:3000/tasks'
    ).then(
        function (response) {
            return response.json()
        }
    )
}

function displayContacts(contacts) {
    contactsList.innerHTML = '';
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
    contactNode.append(name);
    contactNode.append(phoneNumber);
    contactNode.append(email);
    contactNode.append(contactCheckbox);
    contactsList.append(contactNode);
}