use starknet::ContractAddress;
use super::models::DaoSphereModel;

#[starknet::interface]
pub trait IDaoSphere<TContractState> {
    //data
    fn proposal_count(self: @TContractState) -> u64;
    fn vote_selected_access(self: @TContractState) -> DaoSphereModel::VoteCreationAccess;

    //handle roles
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

    // handle proposal
    fn modify_vote_creation_access(ref self: TContractState, new_access: ByteArray);
    fn create_proposal_basic(ref self: TContractState, title: ByteArray, end_time: u64);
    fn get_my_proposals(
        self: @TContractState, caller: ContractAddress,
    ) -> Array<DaoSphereModel::Proposal>;

    fn set_vote_proposal(ref self: TContractState, proposal_id: u64, vote_choice: bool);
    // fn get_votes_proposal(
// self: @TContractState, proposal_id: u64,
// ) -> Array<DaoSphereModel::ProposalVoted>;

    // fn create_proposal_multiple(
//     ref self: TContractState,
//     title: ByteArray,
//     end_time: u64,
//     options: Array<DaoSphereModel::OptionProposal>,
// );
}

#[starknet::contract]
pub mod DaoSphere {
    use starknet::event::EventEmitter;
    use starknet::storage::{StoragePathEntry, Map};
    use starknet::{
        get_caller_address, ContractAddress, get_block_timestamp, contract_address_const,
    };
    use core::num::traits::Zero;
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin_access::accesscontrol::interface::IAccessControlCamel;
    use AccessControlComponent::InternalTrait;
    use openzeppelin_access::accesscontrol::{DEFAULT_ADMIN_ROLE, AccessControlComponent};
    use openzeppelin_introspection::src5::SRC5Component;
    use super::DaoSphereModel::{
        User, Advisor, VoteCreationAccess, Proposal, USER_ROLE, ADVISOR_ROLE, STRK_CONTRACT_ADDRESS,
        ETH_CONTRACT_ADDRESS, ProposalVoted,
    };

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

