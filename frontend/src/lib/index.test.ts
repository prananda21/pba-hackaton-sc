import { describe, it, expect, beforeAll } from "vitest";
import { BlockchainRegistry } from "./index";

const PRIVATE_KEY = process.env.TEST_PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Dummy addresses for testing (replace with real ones for integration)
const testHospital = "0x0000000000000000000000000000000000000001";
const testPatient = "0x0000000000000000000000000000000000000002";
const testHospitalName = "Test Hospital";
const testData = "Test Medical Data";
const testReason = "Test Reason";
import "dotenv/config";

let registry: BlockchainRegistry;

beforeAll(async () => {
  registry = new BlockchainRegistry();
  await registry.setupProvider();
});

describe("BlockchainRegistry", () => {
  it("should register a hospital", async () => {
    await expect(
      registry.admin.register(testHospital, testHospitalName)
    ).resolves.not.toThrow();
  });

  it("should create a record", async () => {
    await expect(
      registry.hospital.recordCreation(testData, testPatient, testHospital)
    ).resolves.not.toThrow();
  });

  it("should request access", async () => {
    await expect(
      registry.hospital.requestAccess(testPatient, testHospital, testReason)
    ).resolves.not.toThrow();
  });

  it("should approve access", async () => {
    await expect(
      registry.patient.response.approve(testHospital)
    ).resolves.not.toThrow();
  });

  it("should deny access", async () => {
    await expect(
      registry.patient.response.reject(testHospital)
    ).resolves.not.toThrow();
  });

  it("should view records", async () => {
    await expect(
      registry.hospital.viewRecords(testPatient)
    ).resolves.not.toThrow();
  });

  it("should get access request info", async () => {
    await expect(
      registry.patient.getAccessRequests(testHospital, testPatient)
    ).resolves.not.toThrow();
  });
});
