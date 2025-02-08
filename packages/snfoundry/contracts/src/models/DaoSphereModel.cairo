use starknet::{ContractAddress};

#[derive(Drop, Serde, starknet::Store)]
pub struct User {
    pub user_id: u64,
    pub address: ContractAddress,
    pub unlock: bool,
    pub date: u64,
}

#[derive(Drop, Serde, starknet::Store)]
pub struct Supervisor {
    pub supervisor_id: u64,
    pub address: ContractAddress,
    pub unlock: bool,
    pub date: u64,
}