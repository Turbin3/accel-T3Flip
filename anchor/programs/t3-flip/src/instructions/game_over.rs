use anchor_lang::prelude::*;
use mpl_bubblegum::instructions::MintV2CpiBuilder;
use mpl_bubblegum::types::{
    MetadataArgsV2, TokenStandard
};
use mpl_bubblegum::ID as BUBBLEGUM_ID;
use mpl_account_compression::ID as MPL_ACCOUNT_COMPRESSION_ID;
use mpl_noop::ID as MPL_NOOP_ID;
use mpl_core::ID as MPL_CORE_ID;

use crate::GameState;

#[derive(Accounts)]
pub struct GameOver<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        mut,
        close = player,
        seeds = [b"game_state", game_state.current_game_id.to_le_bytes().as_ref(), player.key().as_ref()],
        bump = game_state.bump
    )]
    pub game_state: Account<'info, GameState>,

    /// CHECK: Core collection mint address
    #[account(mut)]
    pub core_collection: UncheckedAccount<'info>,

    /// CHECK: Collection authority PDA - needed to sign the minting
    #[account(
        seeds = [b"collection-authority"],
        bump,
    )]
    pub collection_authority: UncheckedAccount<'info>,

    /// CHECK: Tree authority PDA - needed to sign the minting
    #[account(
        seeds = [b"tree-authority"],
        bump,
    )]
    pub tree_authority: UncheckedAccount<'info>,

    /// CHECK: Tree Config account that will be checked by the Bubblegum Program
    #[account(mut)]
    pub tree_config: UncheckedAccount<'info>,

    /// CHECK: Merkle Tree account that will be checked by the Bubblegum Program
    #[account(mut)]
    pub merkle_tree: UncheckedAccount<'info>,

    /// CHECK: MPL Core CPI Signer account that will be checked by the Bubblegum Program
    pub mpl_core_cpi_signer: UncheckedAccount<'info>,
    
    /// CHECK: SPL NOOP Program checked by the corresponding address
    #[account(address = Pubkey::from_str_const(&MPL_NOOP_ID.to_string()))]
    pub log_wrapper: UncheckedAccount<'info>,
    
    /// CHECK: Bubblegum Program checked by the corresponding address
    #[account(address = BUBBLEGUM_ID)]
    pub bubblegum_program: UncheckedAccount<'info>,
    
    /// CHECK: SPL Account Compression Program checked by the corresponding address
    #[account(address = Pubkey::from_str_const(&MPL_ACCOUNT_COMPRESSION_ID.to_string()))]
    pub compression_program: UncheckedAccount<'info>,

    /// CHECK: This is the ID of the Metaplex Core program
    #[account(address = MPL_CORE_ID)]
    pub mpl_core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl GameOver<'_> {
    pub fn game_over(&mut self, bumps: &GameOverBumps) -> Result<()> {
        // if rewards is empty, we have to close game state
        // and if rewards is not empty then we we mint the nfts to the player

        // Create signer seeds
        let collection_seeds: &[&[u8]] = &[b"collection-authority", &[bumps.collection_authority]];

        let tree_seeds: &[&[u8]] = &[b"tree-authority", &[bumps.tree_authority]];

        let signer_seeds: &[&[&[u8]]] = &[tree_seeds, collection_seeds];

        // if rewards is not empty we mint the nfts to the player
        for _nft_id in self.game_state.nfts_rewards.iter() {
            
            //TODO: Add the metadata for the nfts (need to fetch data from json?)

            //TODO: Add loop to mint as many nfts as the number of rewards (need to match from nft list from json?)

            // CPI call to the Bubblegum Program to mint the cNFT
            MintV2CpiBuilder::new(&self.bubblegum_program.to_account_info())
            .tree_config(&self.tree_config.to_account_info())
            .payer(&self.player.to_account_info())
            .tree_creator_or_delegate(Some(&self.tree_authority.to_account_info()))
            .collection_authority(Some(&self.collection_authority.to_account_info()))
            .leaf_owner(&self.player.to_account_info())
            .leaf_delegate(None)
            .merkle_tree(&self.merkle_tree.to_account_info())
            .mpl_core_cpi_signer(Some(&self.mpl_core_cpi_signer.to_account_info()))
            .core_collection(Some(&self.core_collection.to_account_info()))
            .log_wrapper(&self.log_wrapper.to_account_info())
            .compression_program(&self.compression_program.to_account_info())
            .mpl_core_program(&self.mpl_core_program.to_account_info())
            .system_program(&self.system_program.to_account_info())
            .metadata(MetadataArgsV2 {
                name: "".to_string(),
                symbol: "".to_string(),
                uri: "".to_string(),
                seller_fee_basis_points: 0,
                primary_sale_happened: false,
                is_mutable: false,
                token_standard: Some(TokenStandard::NonFungible),
                creators: vec![],
                collection: Some(self.core_collection.key()),
            }).invoke_signed(signer_seeds)?;
        }

        Ok(())
    }
}
