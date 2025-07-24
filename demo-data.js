// Demo Data for HealthXConnect
// This file contains sample data to help you test the application

// Sample Doctor Data
const demoDoctor = {
    clinicName: "Shanti Medical Center",
    clinicAddress: "45 MG Road, Andheri East, Mumbai - 400069",
    clinicPhone: "+91 98765 43210",
    clinicLogo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyeiIvPgo8cGF0aCBkPSJNMTIgNkM4LjY5IDYgNiA4LjY5IDYgMTJzMi42OSA2IDYgNiA2LTIuNjkgNi02LTIuNjktNi02LTZ6Ii8+CjxwYXRoIGQ9Ik0xMiAxNEMxMy4xIDExLjkgMTUuOSAxMCAxOSAxMGgtMkMxNC4xIDEwIDEyIDEyLjEgMTIgMTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4K",
    doctorName: "Dr. Priya Sharma",
    qualification: "MBBS, MD (Internal Medicine)",
    doctorId: "demo123",
    password: "password123"
};

// Sample Patient Data
const demoPatient = {
    name: "Amit Verma",
    patientId: "P001",
    phone: "9876543210",
    diagnosis: "Upper respiratory tract infection with mild fever and cough. Patient reports fatigue and loss of appetite for the past 3 days."
};

// Sample Medicines for Testing
const demoMedicines = [
    {
        name: "Paracetamol",
        strength: "500mg",
        company: "GSK",
        useCase: "Fever, Pain relief",
        timings: ["Morning", "Evening"],
        instructions: "Take after meals, 1 tablet"
    },
    {
        name: "Azithromycin",
        strength: "250mg",
        company: "Zydus",
        useCase: "Bacterial infections",
        timings: ["Morning"],
        instructions: "Take on empty stomach, 1 tablet daily for 5 days"
    },
    {
        name: "Cetirizine",
        strength: "10mg",
        company: "Sun Pharma",
        useCase: "Allergies, Hay fever",
        timings: ["Night"],
        instructions: "Take at bedtime, 1 tablet"
    }
];

// Sample Report Data
const demoReport = {
    id: Date.now(),
    patientName: demoPatient.name,
    patientId: demoPatient.patientId,
    patientPhone: demoPatient.phone,
    diagnosis: demoPatient.diagnosis,
    medicines: demoMedicines,
    doctor: demoDoctor,
    date: new Date().toISOString(),
    reportText: `MEDICAL REPORT
==============

CLINIC INFORMATION:
${demoDoctor.clinicName}
${demoDoctor.clinicAddress}
Phone: ${demoDoctor.clinicPhone}
Doctor: ${demoDoctor.doctorName} - ${demoDoctor.qualification}

PATIENT INFORMATION:
Name: ${demoPatient.name}
Patient ID: ${demoPatient.patientId}
Phone: ${demoPatient.phone}
Date: ${new Date().toLocaleDateString()}

DIAGNOSIS/COMPLAINTS:
${demoPatient.diagnosis}

PRESCRIBED MEDICINES:
- Paracetamol 500mg
  Company: GSK
  Use Case: Fever, Pain relief
  Timing: Morning, Evening
  Instructions: Take after meals, 1 tablet

- Azithromycin 250mg
  Company: Zydus
  Use Case: Bacterial infections
  Timing: Morning
  Instructions: Take on empty stomach, 1 tablet daily for 5 days

- Cetirizine 10mg
  Company: Sun Pharma
  Use Case: Allergies, Hay fever
  Timing: Night
  Instructions: Take at bedtime, 1 tablet

Doctor's Signature: _________________________
Date: ${new Date().toLocaleDateString()}`
};

// Function to load demo data
function loadDemoData() {
    // Load demo doctor
    if (!window.doctors) {
        window.doctors = [];
    }
    
    // Check if demo doctor already exists
    const existingDoctor = window.doctors.find(doc => doc.doctorId === demoDoctor.doctorId);
    if (!existingDoctor) {
        window.doctors.push(demoDoctor);
        localStorage.setItem('healthXConnect_doctors', JSON.stringify(window.doctors));
        console.log('Demo doctor account created!');
        console.log('Doctor ID: demo123');
        console.log('Password: password123');
    }
    
    // Load demo report
    if (!window.reports) {
        window.reports = [];
    }
    
    // Check if demo report already exists
    const existingReport = window.reports.find(report => 
        report.patientId === demoReport.patientId && 
        report.patientPhone === demoReport.patientPhone
    );
    
    if (!existingReport) {
        window.reports.push(demoReport);
        localStorage.setItem('healthXConnect_reports', JSON.stringify(window.reports));
        console.log('Demo report created!');
        console.log('Patient ID: P001');
        console.log('Phone: 1234567890');
    }
    
    console.log('Demo data loaded successfully!');
    console.log('You can now test the application with these credentials.');
}

// Auto-load demo data when this file is included
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadDemoData);
    } else {
        loadDemoData();
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        demoDoctor,
        demoPatient,
        demoMedicines,
        demoReport,
        loadDemoData
    };
} 