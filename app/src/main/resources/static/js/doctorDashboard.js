/*
  Import getAllAppointments to fetch appointments from the backend
  Import createPatientRow to generate a table row for each patient appointment


  Get the table body where patient rows will be added
  Initialize selectedDate with today's date in 'YYYY-MM-DD' format
  Get the saved token from localStorage (used for authenticated API calls)
  Initialize patientName to null (used for filtering by name)


  Add an 'input' event listener to the search bar
  On each keystroke:
    - Trim and check the input value
    - If not empty, use it as the patientName for filtering
    - Else, reset patientName to "null" (as expected by backend)
    - Reload the appointments list with the updated filter


  Add a click listener to the "Today" button
  When clicked:
    - Set selectedDate to today's date
    - Update the date picker UI to match
    - Reload the appointments for today


  Add a change event listener to the date picker
  When the date changes:
    - Update selectedDate with the new value
    - Reload the appointments for that specific date


  Function: loadAppointments
  Purpose: Fetch and display appointments based on selected date and optional patient name

  Step 1: Call getAllAppointments with selectedDate, patientName, and token
  Step 2: Clear the table body content before rendering new rows

  Step 3: If no appointments are returned:
    - Display a message row: "No Appointments found for today."

  Step 4: If appointments exist:
    - Loop through each appointment and construct a 'patient' object with id, name, phone, and email
    - Call createPatientRow to generate a table row for the appointment
    - Append each row to the table body

  Step 5: Catch and handle any errors during fetch:
    - Show a message row: "Error loading appointments. Try again later."


  When the page is fully loaded (DOMContentLoaded):
    - Call renderContent() (assumes it sets up the UI layout)
    - Call loadAppointments() to display today's appointments by default
*/
let allAppointments = [];

document.addEventListener('DOMContentLoaded', async () => {
    if (!localStorage.getItem('jwtToken')) window.location.href = '/';
    allAppointments = await PatientService.getDoctorAppointments();
    renderAppointments(allAppointments);
});

function renderAppointments(appointments) {
    const container = document.getElementById('appointments-list');
    container.innerHTML = '';
    appointments.forEach(app => {
        const dateStr = new Date(app.appointmentTime).toLocaleDateString();
        container.innerHTML += `
            <div class="card">
                <h3>${app.patient.name}</h3>
                <p><strong>Date:</strong> ${dateStr}</p>
                <button class="btn-info" onclick="viewPrescriptions(${app.patient.id}, '${app.patient.name}')">View History</button>
            </div>
        `;
    });
}

document.getElementById('searchPatient').addEventListener('input', filterApps);
document.getElementById('filterDate').addEventListener('change', filterApps);

function filterApps() {
    const nameStr = document.getElementById('searchPatient').value.toLowerCase();
    const dateStr = document.getElementById('filterDate').value;

    const filtered = allAppointments.filter(app => {
        const appDate = app.appointmentTime.split('T')[0];
        const matchesName = app.patient.name.toLowerCase().includes(nameStr);
        const matchesDate = dateStr === '' || appDate === dateStr;
        return matchesName && matchesDate;
    });
    renderAppointments(filtered);
}

async function viewPrescriptions(patientId, patientName) {
    const prescriptions = await PatientService.getPatientPrescriptions(patientId);
    const content = document.getElementById('rx-content');

    if(prescriptions.length === 0) {
        content.innerHTML = `<p>No history found for ${patientName}.</p>`;
    } else {
        content.innerHTML = prescriptions.map(rx => `
            <div style="border-bottom:1px solid #eee; margin-bottom:10px;">
                <strong>Medication:</strong> ${rx.medication} <br>
                <strong>Notes:</strong> ${rx.doctorNotes}
            </div>
        `).join('');
    }
    openModal('rxModal');
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }