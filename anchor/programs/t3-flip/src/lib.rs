pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("ALBrSaQ89ntEGMDxj1idPdPVeHkFtfkjEkLpns1EvJTu");

#[program]
pub mod t3_flip {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, seed: u64) -> Result<()> {
        ctx.accounts.init_game(seed, &ctx.bumps)
    }

    pub fn guess(ctx: Context<Guess>, nft_id: u8) -> Result<()> {
        ctx.accounts.guess(nft_id)
    }

    pub fn game_over(ctx: Context<GameOver>) -> Result<()> {
        ctx.accounts.game_over()
    }

    pub fn vrf_callback(ctx: Context<VrfCallback>, rnd: u64) -> Result<()> {
        ctx.accounts.update_game_state(rnd)
    }
}
