use anchor_lang::prelude::*;
use ephemeral_rollups_sdk::anchor::delegate;

use crate::GameState;

#[delegate]
#[derive(Accounts)]
pub struct Delegate<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        mut,
        del,
        seeds = [b"game_state", game_state.current_game_id.to_le_bytes().as_ref(), player.key().as_ref()],
        bump = game_state.bump
    )]
    pub game_state: Account<'info, GameState>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    pub validator: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl Delegate<'_> {
    pub fn delegate(&mut self) -> Result<()> {
        Ok(())
    }
}
