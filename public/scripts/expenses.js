const showAddExpense = () => {
    $('#type').val('');
    $('#mileage').val('');
    showMileage();
    $('#amount').val(0.00);
    $('#addModal').modal('show');
};

const addExpense = async (ID) => {
    await fetch('/api/create-expense',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            appointmentID: ID,
            amount: document.querySelector('#amount').value,
            type: document.querySelector('#type').value,
            mileage: document.querySelector('#mileage').value,
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Expense was not created');
        }
    })
    .then(data => {
        var mileage = '';
        var mileage_el = '';
        if(data.mileage) {
            mileage = data.mileage;
            mileage_el = `Mileage: ${ mileage }`;
        }
        
        var expenseRow = $(document.createDocumentFragment()).html(
        `<tr scope="row" id="expense-${ data._id }">
          <td class="d-none d-md-table-cell">${ data.type }</td>
          <td class="d-none d-md-table-cell">${ data.mileage }</td>
          <td class="d-none d-md-table-cell">${ Number(data.amount).toFixed(2) }</td>
          <td class="d-none d-md-table-cell">
              <button class="btn btn-success" data-id="${ data._id }" onclick="updateEditExpense('${ data._id }')">Edit</button>
              <button class="btn btn-danger" data-id="${ data._id }" onclick="updateDeleteExpense('${ data._id }')">Delete</button>
          </td>
          <td class="d-md-none d-table-cell">
            <div class='card text-center'>
              <div class='card-body p-2'>
                <h5 class='card-title'>${ data.type }</h5>
                <p class='card-text m-1'>${ mileage_el }</p>
                <p class='card-text m-1'>Amount: ${ Number(data.amount).toFixed(2) }</p>
              </div>
              <div class="card-footer p-2">
                <button class="btn btn-success" data-id="${ data._id }" onclick="updateEditExpense('${ data._id }')">Edit</button>
                <button class="btn btn-danger" data-id="${ data._id }" onclick="updateDeleteExpense('${ data._id }')">Delete</button>
              </div>
            </div>
          </td>
        </tr>`);
        $('#expenses tbody').prepend(expenseRow);
        $('#addModal').modal('hide');
    })
    .catch(error => console.log(error))
    ;
};

const updateDeleteExpense = (id) => {
    document.querySelector('#deleteExpense').setAttribute('data-id',id);
    $('#deleteExpense').modal('show');
};

const deleteExpense = async () => {
    var expenseID = document.querySelector('#deleteExpense').getAttribute('data-id');
    
    document.querySelector(`#expense-${expenseID}`).remove();
    $('#deleteExpense').modal('hide');

    await fetch('/api/delete-expense',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: expenseID })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Expense was not deleted');
        }
    })
    .catch(error => console.log(error))
    ;
    
};

const updateEditExpense = async (id) => {
    await fetch('/api/read-expense',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            expenseID: id
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Expense was not read');
        }
    })
    .then(data =>{
        $('#editExpense').data('id',id);
        $('#edit-type').val(data.type);
        $('#edit-mileage').val(data.mileage);
        $('#edit-amount').val(data.amount);
        showEditMileage();
        $('#editExpense').modal('show');
    })
    .catch(error => console.log(error))
    ;
};

const editExpense = async () => {
    var expenseID = $('#editExpense').data('id');
    await fetch('/api/update-expense',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            expenseID: expenseID,
            type: $('#edit-type').val(),
            amount: $('#edit-amount').val(),
            mileage: $('#edit-mileage').val(),
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Expense was not updated');
        }
    })
    .then(data =>{
        var mileage = '';
        if(data.mileage) {mileage = `Mileage: ${data.mileage}`;}
        $(`#expense-${expenseID} td:nth-child(1)`).text(data.type);
        $(`#expense-${expenseID} td:nth-child(2)`).text(mileage);
        $(`#expense-${expenseID} td:nth-child(3)`).text(Number(data.amount).toFixed(2));
        $(`#expense-${expenseID} td:nth-child(5) .card .card-body .card-title`).text(data.type);
        $(`#expense-${expenseID} td:nth-child(5) .card .card-body p:nth-child(2)`).text(mileage);
        $(`#expense-${expenseID} td:nth-child(5) .card .card-body p:nth-child(3)`).text(`Amount: ${Number(data.amount).toFixed(2)}`);
        $('#editExpense').modal('hide');
    })
    .catch(error => console.log(error))
    ;
    
}

const showMileage = () => {
    if($('#type').val() == 'Mileage') {
        $('#group-mileage').show();
    } else {
        $('#group-mileage').hide();
        $('#mileage').val('');
    }
};

const showEditMileage = () => {
    if($('#edit-type').val() == 'Mileage') {
        $('#group-edit-mileage').show();
    } else {
        $('#group-edit-mileage').hide();
        $('#edit-mileage').val('');
    }
};