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
    seed: new BN(53),
  };
};

const ER_VALIDATOR = new anchor.web3.PublicKey("MAS1Dt9qreoRMQ14YQuhg8UTZMMzDdKhmkZMECCzk57");

describe("t3-flip", () => {
  // 1. Standard Anchor provider (for base layer operations like fetching wallet balance)
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.t3Flip as Program<T3Flip>;
  const providerEphemeralRollup = new anchor.AnchorProvider(
    new anchor.web3.Connection("https://devnet-as.magicblock.app/", {
      wsEndpoint: "wss://devnet.magicblock.app/",
    }), provider.wallet);
  const ephemeralProgram = new Program<T3Flip>(program.idl, providerEphemeralRollup);

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
    console.log("programId:", program.programId);

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
        //@ts-ignore
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

  it("is delegated", async () => {
    const initData = generateInitData();
    const playerPk = provider.wallet.publicKey;
    const [gameStatePk] = getGameStatePDA(initData.seed, playerPk);

    let gameStateAccount = await program.account.gameState.fetch(gameStatePk);
    assert(gameStateAccount.isActive, "Game state should be active");
    let gameStateInfo = await program.provider.connection.getAccountInfo(gameStatePk);
    assert(gameStateInfo.owner.toBase58() === program.programId.toBase58(), "Game state owner should be the program");

    let tx = await program.methods.delegateGameState().accounts({
      player: playerPk,
      validator: ER_VALIDATOR,
      //@ts-ignore
      gameState: gameStatePk
    }).rpc();
    console.log("✅ Delegate Game State successfull.");

    let erGameStateInfo = await provider.connection.getAccountInfo(gameStatePk);
    console.log("erGameStateInfo:", erGameStateInfo);
    assert(erGameStateInfo.owner.toString().toLowerCase().startsWith("del"), "er game state info owner should be delegate program");
    let gameState = program.coder.accounts.decode("gameState", erGameStateInfo.data);
    console.log("gameState:", gameState);
  })

  it("is guessed wrong", async () => {
    const initData = generateInitData();
    const playerPk = provider.wallet.publicKey;
    const [gameStatePk] = getGameStatePDA(initData.seed, playerPk);
    //Cards: [ 2, 24, 9, 15, 28 ]
    let tx = await ephemeralProgram.methods.guess(12, 0).accounts({
      player: playerPk,
      //@ts-ignore
      gameState: gameStatePk
    }).rpc();
    console.log("guess transaction successful with tx: ", tx);

    let gameStateAccount = await ephemeralProgram.account.gameState.fetch(gameStatePk);
    console.log("gamestateAccount:", gameStateAccount);
    console.log("Cards:", Array.from(gameStateAccount.cards));
    console.log("nfts:", Array.from(gameStateAccount.nftsRewards));
    console.log("gameId:", gameStateAccount.currentGameId.toString());
    assert(gameStateAccount.life == 2, "life in game state should be matched");
    assert(gameStateAccount.nftsRewards.length == 0, "nft reward should be as expected");
  })

  it("duplicate guess", async () => {
    const initData = generateInitData();
    const playerPk = provider.wallet.publicKey;
    const [gameStatePk] = getGameStatePDA(initData.seed, playerPk);
    //Cards: [ 2, 24, 9, 15, 28 ]
    try {
      let tx = await ephemeralProgram.methods.guess(12, 0).accounts({
        player: playerPk,
        //@ts-ignore
        gameState: gameStatePk
      }).rpc();
      console.log("guess transaction successful with tx: ", tx);
    } catch (error) {
      const anchorErr = error as anchor.AnchorError;
      expect(anchorErr.error.errorCode?.code).to.equal("DuplicateGuess");
    }
  })

  it("is guessed right", async () => {
    const initData = generateInitData();
    const playerPk = provider.wallet.publicKey;
    const [gameStatePk] = getGameStatePDA(initData.seed, playerPk);
    //Cards: [ 255, 255, 9, 15, 28 ]
    let tx = await ephemeralProgram.methods.guess(9, 2).accounts({
      player: playerPk,
      //@ts-ignore
      gameState: gameStatePk
    }).rpc();
    console.log("guess transaction successful with tx: ", tx);

    let gameStateAccount = await ephemeralProgram.account.gameState.fetch(gameStatePk);
    console.log("gamestateAccount:", gameStateAccount);
    console.log("Cards:", Array.from(gameStateAccount.cards));
    console.log("nfts:", Array.from(gameStateAccount.nftsRewards));
    console.log("gameId:", gameStateAccount.currentGameId.toString());
    assert(gameStateAccount.life == 1, "life in game state should be matched");
    assert(gameStateAccount.nftsRewards.length == 1, "nft reward should be as expected");
  })

  it.only("no life guess", async () => {
    const initData = generateInitData();
    const playerPk = provider.wallet.publicKey;
    const [gameStatePk] = getGameStatePDA(initData.seed, playerPk);

    let gameStateAccount = await ephemeralProgram.account.gameState.fetch(gameStatePk);
    let i = 0;
    while (gameStateAccount.life > 0) {
      try {
        await ephemeralProgram.methods.guess(12, i).accounts({
          player: playerPk,
          //@ts-ignore
          gameState: gameStatePk
        }).rpc();
      } catch (error) {
        const anchorErr = error as anchor.AnchorError;
        console.log(anchorErr.error.errorCode?.code);
      }
      gameStateAccount = await ephemeralProgram.account.gameState.fetch(gameStatePk);
      i = (i + 1) % 5; //runs until life is 0
    }

    //life is 0 now
    try {
      await ephemeralProgram.methods.guess(12, i).accounts({
        player: playerPk,
        //@ts-ignore
        gameState: gameStatePk
      }).rpc();
    } catch (error) {
      const anchorErr = error as anchor.AnchorError;
      expect(anchorErr.error.errorCode?.code).to.equal("NoLife");
    }
  })
});



