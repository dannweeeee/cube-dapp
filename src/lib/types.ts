export interface RegistrationArgs {
  name: string;
  owner: `0x${string}`;
  duration: bigint;
  resolver: `0x${string}`;
  data: readonly `0x${string}`[];
  reverseRecord: boolean;
}
