// Global variables
let currentDoctor = null;
let selectedMedicines = [];
let medicineDatabase = [];
let reports = [];

// Sample medicine database (in real app, this would come from an API)
const sampleMedicines = [
    {
        id: 1,
        name: "Paracetamol",
        company: "GSK",
        useCase: "Fever, Pain relief",
        strength: "500mg"
    },
    {
        id: 2,
        name: "Ibuprofen",
        company: "Pfizer",
        useCase: "Pain, Inflammation",
        strength: "400mg"
    },
    {
        id: 3,
        name: "Amoxicillin",
        company: "Cipla",
        useCase: "Bacterial infections",
        strength: "250mg"
    },
    {
        id: 4,
        name: "Omeprazole",
        company: "Dr. Reddy's",
        useCase: "Acid reflux, Ulcers",
        strength: "20mg"
    },
    {
        id: 5,
        name: "Cetirizine",
        company: "Sun Pharma",
        useCase: "Allergies, Hay fever",
        strength: "10mg"
    },
    {
        id: 6,
        name: "Metformin",
        company: "Torrent",
        useCase: "Diabetes",
        strength: "500mg"
    },
    {
        id: 7,
        name: "Amlodipine",
        company: "Cadila",
        useCase: "High blood pressure",
        strength: "5mg"
    },
    {
        id: 8,
        name: "Atorvastatin",
        company: "Lupin",
        useCase: "High cholesterol",
        strength: "10mg"
    },
    {
        id: 9,
        name: "Azithromycin",
        company: "Zydus",
        useCase: "Bacterial infections",
        strength: "250mg"
    },
    {
        id: 10,
        name: "Diclofenac",
        company: "Alkem",
        useCase: "Pain, Arthritis",
        strength: "50mg"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadStoredData();
});

function initializeApp() {
    medicineDatabase = sampleMedicines;
    showSection('welcome');
}

function setupEventListeners() {
    // Doctor signup form
    document.getElementById('doctorSignupForm').addEventListener('submit', handleDoctorSignup);
    
    // Doctor login form
    document.getElementById('doctorLoginForm').addEventListener('submit', handleDoctorLogin);
    
    // Report form
    document.getElementById('reportForm').addEventListener('submit', handleReportGeneration);
    
    // Patient search form
    document.getElementById('patientSearchForm').addEventListener('submit', handlePatientSearch);
    
    // Medicine search
    const medicineSearch = document.getElementById('medicineSearch');
    if (medicineSearch) {
        medicineSearch.addEventListener('input', handleMedicineSearch);
        medicineSearch.addEventListener('focus', handleMedicineSearch);
    }
    
    // Logo upload
    const logoFileInput = document.getElementById('clinicLogoFile');
    if (logoFileInput) {
        logoFileInput.addEventListener('change', handleLogoUpload);
    }
    
    // Logo URL input
    const logoUrlInput = document.getElementById('clinicLogo');
    if (logoUrlInput) {
        logoUrlInput.addEventListener('input', handleLogoUrlChange);
    }
    
    // Real-time preview updates
    setupRealTimePreview();
}

function loadStoredData() {
    // Load doctors from localStorage
    const storedDoctors = localStorage.getItem('healthXConnect_doctors');
    if (storedDoctors) {
        window.doctors = JSON.parse(storedDoctors);
    } else {
        window.doctors = [];
    }
    
    // Load reports from localStorage
    const storedReports = localStorage.getItem('healthXConnect_reports');
    if (storedReports) {
        reports = JSON.parse(storedReports);
    }
}

// Section navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Doctor signup handler
function handleDoctorSignup(e) {
    e.preventDefault();
    
    const formData = {
        clinicName: document.getElementById('clinicName').value,
        clinicAddress: document.getElementById('clinicAddress').value,
        clinicPhone: document.getElementById('clinicPhone').value,
        clinicLogo: document.getElementById('clinicLogo').value,
        doctorName: document.getElementById('doctorName').value,
        qualification: document.getElementById('qualification').value,
        doctorId: document.getElementById('doctorId').value,
        password: document.getElementById('password').value
    };
    
    // Check if doctor ID already exists
    if (window.doctors.find(doc => doc.doctorId === formData.doctorId)) {
        alert('Doctor ID already exists. Please choose a different ID.');
        return;
    }
    
    // Add doctor to storage
    window.doctors.push(formData);
    localStorage.setItem('healthXConnect_doctors', JSON.stringify(window.doctors));
    
    alert('Registration successful! Please login.');
    showSection('doctor-login');
    
    // Clear form
    e.target.reset();
}

