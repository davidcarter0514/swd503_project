const addFeed = async (childID) => {
    await fetch('/api/create-feed',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            childID: childID,
            amount: document.querySelector('#amount').value,
            datetime: document.querySelector('#datetime').value,
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Feed was not created');
        }
    })
    .then(data => {
        var feedRow = $(document.createDocumentFragment()).html(
        `<tr scope="row">
            <td> ${Intl.DateTimeFormat('en-GB',{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
                }).format(new Date(data.datetime))}</td>
            <td> ${Intl.DateTimeFormat('en-GB',{
                hour: 'numeric', minute: 'numeric'
                }).format(new Date(data.datetime))}</td>
            <td class="text-right">${data.amount}</td>
            <td>
                <button class="btn btn-success" data-id="${data._id}" onclick="updateEditFeed('${data._id}')">Edit</button>
                <button class="btn btn-danger" data-id="${data._id}" onclick="updateDeleteFeed('${data._id}')">Delete</button>
            </td>
        </tr>`);
        $('#feeds tbody').prepend(feedRow);
        $('#addModal').modal('hide');
    })
    .catch(error => console.log(error))
    ;
};

const updateDeleteFeed = (id) => {
    document.querySelector('#deleteFeed').setAttribute('data-id',id);
    $('#deleteFeed').modal('show');
};

const deleteFeed = async () => {
    var feedID = document.querySelector('#deleteFeed').getAttribute('data-id');
    
    document.querySelector(`#feed-${feedID}`).remove();
    $('#deleteFeed').modal('hide');

    await fetch('/api/delete-feed',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: feedID })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Feed was not deleted');
        }
    })
    .catch(error => console.log(error))
    ;
    
};

const updateEditFeed = async (id) => {
    await fetch('/api/read-feed',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            feedID: id
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Feed was not read');
        }
    })
    .then(data =>{
        datetime = new Date(data.datetime).toISOString();
        console.log(datetime);
        $('#editFeed').data('id',id);
        $('#edit-amount').val(data.amount);
        $('#edit-datetime').val(new Date(data.datetime).toISOString().substring(0,16));
        $('#editFeed').modal('show');
    })
    .catch(error => console.log(error))
    ;
};


const editFeed = async () => {
    console.log('editFeed fired');
    var feedID = $('#editFeed').data('id');
    await fetch('/api/update-feed',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            feedID: feedID,
            amount: $('#edit-amount').val(),
            datetime: $('#edit-datetime').val(),
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Feed was not updated');
        }
    })
    .then(data =>{
        console.log('reached here');
        console.log(data);
        $(`#feed-${feedID} td:nth-child(3)`).text(data.amount);
        $(`#feed-${feedID} td:nth-child(2)`).text(Intl.DateTimeFormat('en-GB',{hour: 'numeric', minute: 'numeric'}).format(new Date(data.datetime)));
        $(`#feed-${feedID} td:nth-child(1)`).text(Intl.DateTimeFormat('en-GB',{year: 'numeric', month: 'numeric', day: 'numeric'}).format(new Date(data.datetime)));
        $('#editFeed').modal('hide');
    })
    .catch(error => console.log(error))
    ;
    
}

