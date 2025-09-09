# Medisa Smart Contract

The **Medisa** smart contract is a decentralized medical record and consent management system built on Paseo Passethub. It allows patients, hospitals, and an owner (admin) to interact securely with medical data while enforcing consent-based access control.

---

## Features

- **Hospital Registration**  
  - Only the contract owner can register hospitals with their names.  
  - Registered hospitals can issue medical records and request consent.

- **Medical Records**  
  - Hospitals can issue medical records for patients.  
  - Each record contains: patient, hospital, hospital name, data, and timestamp.  
  - Patients can view their own records.  
  - Hospitals can view patient records only if consent is approved.

- **Consent Management**  
  - Hospitals can request consent from patients to view their records.  
  - Patients can approve, deny, or revoke consent.  
  - Consent requests include: hospital, patient, reason, approval status, and timestamp.  

- **Access Control**  
  - Only registered hospitals can issue records or request consent.  
  - Only patients or authorized hospitals can view patient records.  

---

## Key Functions

### Hospital Management

- `registerHospital(address _hospital, string _hospitalName)`  
  Register a new hospital (owner only).

### Records

- `issueRecord(string _data, address _patient)`  
  Hospital issues a new medical record for a patient.  

- `viewRecords(address _patient)`  
  View a patient's records (patient themselves or approved hospitals).  

- `getPatientRecords()`  
  Patient retrieves their own records.  

### Consent

- `requestConsent(address _patient, string _reason)`  
  Hospital requests access to a patient’s records.  

- `approveConsent(address _hospital)`  
  Patient approves hospital’s request.  

- `denyConsent(address _hospital)`  
  Patient denies hospital’s request.  

- `revokeConsent(address _hospital)`  
  Patient revokes previously granted consent.  

- `getConsentRequest(address _hospital, address _patient)`  
  Get consent request details (hospital or patient only).  

- `getPatientConsentRequests()`  
  Patient retrieves list of hospitals that requested consent.  

- `getMyConsentRequest(address _patient)`  
  Hospital retrieves their own consent request for a specific patient.  

---

## Events

- `RecordCreated(address patient)`  
- `ConsentRequested(address hospital, address patient, string reason)`  
- `ConsentApproved(address hospital, address patient)`  
- `ConsentDenied(address hospital, address patient)`  

---

## Roles

- **Owner** → Registers hospitals.  
- **Hospitals** → Issue medical records, request access.  
- **Patients** → Manage records and control hospital access via consent.  

---

## License

This project is licensed under the MIT License.
