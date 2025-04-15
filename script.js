const students = [
  "Ahmed Sheikh Mohamed",
  "Ahmed Mohamed Abduqaadir",
  "Saadaam Xuseen",
  "Mohamed ismaaciil",
  "Maxamed Bashiir",
  "Maxamed Abduqaadir",
  "Abaas bernando",
  "khaalid Dhoweeye",
  "Falxado",
  "ismahaaan",
  "Ikraan",
  "saabiriin",
];


function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
}

function populateStudentTable() {
  const tbody = document.getElementById('studentTable');
  tbody.innerHTML = '';
  students.forEach((name, index) => {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.textContent = name;
    const statusCell = document.createElement('td');
    const present = document.createElement('input');
    present.type = 'radio';
    present.name = `status${index}`;
    present.value = 'Present';
    const absent = document.createElement('input');
    absent.type = 'radio';
    absent.name = `status${index}`;
    absent.value = 'Absent';
    statusCell.appendChild(present);
    statusCell.appendChild(document.createTextNode(' Present '));
    statusCell.appendChild(absent);
    statusCell.appendChild(document.createTextNode(' Absent'));
    row.appendChild(nameCell);
    row.appendChild(statusCell);
    tbody.appendChild(row);
  });
}

function saveAttendance() {
  const date = document.getElementById('datePicker').value;
  const period = document.getElementById('periodSelect').value;
  if (!date || !period) {
    alert('Please select a date and period.');
    return;
  }
  const data = { date, period, records: [] };
  students.forEach((student, index) => {
    const status = document.querySelector(`input[name="status${index}"]:checked`);
    data.records.push({ name: student, status: status ? status.value : 'Absent' });
  });
  let history = JSON.parse(localStorage.getItem('attendance') || '[]');
  history.push(data);
  localStorage.setItem('attendance', JSON.stringify(history));
  alert('Attendance saved!');
  loadHistory();
}

function loadHistory() {
  const container = document.getElementById('historyTable');
  container.innerHTML = '';
  const history = JSON.parse(localStorage.getItem('attendance') || '[]');
  history.forEach(record => {
    const section = document.createElement('div');
    section.innerHTML = `<h4>${record.date} - ${record.period}</h4>`;
    const table = document.createElement('table');
    table.innerHTML = '<tr><th>Name</th><th>Status</th></tr>';
    record.records.forEach(r => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${r.name}</td><td>${r.status}</td>`;
      table.appendChild(row);
    });
    section.appendChild(table);
    container.appendChild(section);
  });
}

function downloadCSV() {
  const history = JSON.parse(localStorage.getItem('attendance') || '[]');
  let csv = 'Date,Period,Name,Status\n';
  history.forEach(record => {
    record.records.forEach(r => {
      csv += `${record.date},${record.period},${r.name},${r.status}\n`;
    });
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'attendance.csv';
  a.click();
  URL.revokeObjectURL(url);
}

window.onload = () => {
  showView('home');
  populateStudentTable();
  loadHistory();
};