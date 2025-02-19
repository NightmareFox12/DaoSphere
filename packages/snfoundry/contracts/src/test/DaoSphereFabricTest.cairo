use contracts::DaoSphereFabric::{IDaoSphereFabricDispatcher, IDaoSphereFabricDispatcherTrait};

//TODO: AGREGAR TODO EL APARTADO DEL WITHDRAW, COMO POR EJEMPLO VERIFICAR QUE HAYA EL ERROR AL LLAMAR LA FUNCION SIN SER ADMINISTRADOR Y SI NO HAY STRK

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
fn test_create_dao() {
    let mut spy = spy_events();

    let result: Result<DeclareResult, Array<felt252>> = declare("DaoSphere");

    assert(result.is_ok(), 'error to deploy contract');

    let contract_address = deploy_contract("DaoSphereFabric");
    let dispatcher = IDaoSphereFabricDispatcher { contract_address };

    println!("creating dao public...");

    dispatcher.create_dao("name testing");

    let events = spy.get_events();
    let eventsLength = events.events.len();

    println!("total events emit {}", eventsLength);
    assert(eventsLength > 0, 'No events emit');
}

#[test]
#[should_panic(expected: 'name dao is already exist')]
fn test_create_dao_with_same_name() {
    let mut spy = spy_events();

    let result: Result<DeclareResult, Array<felt252>> = declare("DaoSphere");

    assert(result.is_ok(), 'error to deploy contract');

    let contract_address = deploy_contract("DaoSphereFabric");
    let dispatcher = IDaoSphereFabricDispatcher { contract_address };

    dispatcher.create_dao("name testing");
    dispatcher.create_dao("name testing");

    let events = spy.get_events();
    let eventsLength = events.events.len();
    assert(eventsLength == 2, 'name dao is already exist');
}
