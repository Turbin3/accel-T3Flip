use anchor_lang::prelude::*;
use ephemeral_rollups_sdk::{anchor::commit, ephem::commit_and_undelegate_accounts};

use crate::GameState;

#[commit]
#[derive(Accounts)]
pub struct Undelegate<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        mut,
        seeds = [b"game_state", game_state.current_game_id.to_le_bytes().as_ref(), player.key().as_ref()],
        bump = game_state.bump
    )]
    pub game_state: Account<'info, GameState>,
}

impl Undelegate<'_> {
    pub fn undelegate(&mut self) -> Result<()> {

        commit_and_undelegate_accounts(
            &self.player.to_account_info(), 
            vec![&self.game_state.to_account_info()], 
            &self.magic_context,
            &self.magic_program
        )?;

        Ok(())
    }
}