// Doctor login handler
function handleDoctorLogin(e) {
    e.preventDefault();
    
    const doctorId = document.getElementById('loginDoctorId').value;
    const password = document.getElementById('loginPassword').value;
    
    const doctor = window.doctors.find(doc => 
        doc.doctorId === doctorId && doc.password === password
    );
    
    if (doctor) {
        currentDoctor = doctor;
        document.getElementById('loggedDoctorName').textContent = doctor.doctorName;
        document.getElementById('loggedClinicName').textContent = doctor.clinicName;
        showSection('doctor-dashboard');
        
        // Clear form
        e.target.reset();
    } else {
        alert('Invalid Doctor ID or Password');
    }
}

// Medicine search handler
async function handleMedicineSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const suggestionsContainer = document.getElementById('medicineSuggestions');

    if (searchTerm.length < 2) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    // Fetch from API
    try {
        const response = await fetch(`http://localhost:3001/api/medicines?search=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error('API error');
        const filteredMedicines = await response.json();
        displayMedicineSuggestions(filteredMedicines);
    } catch (error) {
        // Fallback to local search if API fails
        const filteredMedicines = medicineDatabase.filter(medicine =>
            medicine.name.toLowerCase().includes(searchTerm) ||
            medicine.company.toLowerCase().includes(searchTerm) ||
            medicine.useCase.toLowerCase().includes(searchTerm)
        );
        displayMedicineSuggestions(filteredMedicines);
    }
}

function displayMedicineSuggestions(medicines) {
    const suggestionsContainer = document.getElementById('medicineSuggestions');
    
    if (medicines.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    suggestionsContainer.innerHTML = '';
    medicines.forEach(medicine => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.innerHTML = `
            <div><strong>${medicine.name}</strong> - ${medicine.strength}</div>
            <div style="font-size: 0.9rem; color: #666;">
                ${medicine.company} | ${medicine.useCase}
            </div>
        `;
        suggestionItem.addEventListener('click', () => selectMedicine(medicine));
        suggestionsContainer.appendChild(suggestionItem);
    });
    
    suggestionsContainer.style.display = 'block';
}

function selectMedicine(medicine) {
    // Hide suggestions
    document.getElementById('medicineSuggestions').style.display = 'none';
    document.getElementById('medicineSearch').value = '';
    
    // Show medicine modal
    showMedicineModal(medicine);
}

function showMedicineModal(medicine) {
    const modal = document.getElementById('medicineModal');
    const detailsContainer = document.getElementById('selectedMedicineDetails');
    
    detailsContainer.innerHTML = `
        <h4>${medicine.name}</h4>
        <p><strong>Company:</strong> ${medicine.company}</p>
        <p><strong>Strength:</strong> ${medicine.strength}</p>
        <p><strong>Use Case:</strong> ${medicine.useCase}</p>
    `;
    
    // Store selected medicine temporarily
    window.tempSelectedMedicine = medicine;
    
    // Reset checkboxes
    document.querySelectorAll('.checkbox-label input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    document.getElementById('dosageInstructions').value = '';
    
    modal.style.display = 'block';
}

function closeMedicineModal() {
    document.getElementById('medicineModal').style.display = 'none';
    window.tempSelectedMedicine = null;
}

function addMedicineToList() {
    const medicine = window.tempSelectedMedicine;
    if (!medicine) return;
    
    // Get selected timings
    const selectedTimings = [];
    document.querySelectorAll('.checkbox-label input[type="checkbox"]:checked').forEach(cb => {
        selectedTimings.push(cb.value);
    });
    
    if (selectedTimings.length === 0) {
        alert('Please select at least one dosage timing.');
        return;
    }
    
    const instructions = document.getElementById('dosageInstructions').value;
    
    const medicineWithTiming = {
        ...medicine,
        timings: selectedTimings,
        instructions: instructions
    };
    
    selectedMedicines.push(medicineWithTiming);
    updateSelectedMedicinesDisplay();
    updateReportPreview();
    
    closeMedicineModal();
}

function updateSelectedMedicinesDisplay() {
    const container = document.getElementById('selectedMedicines');
    
    if (selectedMedicines.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center;">No medicines added yet</p>';
        return;
    }
    
    container.innerHTML = selectedMedicines.map((medicine, index) => `
        <div class="medicine-item">
            <div class="medicine-info">
                <h5>${medicine.name} - ${medicine.strength}</h5>
                <p>${medicine.company} | ${medicine.useCase}</p>
                <p class="medicine-timing">Timing: ${medicine.timings.join(', ')}</p>
                ${medicine.instructions ? `<p><em>${medicine.instructions}</em></p>` : ''}
            </div>
            <button class="remove-medicine" onclick="removeMedicine(${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function removeMedicine(index) {
    selectedMedicines.splice(index, 1);
    updateSelectedMedicinesDisplay();
    updateReportPreview();
}

// Real-time preview setup
function setupRealTimePreview() {
    const patientName = document.getElementById('patientName');
    const patientId = document.getElementById('patientId');
    const patientPhone = document.getElementById('patientPhone');
    const diagnosis = document.getElementById('diagnosis');
    
    [patientName, patientId, patientPhone, diagnosis].forEach(element => {
        if (element) {
            element.addEventListener('input', updateReportPreview);
        }
    });
}

function updateReportPreview() {
    const previewContainer = document.getElementById('reportPreview');
    
    if (!currentDoctor) return;
    
    const patientName = document.getElementById('patientName')?.value || '';
    const patientId = document.getElementById('patientId')?.value || '';
    const patientPhone = document.getElementById('patientPhone')?.value || '';
    const diagnosis = document.getElementById('diagnosis')?.value || '';
    
    if (!patientName && !patientId && !patientPhone && !diagnosis && selectedMedicines.length === 0) {
        previewContainer.innerHTML = `
            <div class="preview-placeholder">
                <i class="fas fa-file-medical"></i>
                <p>Report preview will appear here</p>
            </div>
        `;
        return;
    }
    
    const previewHTML = generateReportHTML(patientName, patientId, patientPhone, diagnosis, selectedMedicines, true);
    previewContainer.innerHTML = previewHTML;
}

function generateReportHTML(patientName, patientId, patientPhone, diagnosis, medicines, isPreview = false) {
    const doctor = currentDoctor;
    
    return `
        <div class="print-header">
            ${doctor.clinicLogo ? `<img src="${doctor.clinicLogo}" alt="Clinic Logo" style="width: 80px; height: 80px; object-fit: contain; border-radius: 50%; border: 1px solid #ddd;">` : 
            `<div class="clinic-logo"><i class="fas fa-hospital"></i></div>`}
            <h2>${doctor.clinicName}</h2>
            <p>${doctor.clinicAddress}</p>
            <p>Phone: ${doctor.clinicPhone}</p>
            <p><strong>Dr. ${doctor.doctorName} - ${doctor.qualification}</strong></p>
        </div>
        
        <div class="patient-info">
            <div class="section-title">Patient Information</div>
            <p><strong>Name:</strong> ${patientName || '________________'}</p>
            <p><strong>Patient ID:</strong> ${patientId || '________________'}</p>
            <p><strong>Phone:</strong> ${patientPhone || '________________'}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="diagnosis-section">
            <div class="section-title">Diagnosis/Complaints</div>
            <p>${diagnosis || '________________'}</p>
        </div>
        
        <div class="medicines-section">
            <div class="section-title">Prescribed Medicines</div>
            ${medicines.length > 0 ? `
                <ul class="medicine-list">
                    ${medicines.map(medicine => `
                        <li>
                            <strong>${medicine.name} ${medicine.strength}</strong><br>
                            <em>${medicine.company}</em><br>
                            <strong>Timing:</strong> ${medicine.timings.join(', ')}<br>
                            ${medicine.instructions ? `<strong>Instructions:</strong> ${medicine.instructions}` : ''}
                        </li>
                    `).join('')}
                </ul>
            ` : '<p>No medicines prescribed</p>'}
        </div>
        
        <div style="margin-top: 3rem; text-align: center;">
            <p>_________________________</p>
            <p><strong>Doctor's Signature</strong></p>
        </div>
    `;
}

function previewReport() {
    const patientName = document.getElementById('patientName').value;
    const patientId = document.getElementById('patientId').value;
    const patientPhone = document.getElementById('patientPhone').value;
    const diagnosis = document.getElementById('diagnosis').value;
    
    if (!patientName || !patientId || !patientPhone || !diagnosis) {
        alert('Please fill in all patient details and diagnosis before previewing.');
        return;
    }
    
    const printContent = document.getElementById('printContent');
    printContent.innerHTML = generateReportHTML(patientName, patientId, patientPhone, diagnosis, selectedMedicines);
    
    document.getElementById('printModal').style.display = 'block';
}

function closePrintModal() {
    document.getElementById('printModal').style.display = 'none';
}

function printReport() {
    const printWindow = window.open('', '_blank');
    const printContent = document.getElementById('printContent').innerHTML;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Medical Report</title>
            <style>
                body { font-family: 'Times New Roman', serif; margin: 20px; }
                .print-header { text-align: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #333; }
                .clinic-logo { width: 80px; height: 80px; margin: 0 auto 1rem; background: #f0f0f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #666; }
                .section-title { font-weight: bold; font-size: 1.1rem; margin-bottom: 0.5rem; color: #333; }
                .medicine-list { list-style: none; padding: 0; }
                .medicine-list li { padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0; }
                .medicine-list li:last-child { border-bottom: none; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            ${printContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

function downloadReport() {
    const patientName = document.getElementById('patientName').value;
    const patientId = document.getElementById('patientId').value;
    const patientPhone = document.getElementById('patientPhone').value;
    const diagnosis = document.getElementById('diagnosis').value;
    
    const reportText = generateReportText(patientName, patientId, patientPhone, diagnosis, selectedMedicines);
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Medical_Report_${patientName}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateReportText(patientName, patientId, patientPhone, diagnosis, medicines) {
    const doctor = currentDoctor;
    
    return `
MEDICAL REPORT
==============

CLINIC INFORMATION:
${doctor.clinicName}
${doctor.clinicAddress}
Phone: ${doctor.clinicPhone}
Doctor: Dr. ${doctor.doctorName} - ${doctor.qualification}

PATIENT INFORMATION:
Name: ${patientName}
Patient ID: ${patientId}
Phone: ${patientPhone}
Date: ${new Date().toLocaleDateString()}

DIAGNOSIS/COMPLAINTS:
${diagnosis}

PRESCRIBED MEDICINES:
${medicines.length > 0 ? medicines.map(medicine => `
- ${medicine.name} ${medicine.strength}
  Company: ${medicine.company}
  Use Case: ${medicine.useCase}
  Timing: ${medicine.timings.join(', ')}
  ${medicine.instructions ? `Instructions: ${medicine.instructions}` : ''}
`).join('') : 'No medicines prescribed'}

Doctor's Signature: _________________________
Date: ${new Date().toLocaleDateString()}
    `.trim();
}

// Report generation handler
function handleReportGeneration(e) {
    e.preventDefault();
    
    const patientName = document.getElementById('patientName').value;
    const patientId = document.getElementById('patientId').value;
    const patientPhone = document.getElementById('patientPhone').value;
    const diagnosis = document.getElementById('diagnosis').value;
    
    if (!patientName || !patientId || !patientPhone || !diagnosis) {
        alert('Please fill in all required fields.');
        return;
    }
    
    if (selectedMedicines.length === 0) {
        alert('Please add at least one medicine.');
        return;
    }
    
    // Create report
    const report = {
        id: Date.now(),
        patientName,
        patientId,
        patientPhone,
        diagnosis,
        medicines: selectedMedicines,
        doctor: currentDoctor,
        date: new Date().toISOString(),
        reportText: generateReportText(patientName, patientId, patientPhone, diagnosis, selectedMedicines)
    };
    
    // Save report
    reports.push(report);
    localStorage.setItem('healthXConnect_reports', JSON.stringify(reports));
    
    // Show print modal
    const printContent = document.getElementById('printContent');
    printContent.innerHTML = generateReportHTML(patientName, patientId, patientPhone, diagnosis, selectedMedicines);
    document.getElementById('printModal').style.display = 'block';
    
    // Clear form
    e.target.reset();
    selectedMedicines = [];
    updateSelectedMedicinesDisplay();
    updateReportPreview();
}

// Patient search handler
function handlePatientSearch(e) {
    e.preventDefault();
    
    const patientId = document.getElementById('searchPatientId').value;
    const patientPhone = document.getElementById('searchPatientPhone').value;
    
    const patientReports = reports.filter(report => 
        report.patientId === patientId && report.patientPhone === patientPhone
    );
    
    if (patientReports.length === 0) {
        alert('No reports found for the given Patient ID and Phone Number.');
        return;
    }
    
    displayPatientReports(patientReports);
    showSection('patient-reports');
    
    // Clear form
    e.target.reset();
}

function displayPatientReports(patientReports) {
    const reportsList = document.getElementById('reportsList');
    
    reportsList.innerHTML = patientReports.map(report => `
        <div class="report-item">
            <div class="report-info">
                <h4>${report.patientName}</h4>
                <p><strong>Patient ID:</strong> ${report.patientId}</p>
                <p><strong>Date:</strong> ${new Date(report.date).toLocaleDateString()}</p>
                <p><strong>Doctor:</strong> Dr. ${report.doctor.doctorName}</p>
                <p><strong>Diagnosis:</strong> ${report.diagnosis.substring(0, 100)}${report.diagnosis.length > 100 ? '...' : ''}</p>
            </div>
            <button class="btn btn-primary" onclick="downloadPatientReport('${report.id}')">
                <i class="fas fa-download"></i> Download
            </button>
        </div>
    `).join('');
}

function downloadPatientReport(reportId) {
    const report = reports.find(r => r.id == reportId);
    if (!report) return;
    
    const blob = new Blob([report.reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Medical_Report_${report.patientName}_${new Date(report.date).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const printModal = document.getElementById('printModal');
    const medicineModal = document.getElementById('medicineModal');
    
    if (e.target === printModal) {
        closePrintModal();
    }
    
    if (e.target === medicineModal) {
        closeMedicineModal();
    }
});

// Logo upload handler
function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const logoDataUrl = e.target.result;
        showLogoPreview(logoDataUrl);
        document.getElementById('clinicLogo').value = logoDataUrl;
    };
    reader.readAsDataURL(file);
}

// Logo URL change handler
function handleLogoUrlChange(e) {
    const url = e.target.value.trim();
    if (url) {
        // Validate URL
        try {
            new URL(url);
            showLogoPreview(url);
        } catch (error) {
            // If not a valid URL, clear the preview
            hideLogoPreview();
        }
    } else {
        hideLogoPreview();
    }
}

// Show logo preview
function showLogoPreview(src) {
    const preview = document.getElementById('logoPreview');
    const previewImg = document.getElementById('logoPreviewImg');
    
    previewImg.src = src;
    preview.style.display = 'block';
}

// Hide logo preview
function hideLogoPreview() {
    const preview = document.getElementById('logoPreview');
    preview.style.display = 'none';
}

// Remove logo
function removeLogo() {
    document.getElementById('clinicLogoFile').value = '';
    document.getElementById('clinicLogo').value = '';
    hideLogoPreview();
}

// Close suggestions when clicking outside
document.addEventListener('click', function(e) {
    const suggestions = document.getElementById('medicineSuggestions');
    const searchInput = document.getElementById('medicineSearch');
    
    if (suggestions && !searchInput.contains(e.target) && !suggestions.contains(e.target)) {
        suggestions.style.display = 'none';
    }
}); 