import { Contract, JsonRpcProvider, Wallet } from "ethers";
import { AddressType } from "./utils/type";
import { InterfaceAbi } from "ethers";

export class BlockchainRegistry {
  private provider: JsonRpcProvider | null = null;
  private contracts: Map<string, Contract> = new Map();
  private contract: Contract | null = null;
  private wallet: Wallet | null = null;

  private established: boolean = false;
  private readonly contractAddress: string =
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

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

    if (!this.contractAddress)
      throw new Error("Contract address not found in environment variables");

    this.contracts.set(
      "owner",
      new Contract(this.contractAddress, abi, this.wallet)
    );
  }

  async loadAbi(): Promise<InterfaceAbi> {
    if (typeof window !== "undefined") {
      const response = await fetch("/Medisa.abi.json");
      if (!response.ok)
        throw new Error(
          `Failed to load ABI: ${response.status} ${response.statusText}`
        );
      return await response.json();
    } else {
      const abiModule = await import("../../public/Medisa.abi.json");
      return abiModule.default || abiModule;
    }
  }

  async loadContract(role: "hospital" | "patient", address: AddressType) {
    if (!this.established) throw new Error("Provider not established");

    const signer = await this.provider!.getSigner(address);
    const abi = await this.loadAbi();
    this.contracts.set(
      `${role}:${address}`,
      new Contract(this.contractAddress, abi, signer)
    );
  }

  // =================== Core Function ===================
  // Group of Admin Functions
  admin = {
    register: this.register.bind(this),
  };
  // Group of Hospital Functions
  hospital = {
    recordCreation: this.issueRecord.bind(this),
    requestAccess: this.requestConsent.bind(this),
    // viewRecords: this.viewRecords.bind(this),
  };
  // Group of Patient Functions
  patient = {
    // getAccessRequests: this.getConsentRequests.bind(this),
    response: {
      approve: this.approveConsent.bind(this),
      reject: this.denyConsent.bind(this),
    },
  };

  /**
   * Registers a hospital (owner only)
   */
  protected async register(_hospital: AddressType, _hospitalName: string) {
    // load the contract
    const ownerContract = this.contracts.get(`owner:${this.wallet?.address}`);
    if (!ownerContract) throw new Error("Hospital contract not found");
    const signer = await this.provider!.getSigner(_hospital);
    return await ownerContract.registerHospital(signer, _hospitalName);
  }

  protected async issueRecord(
    _hospital: AddressType,
    _data: string,
    _patient: AddressType
  ) {
    await this.loadContract("hospital", _hospital);

    // load the contract
    const hospitalContract = this.contracts.get(`hospital:${_hospital}`);
    if (!hospitalContract) throw new Error("Hospital contract not found");

    return await hospitalContract.issueRecord(_data, _patient);
  }

  protected async requestConsent(
    _hospital: AddressType,
    _patient: AddressType,
    _reason: string
  ) {
    await this.loadContract("hospital", _hospital);
    // load the contract
    const hospitalContract = this.contracts.get(`hospital:${_hospital}`);
    if (!hospitalContract) throw new Error("Hospital contract not found");

    return await hospitalContract.requestConsent(_patient, _reason);
  }

  protected async approveConsent(
    _patient: AddressType,
    _hospital: AddressType
  ) {
    await this.loadContract("patient", _patient);
    // load the contract
    const patientContract = this.contracts.get(`patient:${_patient}`);
    if (!patientContract) throw new Error("Patient contract not found");
    return await patientContract.approveConsent(_hospital);
  }

  protected async denyConsent(_patient: AddressType, _hospital: AddressType) {
    await this.loadContract("patient", _patient);
    // load the contract
    const patientContract = this.contracts.get(`patient:${_patient}`);
    if (!patientContract) throw new Error("Patient contract not found");
    return await patientContract.denyConsent(_hospital);
  }

  // /**
  //  * Hospital views patient record (if approved)
  //  */
  // protected async viewRecords(_patient: AddressType) {
  //   const contract = this.ensureContract(this.contract);
  //   return await contract.viewRecords(_patient);
  // }

  // protected async getConsentRequests(
  //   _hospital: AddressType,
  //   _patient: AddressType
  // ) {
  //   const contract = this.ensureContract(this.contract);
  //   return await contract.getConsentRequest(_hospital, _patient);
  // }
}
