import { Interface } from "ethers/abi";
import { Contract, JsonRpcProvider, Wallet } from "ethers";
import {} from "ethers";
import { AddressType } from "./utils/type";
import { readFileSync } from "fs";
import { join } from "path";

export class BlockchainRegistry {
  private provider: JsonRpcProvider | null = null;
  private contract: Contract | null = null;
  private wallet: Wallet | null = null;

  private enstablished: boolean = false;

  /**
   * Setup the blockchain provider, wallet, and contract instances every this class instance called
   */
  async setupProvider() {
    // Setup provider connection first
    this.provider = new JsonRpcProvider("// TODO: add the real rpc url here");

    try {
      await this.provider.getNetwork();
      this.enstablished = true;
    } catch (e) {
      console.error(`Error setting up provider: ${e}`);
      this.enstablished = false;
      throw new Error(`Error setting up provider: ${e}`);
    }

    // Setup wallet instance
    const pv = process.env.PRIVATE_KEY;
    if (!pv) {
      throw new Error("Private key not found in environment variables");
    }
    this.wallet = new Wallet(pv, this.provider);

    // TODO: Add the real contract address and ABI below
    const abiPath = join(__dirname, "../../../contract/Medisa.abi.json");
    const abi = JSON.parse(readFileSync(abiPath, "utf-8"));

    const contractAddress = "0x0000000000000000000000000000000000000000"; //! NEED TO CHANGE ASAP
    this.contract = new Contract(contractAddress, abi, this.wallet);
  }

  // =================== Core Function ===================
  // Group of Hospital Functions
  hospital = {
    register: this.register.bind(this),
    recordCreation: this.createRecord.bind(this),
    requestAccess: this.requestAccess.bind(this),
    viewRecords: this.viewRecords.bind(this),
  };
  patient = {
    response: {
      approve: this.approveAccess.bind(this),
      reject: this.denyAccess.bind(this),
    },
  };

  private ensureContract(ctx: Contract | null) {
    if (!ctx) throw new Error("Contract not initialized");
    return ctx;
  }

  /**
   * Registers a hospital (owner only)
   */
  protected async register(_hospital: AddressType, _hospitalName: string) {
    const contract = this.ensureContract(this.contract);
    return await contract.registerHospital(_hospital, _hospitalName);
  }

  /**
   * Hospital views patient record (if approved)
   */
  protected async viewRecords(_patient: AddressType) {
    const contract = this.ensureContract(this.contract);
    return await contract.viewRecords(_patient);
  }

  /**
   * Helper: get access request info
   */
  protected async getAccessRequest(
    _hospital: AddressType,
    _patient: AddressType
  ): Promise<{ reason: string; approved: boolean; exists: boolean }> {
    const contract = this.ensureContract(this.contract);

    return await contract.getAccessRequest(_hospital, _patient);
  }

  /**
   * Patient creates their medical record
   */
  protected async createRecord(
    _data: string,
    _patient: AddressType,
    _hospital: AddressType
  ) {
    const contract = this.ensureContract(this.contract);
    return await contract.createRecord(_data, _patient, _hospital);
  }

  /**
   * Hospital requests access to patient record
   */
  protected async requestAccess(
    _patient: AddressType,
    _hospital: AddressType,
    _reason: string
  ) {
    const contract = this.ensureContract(this.contract);
    return await contract.requestAccess(_patient, _hospital, _reason);
  }

  protected async getAccessRequests(
    _hospital: AddressType,
    _patient: AddressType
  ) {
    const contract = this.ensureContract(this.contract);
    return await contract.getAccessRequest(_hospital, _patient);
  }

  /**
   * Patient approves hospital access
   */
  protected async approveAccess(_hospital: AddressType) {
    const contract = this.ensureContract(this.contract);
    return await contract.approveAccess(_hospital);
  }

  /**
   * Patient denies hospital access
   */
  protected async denyAccess(_hospital: AddressType) {
    const contract = this.ensureContract(this.contract);
    return await contract.denyAccess(_hospital);
  }
}