    #[storage]
    struct Storage {
        dao_sphere_fabric: ContractAddress,
        proposal_count: u64,
        proposals: Map<u64, Proposal>,
        proposals_voted: Map<u64, ProposalVoted>,
        // proposal_options: Map<u64, OptionProposal>,
        vote_selected_access: VoteCreationAccess,
        user_count: u64,
        users: Map<u64, User>,
        advisor_count: u64,
        advisors: Map<u64, Advisor>,
        #[substorage(v0)]
        accesscontrol: AccessControlComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState, admin: ContractAddress, dao_sphere_fabric: ContractAddress,
    ) {
        self.accesscontrol.initializer();
        self.accesscontrol._grant_role(DEFAULT_ADMIN_ROLE, admin);
        self.vote_selected_access.write(VoteCreationAccess::AdminOrAdvisor(true));
        self.dao_sphere_fabric.write(dao_sphere_fabric);
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        CreatedUser: CreatedUser,
        CreatedAdvisor: CreatedAdvisor,
        CreatedProposal: CreatedProposal,
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

    #[derive(Drop, starknet::Event)]
    struct CreatedProposal {
        proposal_id: u64,
        creator_address: ContractAddress,
        title: ByteArray,
        start_time: u64,
        end_time: u64,
    }


    #[abi(embed_v0)]
    impl DaoSphere of super::IDaoSphere<ContractState> {
        //data
        fn proposal_count(self: @ContractState) -> u64 {
            self.proposal_count.read()
        }

        fn vote_selected_access(self: @ContractState) -> VoteCreationAccess {
            self.vote_selected_access.read()
        }

        //handle roles
        fn is_admin(self: @ContractState, caller: ContractAddress) -> bool {
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

            let advisor_exist: Advisor = self.get_advisor(userAddress);
            assert(advisor_exist.unlock == true, 'Advisor blocked');

            self.accesscontrol.grantRole(USER_ROLE, userAddress);
            let user_id = self.user_count.read();

            self
                .users
                .write(
                    user_id,
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
                !self.accesscontrol.hasRole(USER_ROLE, advisorAddress), 'User cannot be a advisor',
            );
            assert(
                !self.accesscontrol.hasRole(ADVISOR_ROLE, advisorAddress), 'Advisor already exists',
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

        // handle proposal
        fn modify_vote_creation_access(ref self: ContractState, new_access: ByteArray) {
            let caller = get_caller_address();
            assert(self.is_admin(caller), 'Caller is not admin');

            self.vote_selected_access.write(VoteCreationAccess::Admin(false));
            self.vote_selected_access.write(VoteCreationAccess::AdminOrAdvisor(false));
            self.vote_selected_access.write(VoteCreationAccess::All(false));

            if new_access == "Admin" {
                self.vote_selected_access.write(VoteCreationAccess::Admin(true));
            } else if new_access == "AdminOrAdvisor" {
                self.vote_selected_access.write(VoteCreationAccess::AdminOrAdvisor(true));
            } else if new_access == "All" {
                self.vote_selected_access.write(VoteCreationAccess::All(true));
            };
        }

        fn create_proposal_basic(ref self: ContractState, title: ByteArray, end_time: u64) {
            let caller: ContractAddress = get_caller_address();
            let proposal_id = self.proposal_count.read();

            assert(title.len() > 3, 'Title is too short');
            assert(end_time > get_block_timestamp(), 'End time is in the past');

            self._validate_vote_access(caller);

            self
                .proposals
                .write(
                    proposal_id,
                    Proposal {
                        proposal_id,
                        creator_address: caller,
                        title,
                        start_time: get_block_timestamp(),
                        end_time,
                    },
                );

            self
                .emit(
                    CreatedProposal {
                        proposal_id,
                        creator_address: caller,
                        title: self.proposals.read(proposal_id).title,
                        start_time: get_block_timestamp(),
                        end_time,
                    },
                );

            self.proposal_count.write(proposal_id + 1);
        }

        fn get_my_proposals(self: @ContractState, caller: ContractAddress) -> Array<Proposal> {
            assert(caller.is_non_zero(), 'Invalid caller address');
            let mut proposals_arr: Array<Proposal> = ArrayTrait::<Proposal>::new();

            let mut i: u64 = 0;
            let limit: u64 = self.proposal_count.read();

            loop {
                if i == limit {
                    break Proposal {
                        proposal_id: 0,
                        creator_address: 0.try_into().unwrap(),
                        title: "",
                        start_time: 0,
                        end_time: 0,
                    };
                }
                if self.proposals.read(i).creator_address == caller {
                    proposals_arr.append(self.proposals.read(i));
                }
                i += 1;
            };

            proposals_arr
        }

        //    fn get_votes_proposal(
        //     self: @ContractState, proposal_id: u64,
        // ) -> Array<DaoSphereModel::ProposalVoted> {
        //     self.proposals_voted.read(proposal_id)
        //     }

        fn set_vote_proposal(ref self: ContractState, proposal_id: u64, vote_choice: bool) {
            let caller = get_caller_address();

            assert(self.proposals.read(proposal_id).end_time > get_block_timestamp(), 'Proposal ended');

            let proposal_voted: ProposalVoted = self.proposals_voted.read(proposal_id);
            assert(proposal_voted.voter_address != caller, 'You already voted');

            //TODO:  aqui se debe validar con loop que el votante no vote mas de una vez. 
            self
                .proposals_voted
                .write(
                    proposal_id, ProposalVoted { proposal_id, vote_choice, voter_address: caller },
                );
        }
        // fn create_proposal_multiple(
    //     ref self: ContractState,
    //     title: ByteArray,
    //     end_time: u64,
    //     options: Array<OptionProposal>,
    // ) {
    //     let caller: ContractAddress = get_caller_address();
    //     let proposal_id = self.proposal_count.read();

        //     assert(title.len() > 3, 'Title is too short');
    //     assert(end_time > get_block_timestamp(), 'End time is in the past');

        //     self._validate_vote_access(caller);

        //     self
    //         .proposal
    //         .write(
    //             Proposal {
    //                 proposal_id: proposal_id,
    //                 creator_address: caller,
    //                 title: title,
    //                 start_time: get_block_timestamp(),
    //                 end_time: end_time,
    //             },
    //         );

        //     let mut option_counter: u64 = 0;

        //     // loop {
    //     //     self
    //     //         .proposal_options
    //     //         .write(
    //     //             proposal_id,
    //     //             OptionProposal {

        //     //                 option_id: option_counter,
    //     //                 description: options[option_counter].description,
    //     //             },
    //     //         );
    //     //     option_counter += 1;
    //     // };

        //     // self
    //     //     .emit(
    //     //         CreatedProposal {
    //     //             proposal_id: proposal_id,
    //     //             creator_address: caller,
    //     //             start_time: get_block_timestamp(),
    //     //             end_time: end_time,
    //     //         },
    //     //     );

        //     self.proposal_count.write(proposal_id + 1);
    // }
    }

    #[generate_trait]
    pub impl Private of PrivateDaoSphereTrait {
        fn _validate_vote_access(ref self: ContractState, caller: ContractAddress) {
            match self.vote_selected_access.read() {
                VoteCreationAccess::Admin => {
                    assert(
                        self.accesscontrol.hasRole(DEFAULT_ADMIN_ROLE, caller),
                        'Caller is not admin',
                    );
                },
                VoteCreationAccess::AdminOrAdvisor => {
                    assert(
                        self.accesscontrol.hasRole(DEFAULT_ADMIN_ROLE, caller)
                            || self.accesscontrol.hasRole(ADVISOR_ROLE, caller),
                        'Caller not admin or advisor',
                    );
                },
                VoteCreationAccess::All => {
                    if !self.accesscontrol.hasRole(DEFAULT_ADMIN_ROLE, caller)
                        || !self.accesscontrol.hasRole(ADVISOR_ROLE, caller)
                        || !self.accesscontrol.hasRole(USER_ROLE, caller) {
                        let user_id = self.user_count.read();
                        self
                            .users
                            .write(
                                user_id,
                                User {
                                    user_id: user_id,
                                    address: caller,
                                    unlock: true,
                                    date: get_block_timestamp(),
                                },
                            );

                        self.emit(CreatedUser { user_id: user_id, address: caller });
                        self.user_count.write(user_id + 1);
                    }
                },
            }
        }

        fn _get_token_dispatcher(
            ref self: ContractState, token: ContractAddress,
        ) -> IERC20Dispatcher {
            return IERC20Dispatcher { contract_address: token };
        }

        fn _require_supported_token(ref self: ContractState, token: ContractAddress) {
            assert(
                token == contract_address_const::<STRK_CONTRACT_ADDRESS>()
                    || token == contract_address_const::<ETH_CONTRACT_ADDRESS>(),
                'Unsupported token',
            );
        }
    }
}
