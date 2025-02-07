use starknet::{ContractAddress};

#[derive(Drop, Serde, starknet::Store)]
pub struct Dao {
    pub dao_address: ContractAddress,
    pub name_dao: ByteArray,
}

