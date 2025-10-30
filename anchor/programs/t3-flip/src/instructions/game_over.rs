use anchor_lang::prelude::*;

use crate::GameState;

#[derive(Accounts)]
pub struct GameOver<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        mut,
        close=player,
        seeds = [b"game_state", game_state.current_game_id.to_le_bytes().as_ref(), player.key().as_ref()],
        bump = game_state.bump
    )]
    pub game_state: Account<'info, GameState>,

    pub system_program: Program<'info, System>,
}

impl GameOver<'_> {
    pub fn game_over(&mut self) -> Result<()> {
        // if rewards is empty, we have to close game state
        // and if rewards is not empty then we we mint the nfts to the player
        Ok(())
    }
}
