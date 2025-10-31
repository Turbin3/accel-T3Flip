use anchor_lang::prelude::*;
use ephemeral_rollups_sdk::{anchor::delegate, cpi::DelegateConfig};

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
        let seed_bytes = self.game_state.current_game_id.to_le_bytes();
        let player_seed = self.player.key();

        let seeds = &[b"game_state", seed_bytes.as_ref(), player_seed.as_ref()];

        self.delegate_game_state(
            &self.player,
            seeds,
            DelegateConfig {
                validator: Some(self.validator.key()),
                ..Default::default()
            },
        )?;

        Ok(())
    }
}
