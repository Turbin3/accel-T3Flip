use anchor_lang::prelude::*;

use crate::GameState;

#[derive(Accounts)]
pub struct VrfCallback<'info> {
    #[account(address=ephemeral_vrf_sdk::consts::VRF_PROGRAM_IDENTITY)]
    pub vrf_program_identity: Signer<'info>,
    #[account(mut)]
    pub game_state: Account<'info, GameState>,
}

impl VrfCallback<'_> {
    pub fn update_game_state(&mut self, rnd: u64) -> Result<()> {
        // update the game state's cards
        // use the derive_number fn to get 5 rnd number from the above single rnd number
        let random_nft_ids = derive_numbers(rnd, 5, 0, 30); // min nft_id is 0 and max is 30(whatever the number of people is minus one)
        self.game_state.cards = random_nft_ids;
        self.game_state.is_active = true;
        Ok(())
    }
}

fn derive_numbers(seed: u64, n: u8, min_val: u8, max_val: u8) -> Vec<u8> {
    let mut numbers = Vec::new();
    let mut value = seed;
    let range = max_val - min_val + 1;

    for i in 0..n {
        // Linear Congruential Generator (LCG) step
        value = value
            .wrapping_mul(1664525)
            .wrapping_add(1013904223)
            .wrapping_add(i as u64 * 9973);

        // Map to target range
        let derived = min_val + (value % (range as u64)) as u8;
        numbers.push(derived);
    }

    numbers
}
