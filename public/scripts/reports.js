const showAddReport = () => {
    $('#startdate').val(new Date().toISOString().substr(0, 10));
    $('#enddate').val(new Date().toISOString().substr(0, 10));
    $('#period').val('Day');
    $('#report').val('');
    showMultipleDays();
    $('#addModal').modal('show');
};

const addReport = async (childID) => {
    await fetch('/api/create-report',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            childID: childID,
            startdate: document.querySelector('#startdate').value,
            enddate: document.querySelector('#enddate').value,
            period: document.querySelector('#period').value,
            report: document.querySelector('#report').value,
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Report was not created');
        }
    })
    .then(data => {
        var startdate = Intl.DateTimeFormat('en-GB',{year: 'numeric', month: 'numeric', day: 'numeric'}).format(new Date(data.startdate));
        var enddate = '';
        if (data.enddate) {
            var enddate = Intl.DateTimeFormat('en-GB',{year: 'numeric', month: 'numeric', day: 'numeric'}).format(new Date(data.enddate));
            var datestring = `${startdate} to ${enddate}`;
        } else {
            var datestring = startdate;
        }

        var reportRow = $(document.createDocumentFragment()).html(      
        `<tr scope="row" id="report-${ data._id }">
          <td class="d-none d-md-table-cell">${datestring}</td>
          <td class="d-none d-md-table-cell">${data.report}</td>
          <td class="d-none d-md-table-cell">
              <button class="btn btn-success" data-id="${ data._id }" onclick="updateEditReport('${ data._id }')">Edit</button>
              <button class="btn btn-danger" data-id="${ data._id }" onclick="updateDeleteReport('${ data._id }')">Delete</button>
          </td>
          <td class="d-md-none d-table-cell">
            <div class='card text-center'>
              <div class='card-body p-2'>
                <h5 class='card-title'>${datestring}</h5>
                <p class='card-text m-1'>${data.report}</p>
              </div>
              <div class="card-footer p-2">
                <button class="btn btn-success" data-id="${ data._id }" onclick="updateEditReport('${ data._id }')">Edit</button>
                <button class="btn btn-danger" data-id="${ data._id }" onclick="updateDeleteReport('${ data._id }')">Delete</button>
              </div>
            </div>
          </td>
        </tr>`);
        $('#reports tbody').prepend(reportRow);
        $('#addModal').modal('hide');
    })
    .catch(error => console.log(error))
    ;
};

const updateDeleteReport = (id) => {
    document.querySelector('#deleteReport').setAttribute('data-id',id);
    $('#deleteReport').modal('show');
};

const deleteReport = async () => {
    var reportID = document.querySelector('#deleteReport').getAttribute('data-id');
    
    document.querySelector(`#report-${reportID}`).remove();
    $('#deleteReport').modal('hide');

    await fetch('/api/delete-report',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reportID })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Report was not deleted');
        }
    })
    .catch(error => console.log(error))
    ;
    
};

const updateEditReport = async (id) => {
    await fetch('/api/read-report',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            reportID: id
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Report was not read');
        }
    })
    .then(data =>{
        $('#editReport').data('id',id);
        $('#edit-period').val(data.period);
        $('#edit-report').val(data.report);
        $('#edit-startdate').val(new Date(data.startdate).toISOString().substring(0,10));
        if(data.period == 'Day') {
            $('#edit-startdate-label').text('Date:');
            $('#edit-enddate-group').hide();
            $('#edit-enddate').val('');
        } else {
            $('#edit-startdate-label').text('Start Date:');
            $('#edit-enddate').val(new Date(data.enddate).toISOString().substring(0,10));
            $('#edit-enddate-group').show();
        }
        $('#editReport').modal('show');
    })
    .catch(error => console.log(error))
    ;
};

