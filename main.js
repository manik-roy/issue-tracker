function validInputField(id, msg, len) {
    let isValid = false;
    let element = document.getElementById(id);
    let val = element.value;
    if (!val || val == '') {
        element.parentElement.lastElementChild.style.display = 'block';
        isValid = false;
    } else if (val.length < len || val.trim().length < 3 || val.length > 100) {
        element.parentElement.lastElementChild.style.display = 'block';
        element.parentElement.lastElementChild.innerText = msg;
        isValid = false;
    } else if (!isNaN(val)) {
        element.parentElement.lastElementChild.style.display = 'block';
        element.parentElement.lastElementChild.innerText = 'Input must be Character';
        isValid = false;
    } else {
        element.parentElement.lastElementChild.style.display = 'none';
        isValid = true;
    }
    return isValid;
}

document.getElementById('issueInputForm').addEventListener('submit', submitIssue);

function submitIssue(e) {
    let input1 = validInputField(
        'issueDescription',
        'Issue Description must be greater than 10 Character or less then 100',
        10
    );
    let input2 = validInputField('issueAssignedTo', 'Issue Assign to name must be greater than 3 Character', 3);
    if (input1 && input2) {
        const getInputValue = id => document.getElementById(id).value;
        const description = getInputValue('issueDescription');
        const severity = getInputValue('issueSeverity');
        const assignedTo = getInputValue('issueAssignedTo');
        const id = `${Math.floor(Math.random() * 100000000)}`;
        const status = 'Open';

        const issue = { id, description, severity, assignedTo, status };
        let issues = [];
        if (localStorage.getItem('issues')) {
            issues = JSON.parse(localStorage.getItem('issues'));
        }
        issues.push(issue);
        localStorage.setItem('issues', JSON.stringify(issues));

        document.getElementById('issueInputForm').reset();
        fetchIssues();
    }
    e.preventDefault();
}

const closeIssue = id => {
    const issues = JSON.parse(localStorage.getItem('issues'));

    const currentIssue = issues.find(issue => issue.id === String(id));
    if (currentIssue.status == 'Closed') {
        currentIssue.status = 'Open';
    } else {
        currentIssue.status = 'Closed';
    }
    localStorage.setItem('issues', JSON.stringify(issues));
    fetchIssues();
};

const deleteIssue = id => {
    let result = confirm('Are you sure to delete this issue?');
    if (result) {
        const issues = JSON.parse(localStorage.getItem('issues'));
        const remainingIssues = issues.filter(issue => issue.id !== String(id));
        localStorage.setItem('issues', JSON.stringify(remainingIssues));
        fetchIssues();
    }
};

function setStatusClosed(id) {
    closeIssue(id);
}

const fetchIssues = () => {
    const issues = JSON.parse(localStorage.getItem('issues'));
    const issuesList = document.getElementById('issuesList');
    issuesList.innerHTML = '';

    if (issues) {
        document.getElementById('totalIssue').innerText = issues.length;
        const openIssue = issues.filter(issue => issue.status !== 'Closed').length;
        document.getElementById('openIssue').innerText = openIssue;

        for (let i = 0; i < issues.length; i++) {
            const { id, description, severity, assignedTo, status } = issues[i];

            issuesList.innerHTML += `<div class="well">
                                <h6>Issue ID: ${id} </h6>
                                <p><span class="label label-info"> ${status} </span></p>
                                <h3 class="${status === 'Closed' ? 'closed' : ''} ${
                severity == 'High' ? 'high' : ''
            }"> ${description} </h3>
                                <p><span class="glyphicon glyphicon-time"></span> ${severity}</p>
                                <p><span class="glyphicon glyphicon-user"></span> ${assignedTo}</p>
                                <button onclick="setStatusClosed(${id})" class="btn ${
                status === 'Closed' ? 'btn-success' : ' btn-warning'
            }">${status === 'Closed' ? 'Open' : 'Closed'}</button>
                                <button onclick="deleteIssue(${id})" class="btn btn-danger">Delete</button>
                                </div>`;
        }
    }
};
