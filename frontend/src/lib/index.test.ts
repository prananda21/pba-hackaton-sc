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

  it("should issue a record", async () => {
    try {
      const result = await registry.hospital.recordCreation(
        testHospital,
        testData,
        testPatient
      );
      expect(result).toBeDefined();
    } catch (err) {
      console.error("issueRecord error:", err);
      throw err;
    }
  });

  it("should request consent", async () => {
    try {
      const result = await registry.hospital.requestAccess(
        testHospital,
        testPatient,
        testReason
      );
      expect(result).toBeDefined();
    } catch (err) {
      console.error("requestConsent error:", err);
      throw err;
    }
  });

  it("should approve consent", async () => {
    try {
      const result = await registry.patient.response.approve(
        testPatient,
        testHospital
      );
      expect(result).toBeDefined();
    } catch (err) {
      console.error("approveConsent error:", err);
      throw err;
    }
  });

  it("should deny consent", async () => {
    try {
      const result = await registry.patient.response.reject(
        testPatient,
        testHospital
      );
      expect(result).toBeDefined();
    } catch (err) {
      console.error("denyConsent error:", err);
      throw err;
    }
  });
});
