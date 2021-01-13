const showAddChange = () => {
    $('#datetime').val(new Date().toISOString().substr(0, 16));
    $('#type').val('');
    $('#notes').val('');
    $('#addModal').modal('show');
};

const addChange = async (childID) => {
    await fetch('/api/create-change',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            childID: childID,
            type: document.querySelector('#type').value,
            datetime: document.querySelector('#datetime').value,
            notes: document.querySelector('#notes').value,
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Change was not created');
        }
    })
    .then(data => {
        var changeRow = $(document.createDocumentFragment()).html(
        `<tr scope="row">
            <td> ${Intl.DateTimeFormat('en-GB',{
                year: 'numeric', month: 'numeric', day: 'numeric'
                }).format(new Date(data.datetime))}</td>
            <td> ${Intl.DateTimeFormat('en-GB',{
                hour: 'numeric', minute: 'numeric'
                }).format(new Date(data.datetime))}</td>
            <td>${data.type}</td>
            <td>${data.notes}</td>
            <td>
                <button class="btn btn-success" data-id="${data._id}" onclick="updateEditChange('${data._id}')">Edit</button>
                <button class="btn btn-danger" data-id="${data._id}" onclick="updateDeleteChange('${data._id}')">Delete</button>
            </td>
        </tr>`);
        $('#changes tbody').prepend(changeRow);
        $('#addModal').modal('hide');
    })
    .catch(error => console.log(error))
    ;
};

const updateDeleteChange = (id) => {
    document.querySelector('#deleteChange').setAttribute('data-id',id);
    $('#deleteChange').modal('show');
};

const deleteChange = async () => {
    var changeID = document.querySelector('#deleteChange').getAttribute('data-id');
    
    document.querySelector(`#change-${changeID}`).remove();
    $('#deleteChange').modal('hide');

    await fetch('/api/delete-change',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: changeID })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Change was not deleted');
        }
    })
    .catch(error => console.log(error))
    ;
    
};

const updateEditChange = async (id) => {
    await fetch('/api/read-change',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            changeID: id
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Change was not read');
        }
    })
    .then(data =>{
        datetime = new Date(data.datetime).toISOString();
        console.log(datetime);
        $('#editChange').data('id',id);
        $('#edit-type').val(data.type);
        $('#edit-notes').val(data.notes);
        $('#edit-datetime').val(new Date(data.datetime).toISOString().substring(0,16));
        $('#editChange').modal('show');
    })
    .catch(error => console.log(error))
    ;
};


const editChange = async () => {
    console.log('editChange fired');
    var changeID = $('#editChange').data('id');
    await fetch('/api/update-change',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            changeID: changeID,
            type: $('#edit-type').val(),
            datetime: $('#edit-datetime').val(),
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Change was not updated');
        }
    })
    .then(data =>{
        console.log('reached here');
        console.log(data);
        $(`#change-${changeID} td:nth-child(4)`).text(data.notes);
        $(`#change-${changeID} td:nth-child(3)`).text(data.type);
        $(`#change-${changeID} td:nth-child(2)`).text(Intl.DateTimeFormat('en-GB',{hour: 'numeric', minute: 'numeric'}).format(new Date(data.datetime)));
        $(`#change-${changeID} td:nth-child(1)`).text(Intl.DateTimeFormat('en-GB',{year: 'numeric', month: 'numeric', day: 'numeric'}).format(new Date(data.datetime)));
        $('#editChange').modal('hide');
    })
    .catch(error => console.log(error))
    ;
    
}

