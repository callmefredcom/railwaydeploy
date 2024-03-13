window.onload = function() {
    Swal.fire({
        title: 'Enter admin password',
        input: 'password',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: (password) => {
            return fetch('/check-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({password: password}),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                return response.json()
            })
            .catch(error => {
                Swal.showValidationMessage(`Request failed: ${error}`)
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            if (result.value.status === 'success') {
                // Load the admin page
                fetch('/get-users')
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            let tableBody = document.querySelector('#user-table tbody');
                            data.users.forEach(user => {
                                let row = document.createElement('tr');
                                row.className = 'border-b border-gray-500';
                                let cell = document.createElement('td');
                                cell.textContent = user.email;
                                row.appendChild(cell);
                                tableBody.appendChild(row);
                            });
                        } else {
                            console.error('Failed to fetch users:', data.message);
                        }
                    })
                    .catch(error => console.error('Error:', error));
            } else {
                // Display an alert
                Swal.fire("Access Denied", "Incorrect password.", "error");
            }
        }
    });
};