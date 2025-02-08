use starknet::{ContractAddress};

#[derive(Drop, Serde, starknet::Store)]
pub struct User {
    pub user_id: u64,
    pub address: ContractAddress,
    pub unlock: bool,
    pub date: u64,
}

#[derive(Drop, Serde, starknet::Store)]
pub struct Advisor {
    pub advisor_id: u64,
    pub address: ContractAddress,
    pub unlock: bool,
    pub date: u64,
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub enum VoteCreationAccess {
    #[default]
    Admin,
    AdminOrAdvisor,
    All,
}
