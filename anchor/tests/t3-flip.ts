import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import type { T3Flip } from "../target/types/t3_flip";
import { BN } from "bn.js";
import { expect } from "chai";
import { sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import {
  ValidDepthSizePair,
  createAllocTreeIx,
} from "@solana/spl-account-compression";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity, sol } from "@metaplex-foundation/umi";
import { publicKey } from "@metaplex-foundation/umi";
import {findTreeConfigPda } from '@metaplex-foundation/mpl-bubblegum'

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

  xit("Is initialized and requests randomness!", async () => {
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
      .accountsPartial({
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

    xit("Init Tree", async () => {

      // Setup Umi
      const umi = createUmi(provider.connection.rpcEndpoint)
      .use(keypairIdentity({
        publicKey: publicKey(provider.wallet.publicKey.toString()),
        secretKey: (provider.wallet as any).payer.secretKey,
      }));

      const emptyMerkleTree = anchor.web3.Keypair.generate();
      console.log(`Merke tree: ${emptyMerkleTree.publicKey.toBase58()}`);
      const treeConfigPda = findTreeConfigPda(
        umi,
        {
          merkleTree: emptyMerkleTree.publicKey,
        }
      )[0]

      const treeConfigPublicKey = new anchor.web3.PublicKey(treeConfigPda);
      console.log('treeConfigPublicKey', treeConfigPublicKey.toBase58());

      const maxDepthSizePair: ValidDepthSizePair = {
        maxDepth: 14,
        maxBufferSize: 64,
      }
      const canopyDepth = maxDepthSizePair.maxDepth - 5;
      
      const allocTreeIx = await createAllocTreeIx(
        provider.connection,
        emptyMerkleTree.publicKey,
        provider.publicKey,
        maxDepthSizePair,
        canopyDepth
      );
  
      await sendAndConfirmTransaction(provider.connection, new Transaction().add(allocTreeIx), [provider.wallet.payer, emptyMerkleTree]);

      const initTreeTx = await program.methods
      .initTree(14, 64)
      .accounts({
        payer: provider.wallet.publicKey,
        treeConfig: new anchor.web3.PublicKey("7AJoiVbbmNBf4GaXs1J4DodafSs8cg3YcmUKdU1aonqd"),
        merkleTree: new anchor.web3.PublicKey("2bFpXfQynPaVDRm8yugvgn1aVHi6TKMCGVRVoMH7okhk"),
      }).rpc();
      console.log("Transaction Successful, tx:", initTreeTx);
    });

    it("Game Over", async () => {

      // --- GAME OVER ---
      const initData = generateInitData().seed;
      const playerPk = provider.wallet.publicKey;
      const [gameStatePk] = getGameStatePDA(initData, playerPk);

      const [treeAuthority, bump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("tree-authority")],
        program.programId
      );
    
      const gameOverTx = await program.methods
      .gameOver()
      .accountsPartial({
        player: playerPk,
        gameState: gameStatePk,
        coreCollection: new anchor.web3.PublicKey("HXBsF2VKcjFCV323z4wVjYcHK3wH8j1P3967u3kZ3wvp"),
        collectionAuthority: new anchor.web3.PublicKey("668pwJotKozXCs26pRAcZ3EiW1Ka4CR1CzV9tjBkxRSa"),
        treeAuthority,
        treeConfig: new anchor.web3.PublicKey("7AJoiVbbmNBf4GaXs1J4DodafSs8cg3YcmUKdU1aonqd"),
        merkleTree: new anchor.web3.PublicKey("2bFpXfQynPaVDRm8yugvgn1aVHi6TKMCGVRVoMH7okhk"),
        logWrapper: new anchor.web3.PublicKey("noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV"),
        bubblegumProgram: new anchor.web3.PublicKey("BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY"),
        compressionProgram: new anchor.web3.PublicKey("cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK"),
        mplCoreProgram: new anchor.web3.PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"),
        systemProgram: anchor.web3.SystemProgram.programId,
      }).rpc();
      console.log("Transaction Successful, tx:", gameOverTx);
    });

});



