# DAOSPHERE 🌐

**DaoSphere** is a Decentralized Application (dApp) that is designed to make it easier for DAOs to make decisions to resolve problems or cases that affect them 🗳️. To do this, a voting system is used that is transparent, effective, and secure, which eliminates the need to depend on some central body to solve the problem. Instead, each member has a say within the DAO.

## Justification 📋

The need to create a "Voting System" that is completely decentralized arises from the constant pursuit of increasing transparency and trust in decision-making processes 🔍. A DAO represents an evolution in organizational governance, as it promotes member participation, which minimizes the possibility of corruption by a central authority.

Therefore, DaoSphere is part of this important trend, offering its users a platform that integrates the opportunity to influence the important decisions of the DAO to which they belong, guaranteeing fair resolutions and reflecting the collective consensus 🤝.

## Functionality 🔧

At a general level, DaoSphere is divided into three key steps, which must be followed so that the effective participation of all DAO members can be ensured. 👥.

1. **DAO Registration**: This step will be carried out by the DAO Administrator. When registration is completed successfully, the DAO is recognized within the dApp 📝.
2. **Adding Members**: Once the DAO is registered, the administrator can add the members of the organization. Members will be able to actively participate in voting 🗳️.
3. **Registration of Problems**: The problems or cases to be resolved can be registered on the platform. This allows them to be subject to the Voting System 📜.

## Functional Requirements ⚙️

- **User Authentication by Wallet**: Through a Wallet like Braavos, DaoSphere Users will be able to log in to our dApp, guaranteeing the security and protection of their data 🔐..
- **Registration of DAOs**: DAOs may be registered in the dApp by their respective Administrator. This process grants the DAO access to all available functionality 🛠️.
- **Member Registration**: DAO members must register in order to obtain the right to vote during discussions 🗳️.
- **Issue Registration**: Any issue that needs to be submitted for discussion among DAO members can be registered in the dApp, always guaranteeing transparency in each of these extremely important processes 💡.

## Non-Functional Requirements 🌟

1. **Scalability** 📈: The system must handle the growing number of DAOs, members, and voting activities without performance degradation.

2. **Security** 🔒: Data must be protected using encryption and secure authentication mechanisms to prevent unauthorized access and ensure user data privacy.

3. **Performance** ⚡: The application should provide a seamless user experience with fast response times, even under peak loads.

4. **Reliability** 🛠️: The system must ensure high availability and uptime, minimizing downtime to maintain trust among users.

5. **Usability** 🖥️: The user interface must be intuitive and user-friendly, allowing users to easily navigate and perform tasks within the dApp.

6. **Maintainability** 🔧: The codebase should be modular and well-documented to facilitate easy maintenance, updates, and debugging.

## Business Model

![Business Model](https://i.postimg.cc/MK52jxCV/Modelo-d-App.png)

# Analysis and Summary of Smart Contracts 📝

## DaoSphere 🚀

This code defines a smart contract for a DAO system on Starknet, structured around managing users, advisors, proposals, and votes. Key functionalities include:

- **Roles Management** 🛡️: The contract manages roles like admin, advisor, and user, ensuring only authorized users can perform specific actions.
- **User and Advisor Management** 👥: Functions to create, modify, and retrieve users and advisors.
- **Proposal Creation and Voting** 🗳️: Users (depending on access permissions) can create proposals and vote on them. Proposals can have multiple options, and voting is tracked for each proposal.
- **Access Control** 🔐: The contract integrates access control mechanisms to restrict actions based on roles.

It also supports emitting events for user creation, advisor creation, proposal creation, and voting. The contract's state is stored using maps and arrays, and various checks ensure that actions are performed by authorized entities.

## DaoSphereFabric 🏗️

The DaoSphereFabric contract in StarkNet is designed to facilitate the creation and management of Decentralized Autonomous Organizations (DAOs) 🌐. It includes functionalities for DAO creation, managing DAO IDs, recording deployment blocks, adding owners, and managing fund withdrawals. The contract handles user authentication, enforces security measures, and ensures reliable DAO management. Key events like DAO creation and owner addition are emitted for transparency 🛠️.

The contract uses several StarkNet features including event emission 📡, storage maps 🗺️, and syscalls for deploying new contracts ⚙️. Constants like DAO_SPHERE_CLASS_HASH and STRK_CONTRACT_ADDRESS are defined for reference. The `verifyName` function checks if a DAO name already exists. The `PrivateDaoSphereFabricTrait` trait provides internal functions for owner verification and token dispatcher retrieval 🔄.


