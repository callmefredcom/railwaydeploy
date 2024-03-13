document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();

    let email = document.querySelector('#email').value;

    fetch('/submit-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'email=' + encodeURIComponent(email),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            Swal.fire(
                'Success!',
                data.message,
                'success'
            );
        } else {
            Swal.fire(
                'Error!',
                'There was an error submitting your email.',
                'error'
            );
        }
    })
    .catch((error) => {
        Swal.fire(
            'Error!',
            'There was an error submitting your email.',
            'error'
        );
    });
});

