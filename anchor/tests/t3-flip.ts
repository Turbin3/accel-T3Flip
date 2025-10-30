import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { T3Flip } from "../target/types/t3_flip";

describe("t3-flip", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.t3Flip as Program<T3Flip>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
