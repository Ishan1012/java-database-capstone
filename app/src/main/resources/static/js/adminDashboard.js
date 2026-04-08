/*
  This script handles the admin dashboard functionality for managing doctors:
  - Loads all doctor cards
  - Filters doctors by name, time, or specialty
  - Adds a new doctor via modal form


  Attach a click listener to the "Add Doctor" button
  When clicked, it opens a modal form using openModal('addDoctor')


  When the DOM is fully loaded:
    - Call loadDoctorCards() to fetch and display all doctors


  Function: loadDoctorCards
  Purpose: Fetch all doctors and display them as cards

    Call getDoctors() from the service layer
    Clear the current content area
    For each doctor returned:
    - Create a doctor card using createDoctorCard()
    - Append it to the content div

    Handle any fetch errors by logging them


  Attach 'input' and 'change' event listeners to the search bar and filter dropdowns
  On any input change, call filterDoctorsOnChange()


  Function: filterDoctorsOnChange
  Purpose: Filter doctors based on name, available time, and specialty

    Read values from the search bar and filters
    Normalize empty values to null
    Call filterDoctors(name, time, specialty) from the service

    If doctors are found:
    - Render them using createDoctorCard()
    If no doctors match the filter:
    - Show a message: "No doctors found with the given filters."

    Catch and display any errors with an alert


  Function: renderDoctorCards
  Purpose: A helper function to render a list of doctors passed to it

    Clear the content area
    Loop through the doctors and append each card to the content area


  Function: adminAddDoctor
  Purpose: Collect form data and add a new doctor to the system

    Collect input values from the modal form
    - Includes name, email, phone, password, specialty, and available times

    Retrieve the authentication token from localStorage
    - If no token is found, show an alert and stop execution

    Build a doctor object with the form values

    Call saveDoctor(doctor, token) from the service

    If save is successful:
    - Show a success message
    - Close the modal and reload the page

    If saving fails, show an error message
*/
let allDoctors = [];

document.addEventListener('DOMContentLoaded', async () => {
    if (!localStorage.getItem('jwtToken')) window.location.href = '/';
    allDoctors = await DoctorService.getAllDoctors();
    renderDoctors(allDoctors);
});

function renderDoctors(doctors) {
    const container = document.getElementById('doctors-list');
    container.innerHTML = '';
    doctors.forEach(doc => {
        container.innerHTML += `
            <div class="card">
                <h3>${doc.name}</h3>
                <p><strong>Specialty:</strong> ${doc.specialty}</p>
                <button class="btn-danger" onclick="handleDelete(${doc.id})">Delete</button>
            </div>
        `;
    });
}

document.getElementById('searchName').addEventListener('input', filterDoctors);
document.getElementById('filterSpecialty').addEventListener('change', filterDoctors);

function filterDoctors() {
    const nameStr = document.getElementById('searchName').value.toLowerCase();
    const specStr = document.getElementById('filterSpecialty').value;
    const filtered = allDoctors.filter(doc =>
        doc.name.toLowerCase().includes(nameStr) &&
        (specStr === '' || doc.specialty === specStr)
    );
    renderDoctors(filtered);
}

document.getElementById('addDoctorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newDoc = {
        name: document.getElementById('docName').value,
        specialty: document.getElementById('docSpecialty').value,
        email: document.getElementById('docEmail').value,
        password: document.getElementById('docPassword').value
    };
    await DoctorService.addDoctor(newDoc);
    closeModal('addDoctorModal');
    allDoctors = await DoctorService.getAllDoctors();
    renderDoctors(allDoctors);
});

async function handleDelete(id) {
    if(confirm('Delete this doctor?')) {
        await DoctorService.deleteDoctor(id);
        allDoctors = await DoctorService.getAllDoctors();
        renderDoctors(allDoctors);
    }
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }