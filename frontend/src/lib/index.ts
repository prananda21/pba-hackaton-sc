import { Contract, JsonRpcProvider, Wallet } from "ethers";
import { AddressType } from "./utils/type";
import { InterfaceAbi } from "ethers";

export class BlockchainRegistry {
  private provider: JsonRpcProvider | null = null;
  private contract: Contract | null = null;
  private wallet: Wallet | null = null;

  private established: boolean = false;

  /**
   * Setup the blockchain provider, wallet, and contract instances every this class instance called
   */
  async setupProvider() {
    // Setup provider connection first
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
    if (!rpcUrl) throw new Error("RPC URL not found in environment variables");
    this.provider = new JsonRpcProvider(rpcUrl);

    try {
      await this.provider.getNetwork();
      this.established = true;
    } catch (e) {
      console.error(`Error setting up provider: ${e}`);
      this.established = false;
      throw new Error(`Error setting up provider: ${e}`);
    }

    // Setup wallet instance
    const pv = process.env.NEXT_PUBLIC_PRIVATE_KEY;
    if (!pv) {
      throw new Error("Private key not found in environment variables");
    }
    this.wallet = new Wallet(pv, this.provider);

    // TODO: Add the real contract address and ABI below
    const abi = await this.loadAbi();

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress)
      throw new Error("Contract address not found in environment variables");

    this.contract = new Contract(contractAddress, abi, this.wallet);
  }

  async loadAbi(): Promise<InterfaceAbi> {
    if (typeof window !== "undefined") {
      const response = await fetch("/Medisa.abi.json");
      if (!response.ok)
        throw new Error(
          `Failed to load ABI: ${response.status} ${response.statusText}`
        );
      return await response.json();
    }
    // For Node.js (test environment)
    else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const abiModule = await import("../../public/Medisa.abi.json");
      return abiModule.default || abiModule;
    }
  }

  // =================== Core Function ===================
  // Group of Admin Functions
  admin = {
    register: this.register.bind(this),
  };
  // Group of Hospital Functions
  hospital = {
    recordCreation: this.createRecord.bind(this),
    requestAccess: this.requestAccess.bind(this),
    viewRecords: this.viewRecords.bind(this),
  };
  // Group of Patient Functions
  patient = {
    getAccessRequests: this.getAccessRequests.bind(this),
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
