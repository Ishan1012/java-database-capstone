# Smart Clinic Management System - Database Design

## MySQL Database Design
The relational database handles core entities where data integrity and relationships are critical.

### Table: admins
- **id**: INT, Primary Key, Auto Increment
- **username**: VARCHAR(50), Unique, Not Null
- **password_hash**: VARCHAR(255), Not Null (encrypted)
- **email**: VARCHAR(100), Unique

### Table: doctors
- **id**: INT, Primary Key, Auto Increment
- **first_name**: VARCHAR(50), Not Null
- **last_name**: VARCHAR(50), Not Null
- **specialization**: VARCHAR(100)
- **email**: VARCHAR(100), Unique
- **phone**: VARCHAR(15)

### Table: patients
- **id**: INT, Primary Key, Auto Increment
- **first_name**: VARCHAR(50), Not Null
- **last_name**: VARCHAR(50), Not Null
- **date_of_birth**: DATE, Not Null
- **email**: VARCHAR(100), Unique
- **phone**: VARCHAR(15)

### Table: appointments
- **id**: INT, Primary Key, Auto Increment
- **doctor_id**: INT, Foreign Key → doctors(id) ON DELETE CASCADE
- **patient_id**: INT, Foreign Key → patients(id) ON DELETE CASCADE
- **appointment_time**: DATETIME, Not Null
- **status**: INT (0 = Scheduled, 1 = Completed, 2 = Cancelled)
- **notes_ref_id**: VARCHAR(24) (Optional: Link to MongoDB document ID)

---

## MongoDB Collection Design
MongoDB stores the flexible, content-heavy data that doesn't require strict relational constraints.

### Collection: prescriptions
This collection stores detailed medical instructions and medication lists. We use MongoDB because the number of medications per visit varies wildly.

**Example Document:**
```json
{
  "_id": "64abc123456",
  "appointmentId": 101,
  "patientId": 5,
  "dateIssued": "2026-04-08T10:30:00Z",
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "Three times daily",
      "duration": "7 days"
    },
    {
      "name": "Ibuprofen",
      "dosage": "200mg",
      "frequency": "As needed for pain"
    }
  ],
  "vitals_at_visit": {
    "blood_pressure": "120/80",
    "weight_kg": 72.5
  },
  "tags": ["Urgent", "Follow-up Required"]
}
```

### Collection: doctor_notes
Used for free-form clinical observations and history.

**Example Document:**

```JSON
{
  "_id": "64def789012",
  "appointmentId": 101,
  "content": "Patient reports mild chest pain after exercise. EKG looks normal.",
  "attachments": [
    {"type": "image", "url": "s3://clinic-bucket/ekg_scan_101.jpg"}
  ]
}
```