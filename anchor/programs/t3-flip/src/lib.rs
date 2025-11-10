#![allow(unexpected_cfgs)]
#![allow(deprecated)]

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use ephemeral_rollups_sdk::anchor::ephemeral;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("51ABGbo6FPrd5dAroNHkrx5LTZ1vkMAqBy7Efttm4e47");

#[ephemeral]
#[program]
pub mod t3_flip {

    use super::*;

    pub fn initialize(ctx: Context<Initialize>, seed: u64) -> Result<()> {
        ctx.accounts.init_game(seed, &ctx.bumps)
    }

    pub fn delegate_game_state(ctx: Context<Delegate>) -> Result<()> {
        ctx.accounts.delegate()
    }

    pub fn guess(ctx: Context<Guess>, nft_id: u8, card_index: u8) -> Result<()> {
        ctx.accounts.guess(nft_id, card_index)
    }

    pub fn init_tree(ctx: Context<InitTree>, max_depth: u32, max_buffer_size: u32) -> Result<()> {
        ctx.accounts.init_tree(max_depth, max_buffer_size, &ctx.bumps)
    }

    pub fn game_over(ctx: Context<GameOver>) -> Result<()> {
        ctx.accounts.game_over(&ctx.bumps)
    }

    pub fn undelegate_game_state(ctx: Context<Undelegate>) -> Result<()> {
        ctx.accounts.undelegate()
    }

    pub fn vrf_callback(ctx: Context<VrfCallback>, rnd: [u8; 32]) -> Result<()> {
        let rnd = ephemeral_vrf_sdk::rnd::random_u64(&rnd);
        ctx.accounts.update_game_state(rnd)
    }
}
