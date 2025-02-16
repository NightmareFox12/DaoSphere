use starknet::{ContractAddress};

//constants
pub const ETH_CONTRACT_ADDRESS: felt252 =
    0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7;
pub const STRK_CONTRACT_ADDRESS: felt252 =
    0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d;
pub const USER_ROLE: felt252 = selector!("USER_ROLE");
pub const ADVISOR_ROLE: felt252 = selector!("ADVISOR_ROLE");


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
    pub title: ByteArray,
    pub start_time: u64,
    pub end_time: u64,
}


#[derive(Drop, Serde, starknet::Store)]
pub struct OptionProposal {
    pub option_id: u64,
    pub description: ByteArray,
    // pub count_votes: u64,
}
