# 🩸 LifeFlow PRO  
## Emergency Blood Coordination & Temporal Integrity–Driven Blood Bank Management System

---

## 📌 Project Overview

**LifeFlow PRO** is an Emergency Blood Coordination Platform designed to bridge the gap between life-saving donors and urgent medical needs. It operates as a **Temporal Integrity–Driven Blood Bank Management System**, ensuring patient safety through automated biological and operational constraints enforced directly at the database level.

---

## ⭐ Core Strength: Temporal Integrity

Unlike traditional systems that rely on manual validation, LifeFlow PRO enforces automated safety rules using PostgreSQL triggers and constraints.

### ✅ Biological Eligibility Cycles
- **Male Donors** → 90-day mandatory recovery cycle  
- **Female Donors** → 120-day mandatory recovery cycle  
- `next_eligible_date` is automatically calculated after every donation  

### ✅ Automated Expiry Tracking
- **Platelets** → 5-day shelf life  
- **Whole Blood** → 35-day shelf life  
- **Plasma** → 365-day shelf life  
- Expiry dates are dynamically calculated using SQL triggers  

### ✅ Transfusion Safety Enforcement
- Prevents issuance of:
  - Units marked as **Expired**
  - Units already marked as **Issued**
- A database-level trigger raises an exception if a violation occurs  

---

# 🏗 System Architecture

## 1️⃣ Frontend — React.js

The frontend provides interfaces for both public donors and administrative staff.

### 👤 Donor Portal
- Donor registration
- Eligibility tracking
- View live blood inventory status

### 🛠 Admin Dashboard
- Real-time inventory management
- Donor record management
- Blood request monitoring
- Center coordination management

---

## 2️⃣ Backend — Node.js & Express

A modular architecture separates system responsibilities:

- `donorRoutes.js` → Manages donor registration & eligibility checks  
- `inventoryRoutes.js` → Handles blood unit logging & FIFO status updates  
- `requestRoutes.js` → Processes urgent blood unit requirements  

---

## 3️⃣ Database — PostgreSQL

A relational schema enhanced with ENUM types, triggers, and constraints to ensure strict integrity.

### 🔹 Custom ENUM Types
- `blood_group_type`
- `inventory_status`
- `request_status`
- `user_role`

### 🔹 Integrity Controls
- SQL Triggers
- Unique Constraints
- Transaction-level exception handling

---

# 🚀 Key Feature Modules

## A. 🧬 Smart Donor Registration

- Captures biological data (Gender, Blood Group)
- Tracks donor history
- Automatically restricts donation if `next_eligible_date` has not passed
- Prevents multiple donations on the same calendar day via unique constraint

---

## B. 🏥 Live Inventory & FIFO Management

Tracks blood units from collection to issuance.

### 🔄 FIFO (First-In, First-Out)
- Inventory sorted by `expiry_date`
- Older safe units issued before newer units

### 📝 Audit Logging
- Every inventory status change is recorded
- Example transitions:
  - Available → Issued
  - Available → Expired
- Stored in `Inventory_Audit_Log` for accountability

---

## C. 🚨 Urgent Request Coordination

- Requesters submit urgent needs specifying:
  - Blood group
  - Component type
- System queries live inventory instantly
- Matches available and safe units in real time

---

# ⚙ Technical Specifications & Constraints

System integrity is maintained through automated biological and operational rules embedded within PostgreSQL.

## 🧑‍⚕ Gender-Specific Eligibility Enforcement

### Male Donor Rule
- 90-day recovery cycle
- `next_eligible_date = last_donation_date + INTERVAL '90 days'`
- Enforced via SQL Trigger

### Female Donor Rule
- 120-day recovery cycle
- `next_eligible_date = last_donation_date + INTERVAL '120 days'`
- Enforced via SQL Trigger

---

## 🧪 Automated Component Expiry Management

### Platelets
- `expiry_date = collection_date + INTERVAL '5 days'`

### Whole Blood
- `expiry_date = collection_date + INTERVAL '35 days'`

### Plasma
- `expiry_date = collection_date + INTERVAL '365 days'`

All expiry calculations are handled automatically via SQL triggers.

---

## 🛑 Fail-Safe Safety Block

A critical SQL trigger prevents unsafe medical actions:

- Raises an exception if:
  - Unit status = **Expired**
  - Unit status = **Issued**
- Blocks transaction immediately

---

## ⏳ Temporal Donation Guard

- Unique constraint on (`donor_id`, `donation_date`)
- Prevents multiple donations by the same donor on the same day

---

# 🔐 Security & Safety

## 🔒 Data Protection
- Donor data is encrypted
- Used strictly for medical coordination

## 👥 Role-Based Access Control (RBAC)
- Distinct user roles:
  - Admin
  - Staff
- Prevents unauthorized inventory modification

## 🧬 Biological Guardrails
- Automated SQL-level safety validations
- Prevents human error during emergency requests

---

# 🏁 Conclusion

LifeFlow PRO ensures patient safety, operational efficiency, and biological compliance through **database-level temporal integrity enforcement**, making it a reliable and intelligent emergency blood coordination system.