const addAppointment = async (childID) => {
    await fetch('/api/create-appointment',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            childID: childID,
            title: document.querySelector('#title').value,
            datetime: document.querySelector('#date').value,
            location: document.querySelector('#location').value
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Appointment was not created');
        }
    })
    .then(data => {
        var appointmentCard = `
        <div class='col-12 col-md-4 col-lg-3' id='appointment-${data._id}'>
        <div class='card text-center border-success'>
          <div class='card-body'>
            <h5 class='card-title'>${data.title}</h5>
            <p class='card-text'>${ new Intl.DateTimeFormat('en-GB',{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
              }).format(new Date(data.datetime))}</p>
          </div>
          <div class="card-footer">
            <a href="/child/${childID}/appointment/${data._id}"><button class="btn btn-success">Edit</button></a>
            <button class="btn btn-danger" data-id="${data._id}" onclick="updateDeleteAppointment('${data._id}')">Delete</button>
          </div>
          </div>
        </div> `;
        const fragment = document.createRange().createContextualFragment(appointmentCard);
        document.querySelector('#appointments').prepend(fragment);
        $('#addModal').modal('hide')
        ;
    })
    .catch(error => console.log(error))
    ;
};

const updateDeleteAppointment = (id) => {
    document.querySelector('#deleteAppointment').setAttribute('data-id',id);
    $('#deleteAppointment').modal('show');
};

const deleteAppointment = async () => {
    var appointmentID = document.querySelector('#deleteAppointment').getAttribute('data-id');
    
    document.querySelector(`#appointment-${appointmentID}`).remove();
    $('#deleteAppointment').modal('hide');

    await fetch('/api/delete-appointment',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appointmentID })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Appointment was not deleted');
        }
    })
    .catch(error => console.log(error))
    ;
    
}