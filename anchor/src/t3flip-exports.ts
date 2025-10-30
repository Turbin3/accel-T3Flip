// Here we export some useful types and functions for interacting with the Anchor program.
import T3flipIDL from '../target/idl/t3_flip.json'

// Re-export the generated IDL and type
export { T3flipIDL }

export * from './t3flip/client/js/generated'
