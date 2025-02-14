export interface Dao {
  args: DaoArgs;
}

interface DaoArgs {
  dao_address: bigint;
  name_dao: string;
  deploy_block: bigint;
}

