use anchor_lang::prelude::*;

use crate::GameState;

#[derive(Accounts)]
pub struct Guess<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        mut,
        seeds = [b"game_state", game_state.current_game_id.to_le_bytes().as_ref(), player.key().as_ref()],
        bump = game_state.bump
    )]
    pub game_state: Account<'info, GameState>,

    pub system_program: Program<'info, System>,
}

impl Guess<'_> {
    pub fn guess(&mut self, nft_id: u8, index: u8) -> Result<()> {
        // match the nftid to any of the cards from the game_state
        let card = self.game_state.cards[index as usize];
        if card == nft_id {
            self.game_state.nfts_rewards.push(nft_id);
        } else {
            self.game_state.cards.remove(index as usize);
        }

        Ok(())
    }
}
