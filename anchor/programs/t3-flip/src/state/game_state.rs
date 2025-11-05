use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct GameState {
    pub current_game_id: u64,
    #[max_len(5)]
    pub cards: Vec<u8>,
    #[max_len(5)]
    pub nfts_rewards: Vec<u8>,
    pub life: u8,
    pub bump: u8,
    pub is_active: bool
}
