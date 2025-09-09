import { Interface } from "ethers/abi";
import { Contract, JsonRpcProvider, Wallet } from "ethers";
import {} from "ethers";
import { AddressType } from "./utils/type";

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
    this.contract = new Contract("", 1 as unknown as Interface, this.wallet);
  }

  // =================== Core Function ===================
  // Group of Hospital Functions
  hospital = {
    register: this.register.bind(this),
    recordCreation: this.recordCreation.bind(this),
    requestAccess: this.requestAccess.bind(this),
    viewRecord: this.viewRecord.bind(this),
  };
  patient = {
    response: {
      approve: this.approveAccess.bind(this),
      reject: this.denyAccess.bind(this),
    },
  };

  protected register(address: AddressType, name: string) {
    // TODO: Implementation here
  }

  protected recordCreation(
    data: string,
    patient_address: AddressType,
    hospital_address: AddressType
  ) {
    // TODO: Implementation here
  }

  protected requestAccess(
    patient_address: AddressType,
    hospital_address: AddressType,
    reason: string
  ) {
    // TODO: Implementation here
  }

  protected getAccessRequests(
    hospital_address: AddressType,
    patient_address: AddressType
  ) {
    // TODO: Implementation here
  }

  protected approveAccess(hospital_address: AddressType) {
    // TODO: Implementation here
  }
  protected denyAccess(hospital_address: AddressType) {
    // TODO: Implementation here
  }

  protected viewRecord(patient_address: AddressType) {
    // TODO: Implementation here
  }
}
