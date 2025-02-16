use starknet::ContractAddress;
#[starknet::interface]
pub trait IDaoSphereFabric<TContractState> {
    fn create_dao(ref self: TContractState, name_dao: ByteArray);
    fn dao_id(self: @TContractState) -> u64;
    fn get_deploy_block(self: @TContractState) -> u64;
    fn add_admin(ref self: TContractState, admin: ContractAddress);
}


#[starknet::contract]
pub mod DaoSphereFabric {
    use starknet::{get_caller_address, ContractAddress, get_block_number, get_contract_address};
    use starknet::event::EventEmitter;
    use starknet::storage::Map;
    use starknet::syscalls::deploy_syscall;
    use starknet::class_hash::{class_hash_const, ClassHash};
    use core::num::traits::Zero;

    const DAO_SPHERE_CLASS_HASH: felt252 =
        0x46a225465e31fd9008fc0e145597f7eb380cbcac63464b20674e21d8a0af024;

    #[constructor]
    fn constructor(ref self: ContractState, admin: ContractAddress) {
        self.deploy_block.write(get_block_number());
        self.admin.write(self.admin_count.read(), admin);
        self.admin_count.write(self.admin_count.read() + 1);
    }

    #[storage]
    struct Storage {
        admin_count: u64,
        admin: Map<u64, ContractAddress>,
        dao_id: u64,
        dao_name: Map<u64, ByteArray>,
        deploy_block: u64,
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
        deploy_block: u64,
    }


    fn verifyName(ref self: ContractState, dao_id: u64, name_dao: ByteArray) -> bool {
        let mut i: u64 = 0;

        let daoExist = loop {
            if self.dao_name.read(i) == name_dao {
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
            let this: ContractAddress = get_contract_address();

            assert(caller.is_non_zero(), 'caller is zero');
            assert(name_dao.len() > 2, 'the DAO name is too short');

            let dao_id: u64 = self.dao_id.read();
            assert(!verifyName(ref self, dao_id, name_dao.clone()), 'name dao is already exist');

            let class_hash: ClassHash = class_hash_const::<DAO_SPHERE_CLASS_HASH>();
            let contract_address_salt: felt252 = dao_id.into();
            let calldata: Span<felt252> = array![caller.into(), this.into()].span();

            let (dao_address, _) = deploy_syscall(
                class_hash, contract_address_salt, calldata, false,
            )
                .expect('error deploy failed');

            self.dao_name.write(dao_id, name_dao);
            let stored_dao = self.dao_name.read(dao_id);

            self
                .emit(
                    DaoCreated {
                        dao_id, name_dao: stored_dao, dao_address, deploy_block: get_block_number(),
                    },
                );

            self.dao_id.write(dao_id + 1);
        }

        fn dao_id(self: @ContractState) -> u64 {
            self.dao_id.read()
        }

        fn get_deploy_block(self: @ContractState) -> u64 {
            self.deploy_block.read()
        }

        fn add_admin(ref self: ContractState, admin: ContractAddress) {
            let caller: ContractAddress = get_caller_address();
            assert(caller.is_non_zero(), 'caller is zero');

            let mut i: u64 = 0;
            let is_admin = loop {
                if self.admin.read(i) == caller {
                    break true;
                }

                i += 1;
            };

            assert(is_admin, 'caller is not admin');
            self.admin.write(self.admin_count.read(), admin);
            self.admin_count.write(self.admin_count.read() + 1);
        }
    }
}
