export interface RegistrationArgs {
  name: string;
  owner: `0x${string}`;
  duration: bigint;
  resolver: `0x${string}`;
  data: readonly `0x${string}`[];
  reverseRecord: boolean;
}

export interface User {
  wallet_address: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Merchant {
  uen: string;
  merchant_name: string;
  username: string;
  merchant_wallet_address: string;
  is_vault_enabled: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Transaction {
  transaction_hash: string;
  merchant_uen: string;
  user_wallet_address: string;
  amount: number;
  created_at: Date;
}
