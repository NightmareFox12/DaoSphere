use starknet::ContractAddress;

#[starknet::interface]
trait IDaoSphere<TContractState> {
    fn address_exist(self: @TContractState) -> bool;
    fn create_proposal(ref self: TContractState, description: ByteArray, end_time: u64);

    fn is_admin(self: @TContractState, caller: ContractAddress) -> bool;
}

const USER_ROLE: felt252 = selector!("USER_ROLE");

#[starknet::contract]
mod DaoSphere {
    use core::num::traits::Zero;
    use openzeppelin_access::accesscontrol::interface::IAccessControlCamel;
    // use starknet::storage::StoragePathEntry;
    use AccessControlComponent::InternalTrait;
    use openzeppelin_access::accesscontrol::{DEFAULT_ADMIN_ROLE, AccessControlComponent};
    use openzeppelin_introspection::src5::SRC5Component;
    use starknet::{get_caller_address, ContractAddress};
    use starknet::storage::{Map};
    use starknet::syscalls::call_contract_syscall;
    use super::{USER_ROLE};

    component!(path: AccessControlComponent, storage: accesscontrol, event: AccessControlEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // AccessControl
    #[abi(embed_v0)]
    impl AccessControlImpl =
        AccessControlComponent::AccessControlImpl<ContractState>;
    impl AccessControlInternalImpl = AccessControlComponent::InternalImpl<ContractState>;

    // SRC5
    #[abi(embed_v0)]
    impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;

    //!LA IDEA QUE TENGO A FUTURO ES CREAR PROPUESTAS BASICAS CON 2 OPCIONES Y PROPUESTAS AVANZADAS
    //!QUE TENDRAN MUCHAS OPCIONES

    #[derive(Drop, Serde, starknet::Store)]
    struct Proposal {
        proposal_id: u64,
        creator_address: ContractAddress,
        description: ByteArray,
        start_time: u64,
        end_time: u64,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct OptionProposal {
        description: ByteArray,
        votes: u64,
    }


    #[storage]
    struct Storage {
        admin: ContractAddress,
        proposal_count: u64,
        proposal: Proposal,
        proposal_options: Map<(u64, u64), OptionProposal>,
        users: Map<u64, ContractAddress>,
        #[substorage(v0)]
        accesscontrol: AccessControlComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        User: User,
        #[flat]
        AccessControlEvent: AccessControlComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
    }

    #[derive(Drop, starknet::Event)]
    struct User {
        id: u64,
        address: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, admin: ContractAddress) {
        self.accesscontrol.initializer();
        self.accesscontrol._grant_role(DEFAULT_ADMIN_ROLE, admin);
    }

    fn has_any_role(self: @ContractState, caller: ContractAddress, roles: Array<felt252>) -> bool {
        let mut i: u32 = 0;
        // let len = roles.len();

        let res = loop {
            // if len == i {
            //     break false;
            // }
            if self.accesscontrol.hasRole(*roles.at(i), caller) {
                break true;
            }
            i += 1;
        };
        res
    }

    #[abi(embed_v0)]
    impl DaoSphere of super::IDaoSphere<ContractState> {
        fn create_proposal(ref self: ContractState, description: ByteArray, end_time: u64) {
            assert(description.len() > 3, 'Description is too short');

            // let proposal_id = self.proposal_count.read();
            // self.proposal_count.write(proposal_id + 1);

            let caller = get_caller_address();
            let jose = call_contract_syscall(
                caller, selector!("is_valid_signature"), array![0_felt252, 0_felt252].span(),
            );

            assert(jose.is_err(), 'la cagaste chamo');
            // let juan2 = jose.expect('juan');

            // let res = *juan2.at(0);
        // println!("juan2 {:?}", res);

        }

        fn address_exist(self: @ContractState) -> bool {
            let roles = array![DEFAULT_ADMIN_ROLE, USER_ROLE];
            let address_exist = has_any_role(self, get_caller_address(), roles);

            address_exist
        }

        fn is_admin(self: @ContractState, caller: ContractAddress) -> bool {
            assert(caller.is_non_zero(), 'ey la cagaste');
            let isAdmin = self.accesscontrol.hasRole(DEFAULT_ADMIN_ROLE, caller);

            isAdmin
        }
    }
}
