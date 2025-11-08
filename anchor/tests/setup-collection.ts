import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import {
  createCollection,
  mplCore,
} from "@metaplex-foundation/mpl-core";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity, sol } from "@metaplex-foundation/umi";
import { publicKey } from "@metaplex-foundation/umi";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

describe("NFT tree", () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  xit("Create NFT collection", async () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    console.log(":: Creating Core NFT Collection ::");
    console.log("Wallet:", provider.wallet.publicKey.toString());

    const programId = new PublicKey("51ABGbo6FPrd5dAroNHkrx5LTZ1vkMAqBy7Efttm4e47");

    // Collection authority = program's PDA
    const [collectionAuthority, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("collection-authority")],
      programId
    );

    // Setup Umi
    const umi = createUmi(provider.connection.rpcEndpoint)
      .use(mplCore())
      .use(keypairIdentity({
        publicKey: publicKey(provider.wallet.publicKey.toString()),
        secretKey: (provider.wallet as any).payer.secretKey,
      }));

    // Generate collection keypair
    const collectionKeypair = generateSigner(umi);

    console.log("Collection Address:", collectionKeypair.publicKey.toString());
    console.log("Collection Authority PDA:", collectionAuthority.toString());

    // Airdrop 1 SOL to provider wallet
    // console.log("Requesting airdrop...");
    // await umi.rpc.airdrop(umi.identity.publicKey, sol(1));
    // console.log("Airdropped 1 SOL to provider wallet");

    // Create the collection
    await createCollection(umi, {
      collection: collectionKeypair,
      name: "Turbin3 Flip",
      uri: "https://your-metadata-uri.com/collection.json", // TODO: Update with actual URI
      plugins: [
        {
          type: "BubblegumV2",
        },
      ],
    }).sendAndConfirm(umi);

    // Save collection info to a file for reference
    const configPath = path.join(__dirname, "../.collection-config.json");
    const config = {
      collectionAddress: collectionKeypair.publicKey.toString(),
      collectionAuthority: collectionAuthority.toString(),
      bump: bump,
      createdAt: new Date().toISOString(),
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    console.log("✅ Collection created successfully!");
    console.log("📄 Config saved to:", configPath);
  });
});