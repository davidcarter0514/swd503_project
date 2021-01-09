const showAddIncident = () => {
    $('#date').val(new Date().toISOString().substr(0, 10));
    $('#title').val('');
    $('#description').val('');
    $('#addModal').modal('show');
};

const addIncident = async (childID) => {
    await fetch('/api/create-incident',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            childID: childID,
            date: document.querySelector('#date').value,
            title: document.querySelector('#title').value,
            description: document.querySelector('#description').value,
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Incident was not created');
        }
    })
    .then(data => {
        var incidentRow = $(document.createDocumentFragment()).html(
        `<tr scope="row" id="incident-${data._id}">
        <td> ${Intl.DateTimeFormat('en-GB',{
            year: 'numeric', month: 'numeric', day: 'numeric'
          }).format(new Date(data.date))
         }</td>
        <td>${data.title}</td>
        <td>${data.description}</td>
        <td>
            <button class="btn btn-success" data-id="${data._id}" onclick="updateEditIncident('${data._id}')">Edit</button>
            <button class="btn btn-danger" data-id="${data._id}" onclick="updateDeleteIncident('${data._id}')">Delete</button>
        </td>
      </tr>`);
        $('#incidents tbody').prepend(incidentRow);
        $('#addModal').modal('hide');
    })
    .catch(error => console.log(error))
    ;
};

const updateDeleteIncident = (id) => {
    document.querySelector('#deleteIncident').setAttribute('data-id',id);
    $('#deleteIncident').modal('show');
};

const deleteIncident = async () => {
    var incidentID = document.querySelector('#deleteIncident').getAttribute('data-id');
    
    document.querySelector(`#incident-${incidentID}`).remove();
    $('#deleteIncident').modal('hide');

    await fetch('/api/delete-incident',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: incidentID })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Incident was not deleted');
        }
    })
    .catch(error => console.log(error))
    ;
    
};

const updateEditIncident = async (id) => {
    await fetch('/api/read-incident',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            incidentID: id
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Incident was not read');
        }
    })
    .then(data =>{
        $('#editIncident').data('id',id);
        $('#edit-title').val(data.title);
        $('#edit-description').val(data.description);
        $('#edit-date').val(new Date(data.date).toISOString().substring(0,10));
        $('#editIncident').modal('show');
    })
    .catch(error => console.log(error))
    ;
};

const editIncident = async () => {
    var incidentID = $('#editIncident').data('id');
    await fetch('/api/update-incident',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            incidentID: incidentID,
            title: $('#edit-title').val(),
            date: $('#edit-date').val(),
            description: $('#edit-description').val(),
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Incident was not updated');
        }
    })
    .then(data =>{
        $(`#incident-${incidentID} td:nth-child(3)`).text(data.description);
        $(`#incident-${incidentID} td:nth-child(2)`).text(data.title);
        $(`#incident-${incidentID} td:nth-child(1)`).text(Intl.DateTimeFormat('en-GB',{year: 'numeric', month: 'numeric', day: 'numeric'}).format(new Date(data.date)));
        $('#editIncident').modal('hide');
    })
    .catch(error => console.log(error))
    ;
    
}

