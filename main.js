/* eslint-disable prettier/prettier */
/* eslint-disable prefer-template */
document.getElementById('issueInputForm').addEventListener('submit', submitIssue);

function submitIssue(e) {
  const getInputValue = id => document.getElementById(id).value;
  const description = getInputValue('issueDescription');
  const severity = getInputValue('issueSeverity');
  const assignedTo = getInputValue('issueAssignedTo');
  const id = Math.floor(Math.random()*100000000) + '';
  const status = 'Open';

  const issue = { id, description, severity, assignedTo, status };
  let issues = [];
  if (localStorage.getItem('issues')){
    issues = JSON.parse(localStorage.getItem('issues'));
  }
  issues.push(issue);
  localStorage.setItem('issues', JSON.stringify(issues));

  document.getElementById('issueInputForm').reset();
  fetchIssues();
  e.preventDefault();
}

const closeIssue = id => {
  console.log(id);
  
  const issues = JSON.parse(localStorage.getItem('issues'));
  console.log(issues);
  
  const currentIssue = issues.find(issue => issue.id === String(id));
  console.log(currentIssue);
  
  currentIssue.status = 'Closed';
  localStorage.setItem('issues', JSON.stringify(issues));
  fetchIssues();
}

const deleteIssue = id => {
  
  const issues = JSON.parse(localStorage.getItem('issues'));
  const remainingIssues = issues.filter(issue => issue.id !== String(id) )
  localStorage.setItem('issues', JSON.stringify(remainingIssues));
  fetchIssues();
}


function setStatusClosed(id) {
  closeIssue(id)
}

const fetchIssues = () => {
  const issues = JSON.parse(localStorage.getItem('issues'));
  const issuesList = document.getElementById('issuesList');
  issuesList.innerHTML = '';

  if(issues) {
    console.log(issues);
    
    document.getElementById('totalIssue').innerText = issues.length;
    const openIssue = issues.filter(issue => issue.status !== 'Closed').length;
    document.getElementById('openIssue').innerText = openIssue;
    
    
    for (var i = 0; i < issues.length; i++) {
      const {id, description, severity, assignedTo, status} = issues[i];
  
      issuesList.innerHTML +=   `<div class="well">
                                <h6>Issue ID: ${id} </h6>
                                <p><span class="label label-info"> ${status} </span></p>
                                <h3 class="${status==='Closed' ? 'closed' :''}"> ${description} </h3>
                                <p><span class="glyphicon glyphicon-time"></span> ${severity}</p>
                                <p><span class="glyphicon glyphicon-user"></span> ${assignedTo}</p>
                                <a href="#" onclick="setStatusClosed(${id})" class="btn btn-warning">Close</a>
                                <a href="#" onclick="deleteIssue(${id})" class="btn btn-danger">Delete</a>
                                </div>`;
    }
  } 

}
