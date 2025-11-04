use anchor_lang::prelude::*;
use ephemeral_vrf_sdk::{
    anchor::vrf,
    instructions::{create_request_randomness_ix, RequestRandomnessParams},
    types::SerializableAccountMeta,
};

use crate::{instruction, GameState};

#[vrf]
#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        init,
        payer=player,
        seeds = [b"game_state", seed.to_le_bytes().as_ref(), player.key().as_ref()],
        space = 8 + GameState::INIT_SPACE,
        bump
    )]
    pub game_state: Account<'info, GameState>,

    /// CHECK: The oracle queue
    #[account(
        mut,
        address = ephemeral_vrf_sdk::consts::DEFAULT_QUEUE
    )]
    pub oracle_queue: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

impl Initialize<'_> {
    pub fn init_game(&mut self, seed: u64, bumps: &InitializeBumps) -> Result<()> {
        // get 5 random numbers from vrf
        // initiate the vrf request here in this ixn and handle callback in vrf_callback
        // Ask vrf for a number between 0 and 9999 (inclusive).
        // That’s 10,000 possible seeds → 13 bits of entropy.
        // It’s simple to pick and share, but still random enough that your derived 5 numbers will look unpredictable.
        // delegate game state pda to er

        self.game_state.set_inner(GameState {
            bump: bumps.game_state,
            current_game_id: seed,
            cards: vec![],
            nfts_rewards: vec![],
            life: 3,
            is_active: false
        });

        let ixn = create_request_randomness_ix(RequestRandomnessParams {
            payer: self.player.key(),
            oracle_queue: self.oracle_queue.key(),
            callback_program_id: crate::ID,
            callback_discriminator: instruction::VrfCallback::DISCRIMINATOR.to_vec(),
            accounts_metas: Some(vec![
                SerializableAccountMeta {
                    pubkey: self.game_state.key(),
                    is_signer: false,
                    is_writable: true,
                },
                SerializableAccountMeta {
                    pubkey: ephemeral_vrf_sdk::consts::VRF_PROGRAM_IDENTITY,
                    is_signer: false,
                    is_writable: false,
                },
            ]),
            caller_seed: [seed as u8; 32],
            ..Default::default()
        });

        self.invoke_signed_vrf(&self.player.to_account_info(), &ixn)?;

        Ok(())
    }
}
