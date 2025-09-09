// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import "../src/Medisa.sol";

contract MedisaTest is Test {
    Medisa medisa;
    address owner = address(0x1);
    address hospital = address(0x2);
    address patient = address(0x3);

    function setUp() public {
        vm.startPrank(owner);
        medisa = new Medisa();
        medisa.registerHospital(hospital, "General Hospital");
        vm.stopPrank();
    }

    function testRegisterHospital() public view {
        assertEq(medisa.hospitals(hospital), "General Hospital");
    }

    function testIssueRecord() public {
        vm.startPrank(hospital);
        medisa.issueRecord("Blood Test Result: Normal", patient);
        vm.stopPrank();

        assertTrue(medisa.hasRecord(patient));
    }

    function testConsentFlow() public {
        // Hospital issues record first
        vm.startPrank(hospital);
        medisa.issueRecord("MRI Scan", patient);
        medisa.requestConsent(patient, "Research purposes");
        vm.stopPrank();

        // Patient approves
        vm.startPrank(patient);
        medisa.approveConsent(hospital);
        vm.stopPrank();

        // Hospital views patient records
        vm.startPrank(hospital);
        Medisa.MedicalRecord[] memory records = medisa.viewRecords(patient);
        vm.stopPrank();

        assertEq(records.length, 1);
        assertEq(records[0].data, "MRI Scan");
    }

    function testConsentDenied() public {
        // Hospital issues record and requests consent
        vm.startPrank(hospital);
        medisa.issueRecord("X-Ray", patient);
        medisa.requestConsent(patient, "Treatment purposes");
        vm.stopPrank();

        // Patient denies
        vm.startPrank(patient);
        medisa.denyConsent(hospital);
        vm.stopPrank();

        // Hospital should not be able to view
        vm.startPrank(hospital);
        vm.expectRevert();
        medisa.viewRecords(patient);
        vm.stopPrank();
    }
}
