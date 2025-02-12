export default interface VoteCreationAccess {
  variant: variant;
}

type variant = {
  Admin: undefined | boolean;
  AdminOrAdvisor: undefined | boolean;
  All: undefined | boolean;
};
