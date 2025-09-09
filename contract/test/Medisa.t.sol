// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test, console} from "forge-std/Test.sol";
import {Medisa} from "../src/Medisa.sol";

contract MedisaTest is Test {
    Medisa medisa;

    address owner = address(0x1);
    address hospital1 = address(0x2);
    address hospital2 = address(0x3);
    address patient1 = address(0x4);
    address patient2 = address(0x5);

    function setUp() public {
        vm.startPrank(owner);
        medisa = new Medisa();
        vm.stopPrank();
    }

    function testOwnerRegistersHospital() public {
        vm.prank(owner);
        medisa.registerHospital(hospital1, "City Hospital");

        string memory name = medisa.hospitals(hospital1);
        assertEq(name, "City Hospital");
    }

    function testHospitalCreatesRecord() public {
        vm.startPrank(owner);
        medisa.registerHospital(hospital1, "City Hospital");
        vm.stopPrank();

        vm.startPrank(hospital1);
        medisa.createRecord("Patient has flu", patient1, hospital1);
        vm.stopPrank();

        // fetch record
        (
            address patient,
            string memory data,
            address hosp,
            string memory hospName,

        ) = medisa.patientRecords(patient1, 0);

        assertEq(patient, patient1);
        assertEq(data, "Patient has flu");
        assertEq(hosp, hospital1);
        assertEq(hospName, "City Hospital");
    }

    function testHospitalRequestsAccess() public {
        // register hospital & create a record
        vm.prank(owner);
        medisa.registerHospital(hospital1, "City Hospital");

        vm.startPrank(hospital1);
        medisa.createRecord("Patient has fever", patient1, hospital1);
        medisa.requestAccess(patient1, hospital1, "Follow-up treatment");
        vm.stopPrank();

        (string memory reason, bool approved, bool exists) = medisa
            .getAccessRequest(hospital1, patient1);

        assertEq(reason, "Follow-up treatment");
        assertEq(approved, false);
        assertEq(exists, true);
    }

    function testPatientApprovesAccess() public {
        // register hospital & create a record
        vm.prank(owner);
        medisa.registerHospital(hospital1, "City Hospital");

        vm.startPrank(hospital1);
        medisa.createRecord("Patient has cough", patient1, hospital1);
        medisa.requestAccess(patient1, hospital1, "Checkup history");
        vm.stopPrank();

        vm.prank(patient1);
        medisa.approveAccess(hospital1);

        (, bool approved, ) = medisa.getAccessRequest(hospital1, patient1);
        assertTrue(approved);
    }

    function testHospitalViewsRecordsAfterApproval() public {
        // register hospital & create a record
        vm.prank(owner);
        medisa.registerHospital(hospital1, "City Hospital");

        vm.startPrank(hospital1);
        medisa.createRecord("Patient has headache", patient1, hospital1);
        medisa.requestAccess(patient1, hospital1, "Need medical history");
        vm.stopPrank();

        vm.prank(patient1);
        medisa.approveAccess(hospital1);

        vm.prank(hospital1);
        Medisa.MedicalRecord[] memory records = medisa.viewRecords(patient1);

        assertEq(records.length, 1);
        assertEq(records[0].data, "Patient has headache");
    }
}
