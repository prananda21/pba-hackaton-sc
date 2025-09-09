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

    struct AccessRequest {
        address hospital;
        address patient;
        string reason;
        bool approved;
        bool exists;
        uint256 timestamp;
    }

    // Storage
    mapping(address => MedicalRecord[]) public patientRecords;
    mapping(address => mapping(address => AccessRequest)) public accessRequests;
    mapping(address => string) public hospitals;

    address public owner;

    event RecordCreated(address indexed patient);
    event AccessRequested(
        address indexed hospital,
        address indexed patient,
        string reason
    );
    event AccessApproved(address indexed hospital, address indexed patient);
    event AccessDenied(address indexed hospital, address indexed patient);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyHospital(address _addr) {
        require(bytes(hospitals[_addr]).length > 0, "Not registered hospital");
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
    function createRecord(
        string memory _data,
        address _patient,
        address _hospital
    ) external onlyHospital(_hospital) {
        patientRecords[_patient].push(
            MedicalRecord({
                patient: _patient,
                data: _data,
                hospital: msg.sender,
                hospitalName: hospitals[msg.sender],
                timestamp: block.timestamp
            })
        );

        emit RecordCreated(msg.sender);
    }

    // Hospital requests access to patient record
    function requestAccess(
        address _patient,
        address _hospital,
        string memory _reason
    ) external onlyHospital(_hospital) {
        require(patientRecords[_patient].length > 0, "Patient has no records");

        accessRequests[msg.sender][_patient] = AccessRequest({
            hospital: msg.sender,
            patient: _patient,
            reason: _reason,
            approved: false,
            exists: true,
            timestamp: block.timestamp
        });

        emit AccessRequested(msg.sender, _patient, _reason);
    }

    // Patient approves hospital access
    function approveAccess(address _hospital) external {
        require(
            accessRequests[_hospital][msg.sender].exists,
            "No request found"
        );

        accessRequests[_hospital][msg.sender].approved = true;

        emit AccessApproved(_hospital, msg.sender);
    }

    // Patient denies hospital access
    function denyAccess(address _hospital) external {
        accessRequests[_hospital][msg.sender].approved = false;

        emit AccessDenied(_hospital, msg.sender);
    }

    // Hospital views patient record (if approved)
    function viewRecords(
        address _patient
    ) external view onlyHospital(msg.sender) returns (MedicalRecord[] memory) {
        require(
            accessRequests[msg.sender][_patient].approved,
            "Access not approved"
        );
        return patientRecords[_patient];
    }

    // Helper functions
    function hasRecord(address _patient) external view returns (bool) {
        return patientRecords[_patient].length > 0;
    }

    function getAccessRequest(
        address _hospital,
        address _patient
    ) external view returns (string memory reason, bool approved, bool exists) {
        AccessRequest memory request = accessRequests[_hospital][_patient];
        return (request.reason, request.approved, request.exists);
    }
}
