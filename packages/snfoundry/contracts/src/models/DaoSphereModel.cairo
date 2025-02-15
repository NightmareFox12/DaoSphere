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
    Admin: bool,
    AdminOrAdvisor: bool,
    All: bool,
}


#[derive(Drop, Serde, starknet::Store)]
pub struct Proposal {
    pub proposal_id: u64,
    pub creator_address: ContractAddress,
    pub title: ByteArray,
    pub start_time: u64,
    pub end_time: u64,
}


#[derive(Drop, Serde, starknet::Store)]
pub struct OptionProposal {
    pub option_id: u64,
    pub description: ByteArray,
    pub votes: u64,
}
