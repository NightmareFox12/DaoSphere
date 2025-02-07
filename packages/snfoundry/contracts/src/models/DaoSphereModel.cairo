use starknet::{ContractAddress};

#[derive(Drop, Serde, starknet::Store)]
pub struct User {
    pub user_id: u64,
    pub address: ContractAddress,
    pub unlock: bool,
}
