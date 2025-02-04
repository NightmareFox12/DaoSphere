use contracts::DaoSphereFabric::{IDaoSphereFabricDispatcher, IDaoSphereFabricDispatcherTrait};

use snforge_std::{
    ContractClassTrait, DeclareResultTrait, declare, DeclareResult, EventSpyTrait, spy_events,
};
use starknet::{ContractAddress};

fn deploy_contract(name: ByteArray) -> ContractAddress {
    let contract_class = declare(name).unwrap().contract_class();
    let mut calldata = array![];
    let (contract_address, _) = contract_class.deploy(@calldata).unwrap();

    contract_address
}


#[test]
fn test_init_contract() {
    println!("deploy DaoSphereFabric...");
    let contract_address = deploy_contract("DaoSphereFabric");

    let dispatcher = IDaoSphereFabricDispatcher { contract_address };

    assert(dispatcher.dao_id() == 0_u64, 'the initial daoID must be 0');

    println!("deploy successfull");
}

#[test]
fn test_create_dao_public() {
    let result: Result<DeclareResult, Array<felt252>> = declare("DaoSphere");

    assert(result.is_ok(), 'error to deploy contract');

    let contract_address = deploy_contract("DaoSphereFabric");
    let dispatcher = IDaoSphereFabricDispatcher { contract_address };
    let mut spy = spy_events();

    println!("creating dao public...");

    let dao_address = dispatcher.create_dao("name testing", true);
    println!("dao_address: {:?}", dao_address);

    let invalid_address: ContractAddress = 0.try_into().unwrap();

    assert(dao_address != invalid_address, 'The DAO address should be valid');

    let events = spy.get_events();
    let eventsLength = events.events.len();

    println!("total events emit {}", eventsLength);
    assert(eventsLength == 1, 'There should be one event');
}

#[test]
fn test_create_dao_private() {
    let result: Result<DeclareResult, Array<felt252>> = declare("DaoSphere");

    assert(result.is_ok(), 'error to deploy contract');

    let contract_address = deploy_contract("DaoSphereFabric");
    let dispatcher = IDaoSphereFabricDispatcher { contract_address };
    let mut spy = spy_events();

    println!("creating dao public...");

    let dao_address = dispatcher.create_dao("name testing", false);
    println!("dao_address: {:?}", dao_address);

    let invalid_address: ContractAddress = 0.try_into().unwrap();

    assert(dao_address != invalid_address, 'The DAO address should be valid');

    let events = spy.get_events();
    let eventsLength = events.events.len();

    println!("total events emit {}", eventsLength);
    assert(eventsLength == 0, 'There should be one event');
}
