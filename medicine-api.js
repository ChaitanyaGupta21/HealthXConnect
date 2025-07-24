const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Sample medicine database (same as in script.js)
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

// GET /api/medicines?search=term
app.get('/api/medicines', (req, res) => {
    const search = (req.query.search || '').toLowerCase();
    if (!search || search.length < 2) {
        return res.json([]);
    }
    const filtered = sampleMedicines.filter(med =>
        med.name.toLowerCase().includes(search) ||
        med.company.toLowerCase().includes(search) ||
        med.useCase.toLowerCase().includes(search)
    );
    res.json(filtered);
});

app.listen(PORT, () => {
    console.log(`Medicine API server running on http://localhost:${PORT}`);
}); 