#[starknet::interface]
pub trait IDaoSphereFabric<TContractState> {
    fn create_dao(ref self: TContractState, name_dao: ByteArray);
    fn dao_id(self: @TContractState) -> u64;
}


#[starknet::contract]
pub mod DaoSphereFabric {
    use starknet::event::{EventEmitter};
    use core::num::traits::Zero;
    use starknet::storage::{StoragePathEntry, Map};
    use starknet::{get_caller_address, ContractAddress};
    use starknet::syscalls::{deploy_syscall};
    use starknet::class_hash::{class_hash_const, ClassHash};

    const DAO_SPHERE_CLASS_HASH: felt252 = 0x3d3e487d8de1fbecd2d761469e7e9f57f8abe3672ae3ec217d5b7b757fcd31f;

    #[derive(Drop, Serde, starknet::Store)]
    pub struct Dao {
        dao_address: ContractAddress,
        name_dao: ByteArray,
    }

    #[storage]
    struct Storage {
        dao_id: u64,
        daos: Map<u64, Dao>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        DaoCreated: DaoCreated,
    }

    #[derive(Drop, starknet::Event)]
    pub struct DaoCreated {
        dao_id: u64,
        name_dao: ByteArray,
        dao_address: ContractAddress,
    }


    fn verifyName(ref self: ContractState, dao_id: u64, name_dao: ByteArray) -> bool {
        let mut i: u64 = 0;

        let daoExist = loop {
            if self.daos.entry(i).read().name_dao == name_dao {
                break true;
            } else if i == dao_id {
                break false;
            }

            i += 1;
        };

        daoExist
    }

    #[abi(embed_v0)]
    pub impl DaoSphereFabric of super::IDaoSphereFabric<ContractState> {
        fn create_dao(ref self: ContractState, name_dao: ByteArray) {
            let caller: ContractAddress = get_caller_address();
            assert(caller.is_non_zero(), 'caller is zero');
            assert(name_dao.len() > 2, 'the DAO name is too short');

            let dao_id: u64 = self.dao_id.read();
            assert(!verifyName(ref self, dao_id, name_dao.clone()), 'name dao is already exist');

            let class_hash: ClassHash = class_hash_const::<DAO_SPHERE_CLASS_HASH>();
            let contract_address_salt: felt252 = dao_id.into();
            let calldata: Span<felt252> = array![caller.into()].span();

            let (dao_address, _) = deploy_syscall(
                class_hash, contract_address_salt, calldata, false,
            )
                .expect('error deploy failed');

            let new_dao: Dao = Dao { dao_address, name_dao: name_dao };
            self.daos.entry(dao_id).write(new_dao);

            let stored_dao = self.daos.entry(dao_id).read();

            self.emit(DaoCreated { dao_id, name_dao: stored_dao.name_dao, dao_address });

            self.dao_id.write(dao_id + 1);
            // dao_address
        }

        fn dao_id(self: @ContractState) -> u64 {
            self.dao_id.read()
        }
    }
}
