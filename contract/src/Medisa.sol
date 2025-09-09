// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract Medisa {
    struct MedicalRecord {
        address patient;
        string data;
        address hospital;
        string hospitalName;
        uint256 timestamp;
    }

    struct ConsentRequest {
        address hospital;
        address patient;
        string reason;
        bool approved;
        bool exists;
        uint256 timestamp;
    }

    // Storage
    mapping(address => MedicalRecord[]) private patientRecords;
    mapping(address => mapping(address => ConsentRequest))
        private consentRequests;
    mapping(address => string) public hospitals;
    mapping(address => address[]) private patientConsentRequests;

    address public owner;

    event RecordCreated(address indexed patient);
    event ConsentRequested(
        address indexed hospital,
        address indexed patient,
        string reason
    );
    event ConsentApproved(address indexed hospital, address indexed patient);
    event ConsentDenied(address indexed hospital, address indexed patient);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyHospital() {
        require(
            bytes(hospitals[msg.sender]).length > 0,
            "Not registered hospital"
        );
        _;
    }

    modifier onlyPatientOrApprovedHospital(address _patient) {
        require(
            msg.sender == _patient ||
                (bytes(hospitals[msg.sender]).length > 0 &&
                    consentRequests[msg.sender][_patient].approved),
            "Not authorized"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Owner registers hospitals
    function registerHospital(
        address _hospital,
        string memory _hospitalName
    ) external onlyOwner {
        hospitals[_hospital] = _hospitalName;
    }

    // Patient creates their medical record
    function issueRecord(
        string memory _data,
        address _patient
    ) external onlyHospital {
        patientRecords[_patient].push(
            MedicalRecord({
                patient: _patient,
                data: _data,
                hospital: msg.sender,
                hospitalName: hospitals[msg.sender],
                timestamp: block.timestamp
            })
        );

        emit RecordCreated(_patient);
    }

    // Hospital requests access to patient record
    function requestConsent(
        address _patient,
        string memory _reason
    ) external onlyHospital {
        require(patientRecords[_patient].length > 0, "Patient has no records");
        require(
            !consentRequests[msg.sender][_patient].exists,
            "Request already exists"
        );

        consentRequests[msg.sender][_patient] = ConsentRequest({
            hospital: msg.sender,
            patient: _patient,
            reason: _reason,
            approved: false,
            exists: true,
            timestamp: block.timestamp
        });

        patientConsentRequests[_patient].push(msg.sender);

        emit ConsentRequested(msg.sender, _patient, _reason);
    }

    // Patient approves hospital access
    function approveConsent(address _hospital) external {
        require(
            consentRequests[_hospital][msg.sender].exists,
            "No request found"
        );
        require(
            !consentRequests[_hospital][msg.sender].approved,
            "Already approved"
        );

        consentRequests[_hospital][msg.sender].approved = true;

        emit ConsentApproved(_hospital, msg.sender);
    }

    // Patient denies hospital access
    function denyConsent(address _hospital) external {
        require(
            consentRequests[_hospital][msg.sender].exists,
            "No request found"
        );

        consentRequests[_hospital][msg.sender].approved = false;

        emit ConsentDenied(_hospital, msg.sender);
    }

    function revokeConsent(address _hospital) external {
        require(
            consentRequests[_hospital][msg.sender].exists,
            "No request found"
        );

        consentRequests[_hospital][msg.sender].approved = false;

        emit ConsentDenied(_hospital, msg.sender);
    }

    // Hospital views patient record (if approved)
    function viewRecords(
        address _patient
    )
        external
        view
        onlyPatientOrApprovedHospital(_patient)
        returns (MedicalRecord[] memory)
    {
        return patientRecords[_patient];
    }

    function hasRecord(address _patient) external view returns (bool) {
        return patientRecords[_patient].length > 0;
    }

    function getConsentRequest(
        address _hospital,
        address _patient
    ) external view returns (string memory reason, bool approved, bool exists) {
        require(
            msg.sender == _patient || msg.sender == _hospital,
            "Not authorized to view request"
        );
        ConsentRequest memory request = consentRequests[_hospital][_patient];
        return (request.reason, request.approved, request.exists);
    }

    function getPatientRecords()
        external
        view
        returns (MedicalRecord[] memory)
    {
        return patientRecords[msg.sender];
    }

    function getPatientConsentRequests()
        external
        view
        returns (address[] memory)
    {
        return patientConsentRequests[msg.sender];
    }

    function getMyConsentRequest(
        address _patient
    ) external view onlyHospital returns (ConsentRequest memory) {
        return consentRequests[msg.sender][_patient];
    }
}
