use starknet::ContractAddress;
use super::models::DaoSphereModel;

#[starknet::interface]
trait IDaoSphere<TContractState> {
    fn create_proposal(ref self: TContractState, description: ByteArray, end_time: u64);
    fn modify_vote_creation_access(
        ref self: TContractState, vote_creation_access: DaoSphereModel::VoteCreationAccess,
    );
    fn get_vote_creation_access(self: @TContractState) -> DaoSphereModel::VoteCreationAccess;

    fn is_admin(self: @TContractState, caller: ContractAddress) -> bool;
    fn is_advisor(self: @TContractState, caller: ContractAddress) -> bool;
    fn is_user(self: @TContractState, caller: ContractAddress) -> bool;

    // handle user
    fn create_user(ref self: TContractState, userAddress: ContractAddress);
    fn get_users(self: @TContractState) -> Array<DaoSphereModel::User>;
    fn modify_user(ref self: TContractState, user_id: u64);
    fn get_user(self: @TContractState, userAddress: ContractAddress) -> DaoSphereModel::User;

    // handle advisor
    fn create_advisor(ref self: TContractState, advisorAddress: ContractAddress);
    fn get_advisors(self: @TContractState) -> Array<DaoSphereModel::Advisor>;
    fn modify_advisor(ref self: TContractState, advisor_id: u64);
    fn get_advisor(
        self: @TContractState, advisorAddress: ContractAddress,
    ) -> DaoSphereModel::Advisor;
}

const USER_ROLE: felt252 = selector!("USER_ROLE");
const ADVISOR_ROLE: felt252 = selector!("ADVISOR_ROLE");

#[starknet::contract]
mod DaoSphere {
    use starknet::event::EventEmitter;
    use starknet::storage::StoragePathEntry;
    use core::num::traits::Zero;
    use openzeppelin_access::accesscontrol::interface::IAccessControlCamel;
    use AccessControlComponent::InternalTrait;
    use openzeppelin_access::accesscontrol::{DEFAULT_ADMIN_ROLE, AccessControlComponent};
    use openzeppelin_introspection::src5::SRC5Component;
    use starknet::{get_caller_address, ContractAddress, get_block_timestamp};
    use starknet::storage::{Map};
    use starknet::syscalls::call_contract_syscall;
    use super::{USER_ROLE, ADVISOR_ROLE};
    use super::DaoSphereModel::{User, Advisor, VoteCreationAccess};

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

    // #[derive(Drop, Serde, starknet::Store)]
    // struct Proposal {
    //     proposal_id: u64,
    //     creator_address: ContractAddress,
    //     description: ByteArray,
    //     start_time: u64,
    //     end_time: u64,
    // }

    // #[derive(Drop, Serde, starknet::Store)]
    // struct OptionProposal {
    //     description: ByteArray,
    //     votes: u64,
    // }

    #[storage]
    struct Storage {
        admin: ContractAddress,
        proposal_count: u64,
        // proposal: Proposal,
        // proposal_options: Map<(u64, u64), OptionProposal>,
        vote_creation_access: VoteCreationAccess,
        user_count: u64,
        users: Map<u64, User>,
        advisor_count: u64,
        advisors: Map<u64, Advisor>,
        #[substorage(v0)]
        accesscontrol: AccessControlComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        CreatedUser: CreatedUser,
        CreatedAdvisor: CreatedAdvisor,
        #[flat]
        AccessControlEvent: AccessControlComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
    }

    #[derive(Drop, starknet::Event)]
    struct CreatedUser {
        user_id: u64,
        address: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct CreatedAdvisor {
        advisor_id: u64,
        address: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, admin: ContractAddress) {
        self.accesscontrol.initializer();
        self.accesscontrol._grant_role(DEFAULT_ADMIN_ROLE, admin);
        self.vote_creation_access.write(VoteCreationAccess::All);
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
        // match VoteCreationAccess::Admin {
        //     VoteCreationAccess::Admin => {
        //         assert(self.is_admin(caller), 'Caller is not admin');
        //     },
        //     VoteCreationAccess::AdminOrAdvisor => {
        //         assert(self.is_admin(caller) || self.is_advisor(caller), 'Caller is not admin
        //         or advisor');
        //     },
        //     VoteCreationAccess::All => {
        //         assert(self.is_admin(caller) || self.is_advisor(caller) ||
        //         self.is_user(caller), 'Caller is not admin or advisor or user');
        //     },
        // }
        }


        fn is_admin(self: @ContractState, caller: ContractAddress) -> bool {
            assert(caller.is_non_zero(), 'admin address is not valid');
            let isAdmin = self.accesscontrol.hasRole(DEFAULT_ADMIN_ROLE, caller);

            isAdmin
        }

        fn is_advisor(self: @ContractState, caller: ContractAddress) -> bool {
            let isAdvisor = self.accesscontrol.hasRole(ADVISOR_ROLE, caller);

            isAdvisor
        }

        fn is_user(self: @ContractState, caller: ContractAddress) -> bool {
            let isUser = self.accesscontrol.hasRole(USER_ROLE, caller);

            isUser
        }

        fn modify_vote_creation_access(
            ref self: ContractState, vote_creation_access: VoteCreationAccess,
        ) {
            let caller = get_caller_address();
            assert(self.is_admin(caller), 'Caller is not admin');

            self.vote_creation_access.write(vote_creation_access);
        }

        fn get_vote_creation_access(self: @ContractState) -> VoteCreationAccess {
            self.vote_creation_access.read()
        }

