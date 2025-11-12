use std::ops::SubAssign;

use anchor_lang::prelude::*;

use crate::error::T3FlipError;
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
    pub fn guess(&mut self, nft_id: u8, index: usize) -> Result<()> {
        //check if it has a life to make guess
        require!(self.game_state.life.gt(&0), T3FlipError::NoLife);

        // match the nftid to any of the cards from the game_state
        let card = self.game_state.cards[index];
        require!(card < u8::MAX, T3FlipError::DuplicateGuess);

        //this is marking the index as already finish or can't be used again
        self.game_state.cards[index] = u8::MAX;
        if card == nft_id {
            //successful guess adds a nft reward
            self.game_state.nfts_rewards.push(nft_id);
        } else {
            //cut life at wrong guess
            self.game_state.life.sub_assign(1);
        };

        Ok(())
    }
}
