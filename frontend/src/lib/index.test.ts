import { describe, it, expect, beforeAll } from "vitest";
import { BlockchainRegistry } from "./index";

const PRIVATE_KEY = process.env.NEXT_PUBLIC_TEST_PRIVATE_KEY;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// Dummy addresses for testing (replace with real ones for integration)
const testHospital = "0x0000000000000000000000000000000000000001";
const testPatient = "0x0000000000000000000000000000000000000002";
const testHospitalName = "Test Hospital";
const testData = "Test Medical Data";
const testReason = "Test Reason";

let registry: BlockchainRegistry;

beforeAll(async () => {
  registry = new BlockchainRegistry();
  await registry.setupProvider();
});

describe("BlockchainRegistry", () => {
  it("should register a hospital", async () => {
    try {
      const result = await registry.admin.register(
        testHospital,
        testHospitalName
      );
      expect(result).toBeDefined();
    } catch (err) {
      console.error("register error:", err);
      throw err;
    }
  });

  it("should create a record", async () => {
    try {
      const result = await registry.hospital.recordCreation(
        testData,
        testPatient,
        testHospital
      );
      expect(result).toBeDefined();
    } catch (err) {
      console.error("createRecord error:", err);
      throw err;
    }
  });

  it("should request access", async () => {
    try {
      const result = await registry.hospital.requestAccess(
        testPatient,
        testHospital,
        testReason
      );
      expect(result).toBeDefined();
    } catch (err) {
      console.error("requestAccess error:", err);
      throw err;
    }
  });

  it("should approve access", async () => {
    try {
      const result = await registry.patient.response.approve(testHospital);
      expect(result).toBeDefined();
    } catch (err) {
      console.error("approveAccess error:", err);
      throw err;
    }
  });

  it("should deny access", async () => {
    try {
      const result = await registry.patient.response.reject(testHospital);
      expect(result).toBeDefined();
    } catch (err) {
      console.error("denyAccess error:", err);
      throw err;
    }
  });

  it("should view records", async () => {
    try {
      const result = await registry.hospital.viewRecords(testPatient);
      expect(result).toBeDefined();
    } catch (err) {
      console.error("viewRecords error:", err);
      throw err;
    }
  });

  it("should get access request info", async () => {
    try {
      const result = await registry.patient.getAccessRequests(
        testHospital,
        testPatient
      );
      expect(result).toBeDefined();
    } catch (err) {
      console.error("getAccessRequests error:", err);
      throw err;
    }
  });
});
