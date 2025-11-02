// Here we export some useful types and functions for interacting with the Anchor program.
import T3flipIDL from '../target/idl/t3_flip.json'
import { Account, getBase58Decoder, SolanaClient } from 'gill'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { GameState, GAME_STATE_DISCRIMINATOR, T3_FLIP_PROGRAM_ADDRESS, getGameStateDecoder  } from './client/js'

export type CounterAccount = Account<GameState, string>

// Re-export the generated IDL and type
export { T3flipIDL }

export * from './client/js'

export function getT3FlipProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getGameStateDecoder(),
    filter: getBase58Decoder().decode(GAME_STATE_DISCRIMINATOR),
    programAddress: T3_FLIP_PROGRAM_ADDRESS,
  })
}
