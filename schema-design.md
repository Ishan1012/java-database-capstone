## Section 1: MySQL Relational Database Design
The following tables handle structured data where data integrity and relationships are critical.

### 1. Patients Table
| Column | Data Type | Constraints |
| :--- | :--- | :--- |
| patient_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| first_name | VARCHAR(50) | NOT NULL |
| last_name | VARCHAR(50) | NOT NULL |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| date_of_birth | DATE | NOT NULL |

### 2. Doctors Table
| Column | Data Type | Constraints |
| :--- | :--- | :--- |
| doctor_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| specialty | VARCHAR(50) | NOT NULL |
| email | VARCHAR(100) | UNIQUE, NOT NULL |

### 3. Appointments Table
| Column | Data Type | Constraints |
| :--- | :--- | :--- |
| appointment_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| patient_id | BIGINT | FOREIGN KEY (Patients), NOT NULL |
| doctor_id | BIGINT | FOREIGN KEY (Doctors), NOT NULL |
| appointment_date | DATETIME | NOT NULL |
| status | VARCHAR(20) | NOT NULL (e.g., PLANNED, COMPLETED) |

### 4. Admin Table
| Column | Data Type | Constraints |
| :--- | :--- | :--- |
| admin_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL |

---

## Section 2: MongoDB Document Collection Design
We use **MongoDB** for **Prescriptions** because medical scripts vary in complexity. Some may have one medication, while others have multiple with specific dosages, which fits a flexible JSON structure better than a rigid table.

### Collection: `prescriptions`
**Example Document:**
```json
{
  "prescription_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "appointment_id": 105,
  "doctor_name": "Dr. Smith",
  "patient_id": 50,
  "date_issued": "2026-04-08",
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "7 days"
    },
    {
      "name": "Ibuprofen",
      "dosage": "200mg",
      "frequency": "As needed for pain",
      "duration": "3 days"
    }
  ],
  "notes": "Patient should rest and drink plenty of fluids."
}