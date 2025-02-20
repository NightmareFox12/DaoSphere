use starknet::ContractAddress;
use super::models::DaoSphereFabricModel;

#[starknet::interface]
pub trait IDaoSphereFabric<TContractState> {
    //handle dao
    fn create_dao(ref self: TContractState, name_dao: ByteArray);
    fn get_daos(self: @TContractState) -> Array<DaoSphereFabricModel::Dao>;

    //handle data
    fn get_deploy_block(self: @TContractState) -> u64;
    fn add_owner(ref self: TContractState, owner: ContractAddress);
    fn withdraw(ref self: TContractState);

    //vars
    fn dao_id(self: @TContractState) -> u64;
}


#[starknet::contract]
pub mod DaoSphereFabric {
    use starknet::{
        get_caller_address, ContractAddress, get_block_number, get_contract_address,
        contract_address_const,
    };
    use starknet::event::EventEmitter;
    use starknet::storage::Map;
    use starknet::syscalls::deploy_syscall;
    use starknet::class_hash::{class_hash_const, ClassHash};
    use core::num::traits::Zero;
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use super::DaoSphereFabricModel::{Dao};

    //constants
    const DAO_SPHERE_CLASS_HASH: felt252 =
        0x75f30da5c2f6b1dda9accf3d6f00d83b47c7aa23251419fe6af80e3aa3569ec;
    const STRK_CONTRACT_ADDRESS: felt252 =
        0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d;

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.deploy_block.write(get_block_number());
        self.owners.write(self.owner_count.read(), owner);
        self.owner_count.write(self.owner_count.read() + 1);
    }

    #[storage]
    struct Storage {
        owner_count: u64,
        owners: Map<u64, ContractAddress>,
        dao_id: u64,
        dao_name: Map<u64, ByteArray>,
        daos: Map<u64, Dao>,
        deploy_block: u64,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        OwnerAdded: OwnerAdded,
    }

    #[derive(Drop, starknet::Event)]
    pub struct OwnerAdded {
        owner_id: u64,
        #[key]
        owner: ContractAddress,
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
        //handle dao
        fn create_dao(ref self: ContractState, name_dao: ByteArray) {
            let caller: ContractAddress = get_caller_address();
            let this: ContractAddress = get_contract_address();

            assert(caller.is_non_zero(), 'caller is zero');
            assert(name_dao.len() > 2, 'the DAO name is too short');

            let dao_id: u64 = self.dao_id.read();
            assert(!verifyName(ref self, dao_id, name_dao.clone()), 'name dao is already exist');

            let class_hash: ClassHash = class_hash_const::<DAO_SPHERE_CLASS_HASH>();
            let contract_address_salt: felt252 = dao_id.into();

            let mut data = ArrayTrait::new();
            data.append(caller.into());
            data.append(this.into());

            let calldata: Span<felt252> = data.span();

            let (dao_address, _) = deploy_syscall(
                class_hash, contract_address_salt, calldata, false,
            )
                .expect('error deploy failed');

            self.dao_name.write(dao_id, name_dao);
            let stored_dao = self.dao_name.read(dao_id);

            self
                .daos
                .write(
                    dao_id,
                    Dao {
                        dao_id, name_dao: stored_dao, dao_address, deploy_block: get_block_number(),
                    },
                );

            self.dao_id.write(dao_id + 1);
        }

        fn get_daos(self: @ContractState) -> Array<Dao> {
            let mut dao_arr: Array<Dao> = ArrayTrait::<Dao>::new();

            let mut i = 0;
            let limit = self.dao_id.read();

            loop {
                if i == limit {
                    break;
                }

                dao_arr.append(self.daos.read(i));
                i += 1;
            };

            dao_arr
        }

        //handle data
        fn get_deploy_block(self: @ContractState) -> u64 {
            self.deploy_block.read()
        }

        fn add_owner(ref self: ContractState, owner: ContractAddress) {
            let caller: ContractAddress = get_caller_address();
            let owner_count: u64 = self.owner_count.read();
            assert(caller.is_non_zero(), 'caller is zero');

            self._is_owner(caller);

            let mut i: u64 = 0;
            let is_owner = loop {
                if self.owners.read(i) == owner {
                    break true;
                } else if i == owner_count {
                    break false;
                }

                i += 1;
            };

            assert(!is_owner, 'owner is already exist');

            self.owners.write(owner_count, owner);
            self.owner_count.write(owner_count + 1);

            self.emit(OwnerAdded { owner_id: owner_count, owner });
        }

        fn withdraw(ref self: ContractState) {
            let caller: ContractAddress = get_caller_address();
            let this: ContractAddress = get_contract_address();
            assert(caller.is_non_zero(), 'caller is zero');

            self._is_owner(caller);

            let strk_dispatcher: IERC20Dispatcher = self
                ._get_token_dispatcher(contract_address_const::<STRK_CONTRACT_ADDRESS>());

            assert(strk_dispatcher.balance_of(this) > 0, 'no STRK');
            strk_dispatcher.transfer(caller, strk_dispatcher.balance_of(this));
        }

        //vars
        fn dao_id(self: @ContractState) -> u64 {
            self.dao_id.read()
        }
    }

    //internal
    #[generate_trait]
    impl Private of PrivateDaoSphereFabricTrait {
        fn _is_owner(self: @ContractState, caller: ContractAddress) {
            let owner_count: u64 = self.owner_count.read();

            let mut i: u64 = 0;
            let is_owner = loop {
                if self.owners.read(i) == caller {
                    break true;
                } else if i == owner_count {
                    break false;
                }

                i += 1;
            };

            assert(is_owner, 'caller is not owner');
        }

        fn _get_token_dispatcher(
            ref self: ContractState, token: ContractAddress,
        ) -> IERC20Dispatcher {
            return IERC20Dispatcher { contract_address: token };
        }
    }
}
