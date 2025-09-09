// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {Medisa} from "../src/Medisa.sol";

contract MedisaScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        Medisa medisa = new Medisa();
        vm.stopBroadcast();

        console.log("Medical Record contract deployed at:", address(medisa));
    }
}
