use anchor_lang::prelude::*;

#[error_code]
pub enum T3FlipError {
    #[msg("Custom error message")]
    CustomError,
    #[msg("All Life have been used.")]
    NoLife,
    #[msg("Duplicate guesses are not allowed.")]
    DuplicateGuess
}
