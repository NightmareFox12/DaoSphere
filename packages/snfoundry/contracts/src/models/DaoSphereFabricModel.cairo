use starknet::ContractAddress;

#[derive(Drop, Serde, starknet::Store)]
pub struct Dao {
    pub dao_id: u64,
    pub name_dao: ByteArray,
    pub dao_address: ContractAddress,
    pub deploy_block: u64,
}
