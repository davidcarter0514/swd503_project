const showAddAppointment = () => {
    $('#date').val(new Date().toISOString().substr(0, 10));
    $('#title').val('');
    $('#location').val('');
    $('#addModal').modal('show');
};

const addAppointment = async (childID) => {
    await fetch('/api/create-appointment',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            childID: childID,
            date: document.querySelector('#date').value,
            title: document.querySelector('#title').value,
            location: document.querySelector('#location').value,
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
        var appointmentRow = $(document.createDocumentFragment()).html(
        `<tr scope="row" id="appointment-${data._id}">
        <td> ${Intl.DateTimeFormat('en-GB',{
            year: 'numeric', month: 'numeric', day: 'numeric'
          }).format(new Date(data.date))
         }</td>
        <td>${data.title}</td>
        <td>${data.location}</td>
        <td><a href="/child/${childID}/appointment/${data._id}/expenses"><button class="btn btn-secondary">Expenses (${data.expenses.length})</button></td>
          
        <td>
            <button class="btn btn-success" data-id="${data._id}" onclick="updateEditAppointment('${data._id}')">Edit</button>
            <button class="btn btn-danger" data-id="${data._id}" onclick="updateDeleteAppointment('${data._id}')">Delete</button>
        </td>
      </tr>`);
        $('#appointments tbody').prepend(appointmentRow);
        $('#addModal').modal('hide');
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
    
};

const updateEditAppointment = async (id) => {
    await fetch('/api/read-appointment',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            appointmentID: id
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Appointment was not read');
        }
    })
    .then(data =>{
        $('#editAppointment').data('id',id);
        $('#edit-title').val(data.title);
        $('#edit-location').val(data.location);
        $('#edit-date').val(new Date(data.date).toISOString().substring(0,10));
        $('#editAppointment').modal('show');
    })
    .catch(error => console.log(error))
    ;
};

const editAppointment = async () => {
    var appointmentID = $('#editAppointment').data('id');
    await fetch('/api/update-appointment',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            appointmentID: appointmentID,
            title: $('#edit-title').val(),
            date: $('#edit-date').val(),
            location: $('#edit-location').val(),
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Appointment was not updated');
        }
    })
    .then(data =>{
        $(`#appointment-${appointmentID} td:nth-child(4) a button`).text(`Expenses (${data.expenses.length})`);
        $(`#appointment-${appointmentID} td:nth-child(3)`).text(data.location);
        $(`#appointment-${appointmentID} td:nth-child(2)`).text(data.title);
        $(`#appointment-${appointmentID} td:nth-child(1)`).text(Intl.DateTimeFormat('en-GB',{year: 'numeric', month: 'numeric', day: 'numeric'}).format(new Date(data.date)));
        $('#editAppointment').modal('hide');
    })
    .catch(error => console.log(error))
    ;
    
}