        //handle user
        fn create_user(ref self: ContractState, userAddress: ContractAddress) {
            let caller = get_caller_address();
            assert(
                self.accesscontrol.hasRole(DEFAULT_ADMIN_ROLE, caller)
                    || self.accesscontrol.hasRole(ADVISOR_ROLE, caller),
                'Caller not admin or advisor',
            );

            assert(userAddress.is_non_zero(), 'Invalid user address');
            assert(!self.accesscontrol.hasRole(USER_ROLE, userAddress), 'User already exists');
            assert(
                !self.accesscontrol.hasRole(ADVISOR_ROLE, userAddress), 'Advisor cannot be a user',
            );
            assert(userAddress != caller, 'Admin cannot be a user');

            self.accesscontrol.grantRole(USER_ROLE, userAddress);
            let user_id = self.user_count.read();

            self
                .users
                .entry(user_id)
                .write(
                    User {
                        user_id: user_id,
                        address: userAddress,
                        unlock: true,
                        date: get_block_timestamp(),
                    },
                );

            self.emit(CreatedUser { user_id: user_id, address: userAddress });
            self.user_count.write(user_id + 1);
        }

        fn get_users(self: @ContractState) -> Array<User> {
            let mut user_arr: Array<User> = ArrayTrait::<User>::new();

            let limit: u64 = self.user_count.read();
            let mut i: u64 = 0;

            loop {
                if i == limit {
                    break;
                }
                user_arr.append(self.users.entry(i).read());
                i += 1;
            };

            user_arr
        }

        fn modify_user(ref self: ContractState, user_id: u64) {
            let caller = get_caller_address();
            assert(
                self.accesscontrol.hasRole(DEFAULT_ADMIN_ROLE, caller)
                    || self.accesscontrol.hasRole(ADVISOR_ROLE, caller),
                'Caller not admin or advisor',
            );

            if self.accesscontrol.hasRole(ADVISOR_ROLE, caller) {
                let limit: u64 = self.advisor_count.read();
                let mut i: u64 = 0;

                let advisor_exist: Advisor = loop {
                    if i == limit {
                        break Advisor {
                            advisor_id: 0, address: 0.try_into().unwrap(), unlock: true, date: 0,
                        };
                    }
                    if self.advisors.entry(i).read().address == caller {
                        break self.advisors.entry(i).read();
                    }
                    i += 1;
                };

                assert(advisor_exist.unlock == true, 'Advisor blocked');
            }

            let mut user = self.users.entry(user_id).read();
            user.unlock = !user.unlock;
            self.users.entry(user_id).write(user);
        }

        fn get_user(self: @ContractState, userAddress: ContractAddress) -> User {
            let mut limit: u64 = self.user_count.read();
            let mut i: u64 = 0;

            let mut user: User = loop {
                if i == limit {
                    break User {
                        user_id: 0, address: 0.try_into().unwrap(), unlock: true, date: 0,
                    };
                }

                if self.users.entry(i).read().address == userAddress {
                    break self.users.entry(i).read();
                }
                i += 1;
            };

            user
        }

        // handle advisor
        fn create_advisor(ref self: ContractState, advisorAddress: ContractAddress) {
            let caller = get_caller_address();

            assert(self.accesscontrol.hasRole(DEFAULT_ADMIN_ROLE, caller), 'Caller is not admin');
            assert(advisorAddress.is_non_zero(), 'Invalid advisor address');
            assert(advisorAddress != caller, 'Admin cannot be a advisor');
            assert(
                !self.accesscontrol.hasRole(USER_ROLE, advisorAddress), 'Advisor already exists',
            );
            assert(
                !self.accesscontrol.hasRole(USER_ROLE, advisorAddress), 'Advisor cannot be a user',
            );

            self.accesscontrol.grantRole(ADVISOR_ROLE, advisorAddress);

            let advisor_id = self.advisor_count.read();
            self
                .advisors
                .entry(advisor_id)
                .write(
                    Advisor {
                        advisor_id: advisor_id,
                        address: advisorAddress,
                        unlock: true,
                        date: get_block_timestamp(),
                    },
                );

            self.emit(CreatedAdvisor { advisor_id: advisor_id, address: advisorAddress });
            self.advisor_count.write(advisor_id + 1);
        }

        fn get_advisors(self: @ContractState) -> Array<Advisor> {
            let mut advisor_arr: Array<Advisor> = ArrayTrait::<Advisor>::new();

            let limit: u64 = self.advisor_count.read();
            let mut i: u64 = 0;

            loop {
                if i == limit {
                    break;
                }
                advisor_arr.append(self.advisors.entry(i).read());
                i += 1;
            };

            advisor_arr
        }

        fn modify_advisor(ref self: ContractState, advisor_id: u64) {
            let caller = get_caller_address();
            assert(self.accesscontrol.hasRole(DEFAULT_ADMIN_ROLE, caller), 'Caller is not admin');

            let mut advisor = self.advisors.entry(advisor_id).read();
            advisor.unlock = !advisor.unlock;
            self.advisors.entry(advisor_id).write(advisor);
        }

        fn get_advisor(self: @ContractState, advisorAddress: ContractAddress) -> Advisor {
            let mut limit: u64 = self.advisor_count.read();
            let mut i: u64 = 0;

            let mut advisor: Advisor = loop {
                if i == limit {
                    break Advisor {
                        advisor_id: 0, address: 0.try_into().unwrap(), unlock: true, date: 0,
                    };
                }
                if self.advisors.entry(i).read().address == advisorAddress {
                    break self.advisors.entry(i).read();
                }
                i += 1;
            };
            advisor
        }
    }
}
