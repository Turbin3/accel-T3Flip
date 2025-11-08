use anchor_lang::prelude::*;
use mpl_bubblegum::{ID as BUBBLEGUM_ID, instructions::CreateTreeConfigCpiBuilder};
use spl_account_compression::ID as SPL_ACCOUNT_COMPRESSION_ID;
use spl_noop::ID as SPL_NOOP_ID;

#[derive(Accounts)]
pub struct InitTree<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: Tree Authority PDA
    #[account(
        seeds = [b"tree-authority"],
        bump,
    )]
    pub tree_authority: UncheckedAccount<'info>,
    /// CHECK: Tree Config checks will be performed by the Bubblegum Program
    #[account(mut)]
    pub tree_config: UncheckedAccount<'info>,
    /// CHECK: Unitialized Merkle Tree Account. Initialization will be performed by the Bubblegum Program 
    #[account(mut)]
    pub merkle_tree: UncheckedAccount<'info>,
    /// CHECK: SPL NOOP Program checked by the corresponding address
    #[account(address = SPL_NOOP_ID)]
    pub log_wrapper: UncheckedAccount<'info>,
    /// CHECK: SPL Account Compression Program checked by the corresponding address
    #[account(address = SPL_ACCOUNT_COMPRESSION_ID)]
    pub compression_program: UncheckedAccount<'info>,
    /// CHECK: Bubblegum Program checked by the corresponding address
    #[account(address = BUBBLEGUM_ID)]
    pub bubblegum_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitTree<'info> {

    pub fn init_tree(&mut self, max_depth: u32, max_buffer_size: u32, bumps: &InitTreeBumps) -> Result<()> {
        // Create the seeds for the CPI call
        let seeds = &[
            &b"tree-authority"[..], 
            &[bumps.tree_authority],
        ];
        let signer_seeds = &[&seeds[..]];

        msg!("Signer seeds: {:?}", signer_seeds);
        
        // Accounts for CPI calls
        let bubblegum_program = &self.bubblegum_program.to_account_info();
        let tree_config = &self.tree_config.to_account_info();
        let merkle_tree = &self.merkle_tree.to_account_info();
        let tree_creator = &self.tree_authority.to_account_info();
        let payer = &self.payer.to_account_info();
        let log_wrapper = &self.log_wrapper.to_account_info();
        let compression_program = &self.compression_program.to_account_info();
        let system_program = &self.system_program.to_account_info();

        // CPI call to create the tree config
        CreateTreeConfigCpiBuilder::new(bubblegum_program)
            .tree_config(tree_config)
            .merkle_tree(merkle_tree)
            .payer(payer)
            .tree_creator(tree_creator)
            .log_wrapper(log_wrapper)
            .compression_program(compression_program)
            .system_program(system_program)
            .max_depth(max_depth)
            .max_buffer_size(max_buffer_size)
            .public(false)
            .invoke_signed(signer_seeds)?;          
        
        Ok(())
    }
}