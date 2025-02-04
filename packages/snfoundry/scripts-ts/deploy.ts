import {
  deployContract,
  executeDeployCalls,
  exportDeployments,
  deployer,
} from './deploy-contract';
import { green } from './helpers/colorize-log';

/**
 * Deploy a contract using the specified parameters.
 *
 * @example (deploy contract with contructorArgs)
 * const deployScript = async (): Promise<void> => {
 *   await deployContract(
 *     {
 *       contract: "YourContract",
 *       contractName: "YourContractExportName",
 *       constructorArgs: {
 *         owner: deployer.address,
 *       },
 *       options: {
 *         maxFee: BigInt(1000000000000)
 *       }
 *     }
 *   );
 * };
 *
 * @example (deploy contract without contructorArgs)
 * const deployScript = async (): Promise<void> => {
 *   await deployContract(
 *     {
 *       contract: "YourContract",
 *       contractName: "YourContractExportName",
 *       options: {
 *         maxFee: BigInt(1000000000000)
 *       }
 *     }
 *   );
 * };
 *
 *
 * @returns {Promise<void>}
 */
const deployDaoSphereFabric = async (): Promise<void> => {
  await deployContract({
    contract: 'DaoSphereFabric',
    // constructorArgs: {
    //   owner: deployer.address,
    // },
  });
};

const deployDaoSphere = async (): Promise<void> => {
  await deployContract({
    contract: 'DaoSphere',
    constructorArgs: {
      admin: deployer.address,
    },
  });
};

(async () => {
  try {
    await deployDaoSphereFabric();
    await deployDaoSphere();
    await executeDeployCalls();
    exportDeployments();
    console.log(green('All Setup Done'));
  } catch (err) {
    console.error(err);
    process.exit(1); // exit with error so that non subsequent scripts are run
  }
})();
