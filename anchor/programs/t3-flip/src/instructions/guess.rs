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
    pub fn guess(&mut self, nft_id: u8) -> Result<()> {
        // match the nftid to any of the cards from the game_state
        let mut found = false;
        for card in self.game_state.cards.iter_mut() {
            if *card == nft_id {
                found = true;
            }
        }
        // if matched add that nft id to rewards nft array
        if found && self.game_state.nfts_rewards.len() < 5 {
            self.game_state.nfts_rewards.push(nft_id);
        }

        // if it's wrong remove that nft id from the game state cards array

        Ok(())
    }
}