const editReport = async () => {
    var reportID = $('#editReport').data('id');
    await fetch('/api/update-report',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            reportID: reportID,
            period: $('#edit-period').val(),
            startdate: $('#edit-startdate').val(),
            enddate: $('#edit-enddate').val(),
            report: $('#edit-report').val(),
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Report was not updated');
        }
    })
    .then(data =>{
        var startdate = Intl.DateTimeFormat('en-GB',{year: 'numeric', month: 'numeric', day: 'numeric'}).format(new Date(data.startdate));
        var enddate = '';
        if (data.enddate) {
            var enddate = Intl.DateTimeFormat('en-GB',{year: 'numeric', month: 'numeric', day: 'numeric'}).format(new Date(data.enddate));
            var datestring = `${startdate} to ${enddate}`;
        } else {
            var datestring = startdate;
        }

        $(`#report-${reportID} td:nth-child(1)`).text(datestring);
        $(`#report-${reportID} td:nth-child(2)`).text(data.report);
        $(`#report-${reportID} td:nth-child(4) .card .card-body .card-title`).text(datestring);
        $(`#report-${reportID} td:nth-child(4) .card .card-body .card-text`).text(data.report);
        $('#editReport').modal('hide');
    })
    .catch(error => console.log(error))
    ;
};

const searchReports = async (childID) => {
    await fetch('/api/search-report',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            searchQuery: $('#searchInput').val(),
            childID: childID
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject('Report was not updated');
        }
    })
    .then(data =>{
        const frag = $(document.createDocumentFragment());
        data.forEach(report => {
            var startdate = Intl.DateTimeFormat('en-GB',{year: 'numeric', month: 'numeric', day: 'numeric'}).format(new Date(report.startdate));
            var enddate = '';
            if (report.enddate) {
                var enddate = Intl.DateTimeFormat('en-GB',{year: 'numeric', month: 'numeric', day: 'numeric'}).format(new Date(report.enddate));
                var datestring = `${startdate} to ${enddate}`;
            } else {
                var datestring = startdate;
            }

            var reportRow = $(document.createDocumentFragment()).html(      
            `<tr scope="row" id="report-${ report._id }">
            <td class="d-none d-md-table-cell">${datestring}</td>
            <td class="d-none d-md-table-cell">${report.report}</td>
            <td class="d-none d-md-table-cell">
                <button class="btn btn-success" data-id="${ report._id }" onclick="updateEditReport('${ report._id }')">Edit</button>
                <button class="btn btn-danger" data-id="${ report._id }" onclick="updateDeleteReport('${ report._id }')">Delete</button>
            </td>
            <td class="d-md-none d-table-cell">
                <div class='card text-center'>
                <div class='card-body p-2'>
                    <h5 class='card-title'>${datestring}</h5>
                    <p class='card-text m-1'>${report.report}</p>
                </div>
                <div class="card-footer p-2">
                    <button class="btn btn-success" data-id="${ report._id }" onclick="updateEditReport('${ report._id }')">Edit</button>
                    <button class="btn btn-danger" data-id="${ report._id }" onclick="updateDeleteReport('${ data._id }')">Delete</button>
                </div>
                </div>
            </td>
            </tr>`);

            frag.append(reportRow);
        });

        $('#reports tbody').html(frag);
    })
    .catch(error => console.log(error))
    ;
};

const showMultipleDays = () => {
    if($('#period').val() == 'Day') {
        $('#startdate-label').text('Date:');
        $('#enddate-group').hide();
        $('#enddate').val('');
    } else {
        $('#startdate-label').text('Start Date:');
        $('#enddate').val(new Date().toISOString().substr(0, 10));
        $('#enddate-group').show();
    }
};

const showEditMultipleDays = () => {
    if($('#edit-period').val() == 'Day') {
        $('#edit-startdate-label').text('Date:');
        $('#edit-enddate').val('');
        $('#edit-enddate-group').hide();
    } else {
        $('#edit-startdate-label').text('Start Date:');
        $('#edit-enddate').val(new Date().toISOString().substr(0, 10));
        $('#edit-enddate-group').show();
    }
};