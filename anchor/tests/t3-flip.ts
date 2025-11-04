import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import type { T3Flip } from "../target/types/t3_flip";
import { BN } from "bn.js";
import { expect } from "chai";

// MagicBlock VRF Queue address (used in the Rust program)
// You might need to confirm this is the correct one for your test setup
const ORACLE_QUEUE_ADDRESS = new anchor.web3.PublicKey("Cuj97ggrhhidhbu39TijNVqE74xvKJ69gDervRUXAxGh"); // The DEFAULT_QUEUE constant
const VRF_PROGRAM_ID = new anchor.web3.PublicKey("Vrf1RNUjXmQGjmQrQLvJHs9SNkvDJEsRVFPkfSQUwGz");

export const generateInitData = () => {
  return {
    seed: new BN(67),
  };
};

describe("t3-flip init", () => {
  // 1. Standard Anchor provider (for base layer operations like fetching wallet balance)
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.t3Flip as Program<T3Flip>;

  // Helper function to calculate the PDA
  const getGameStatePDA = (seed: anchor.BN, playerPk: anchor.web3.PublicKey) => {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("game_state"),
        seed.toArrayLike(Buffer, "le", 8), // Use 8 bytes for u64
        playerPk.toBuffer(),
      ],
      program.programId
    );
  };

  it("Is initialized and requests randomness!", async () => {
    const initData = generateInitData();
    const playerPk = provider.wallet.publicKey;
    const [gameStatePk] = getGameStatePDA(initData.seed, playerPk);

    console.log("Game State PDA:", gameStatePk.toBase58());

    // --- SANITY CHECK: VERIFY ORACLE QUEUE OWNER ---
    const oracleQueueAccount = await program.provider.connection.getAccountInfo(ORACLE_QUEUE_ADDRESS);

    if (!oracleQueueAccount) {
      console.error(">>> CRITICAL SETUP ERROR: Oracle Queue account not found on the Ephemeral Rollup (ER) endpoint.");
      console.error(">>> Double-check if the 'ephemeral-validator' is running and successfully connected to the Devnet remote URL.");
      throw new Error("Oracle Queue account not found on ER.");
    }

    const actualOwner = oracleQueueAccount.owner.toBase58();
    const expectedOwner = VRF_PROGRAM_ID.toBase58();

    console.log(`\n--- VRF Account Check ---`);
    console.log(`Oracle Queue: ${ORACLE_QUEUE_ADDRESS.toBase58()}`);
    console.log(`Expected Owner: ${expectedOwner}`);
    console.log(`Actual Owner:   ${actualOwner}`);
    console.log(`-------------------------\n`);

    if (actualOwner !== expectedOwner) {
      // This confirms the "Invalid account owner" error
      console.error("!!! FATAL: Account Owner Mismatch !!!");
      console.error("The account at the Oracle Queue address is NOT owned by the VRF Program on your ER endpoint.");
      console.error("Action needed: Stop and restart your 'ephemeral-validator' to ensure proper state cloning.");
      throw new Error("Invalid account owner detected by test.");
    }
    // --- END SANITY CHECK ---

    // Use the EPHEMERAL provider for the transaction
    const tx = await program.methods
      .initialize(initData.seed)
      .accounts({
        player: playerPk,
        gameState: gameStatePk,
        oracleQueue: ORACLE_QUEUE_ADDRESS,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).rpc();

    console.log("Transaction Successful, tx:", tx);

    // In a real test, you'd add a delay here (e.g., 5-10 seconds)
    // and then fetch the gameState account to check for the random number
    // to ensure the callback completed successfully.
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const game_state_account = await program.account.gameState.fetch(gameStatePk);
    console.log("Game State after callback:", game_state_account);
    console.log("Cards:", Array.from(game_state_account.cards));
    expect(Array.from(game_state_account.cards).length > 0, "Card array shouldn't be empty");
  });

  /**TEST OUTPUT, FROM DEVNET TESTING:
   * Game State PDA: 2EtZWRMRNXWBHeNXpgqAgzwigtkyTHsFGDp9boo6DxHK

    --- VRF Account Check ---
    Oracle Queue: Cuj97ggrhhidhbu39TijNVqE74xvKJ69gDervRUXAxGh
    Expected Owner: Vrf1RNUjXmQGjmQrQLvJHs9SNkvDJEsRVFPkfSQUwGz
    Actual Owner:   Vrf1RNUjXmQGjmQrQLvJHs9SNkvDJEsRVFPkfSQUwGz
    -------------------------

    Transaction Successful, tx: fRLpXWRQDmxer6WkLijVCAXKsu2cugX6NnwT6gojtYSejsxLJHPoF9XzkNtduxTCAck1B4AGEAKc59wN4vTuCwR
    Game State after callback: {
      currentGameId: <BN: 43>,
      cards: <Buffer 04 11 03 03 09>,
      nftsRewards: <Buffer >,
      life: 3,
      bump: 255,
      isActive: true
    }
    Cards: [ 4, 17, 3, 3, 9 ]
   */
});



