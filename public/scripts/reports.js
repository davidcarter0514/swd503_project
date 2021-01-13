const showAddReport = () => {
    $('#startdate').val(new Date().toISOString().substr(0, 16));
    $('#enddate').val(new Date().toISOString().substr(0, 16));
    $('#period').val('Week');
    $('#report').val('');
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
        var reportRow = $(document.createDocumentFragment()).html(
        `<tr scope="row" id="report-${data._id}">
        <td> ${Intl.DateTimeFormat('en-GB',{
            year: 'numeric', month: 'numeric', day: 'numeric'
          }).format(new Date(data.startdate))
         }</td>
        <td> ${Intl.DateTimeFormat('en-GB',{
          year: 'numeric', month: 'numeric', day: 'numeric'
          }).format(new Date(data.enddate))
         }</td>
        <td>${data.period}</td>
        <td>${data.report}</td>
        <td>
            <button class="btn btn-success" data-id="${data._id}" onclick="updateEditReport('${data._id}')">Edit</button>
            <button class="btn btn-danger" data-id="${data._id}" onclick="updateDeleteReport('${data._id}')">Delete</button>
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
        $('#edit-enddate').val(new Date(data.enddate).toISOString().substring(0,10));
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
        $(`#report-${reportID} td:nth-child(4)`).text(data.report);
        $(`#report-${reportID} td:nth-child(3)`).text(data.period);
        $(`#report-${reportID} td:nth-child(2)`).text(Intl.DateTimeFormat('en-GB',{year: 'numeric', month: 'numeric', day: 'numeric'}).format(new Date(data.enddate)));
        $(`#report-${reportID} td:nth-child(1)`).text(Intl.DateTimeFormat('en-GB',{year: 'numeric', month: 'numeric', day: 'numeric'}).format(new Date(data.startdate)));
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
            var reportRow = $(document.createDocumentFragment()).html(
                `<tr scope="row" id="report-${report._id}">
                <td> ${Intl.DateTimeFormat('en-GB',{
                    year: 'numeric', month: 'numeric', day: 'numeric'
                  }).format(new Date(report.startdate))
                 }</td>
                <td> ${Intl.DateTimeFormat('en-GB',{
                  year: 'numeric', month: 'numeric', day: 'numeric'
                  }).format(new Date(report.enddate))
                 }</td>
                <td>${report.period}</td>
                <td>${report.report}</td>
                <td>
                    <button class="btn btn-success" data-id="${report._id}" onclick="updateEditReport('${report._id}')">Edit</button>
                    <button class="btn btn-danger" data-id="${report._id}" onclick="updateDeleteReport('${report._id}')">Delete</button>
                </td>
              </tr>`);

            frag.append(reportRow);
        });

        $('#reports tbody').html(frag);
    })
    .catch(error => console.log(error))
    ;
};