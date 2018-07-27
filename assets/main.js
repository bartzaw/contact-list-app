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