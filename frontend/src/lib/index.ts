import { Wallet } from "ethers";
import { Interface } from "ethers";
import { Contract } from "ethers";
import { JsonRpcProvider } from "ethers";

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
}
