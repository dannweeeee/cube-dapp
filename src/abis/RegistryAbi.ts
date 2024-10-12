export default [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "uen",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "entity_name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "owner_name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "wallet_address",
        type: "address",
      },
    ],
    name: "MerchantAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "uen",
        type: "string",
      },
    ],
    name: "MerchantDeleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "uen",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "entity_name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "owner_name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "wallet_address",
        type: "address",
      },
    ],
    name: "MerchantUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_uen",
        type: "string",
      },
      {
        internalType: "string",
        name: "_entity_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_owner_name",
        type: "string",
      },
      {
        internalType: "address",
        name: "_wallet_address",
        type: "address",
      },
    ],
    name: "addMerchant",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_uen",
        type: "string",
      },
      {
        internalType: "string",
        name: "_entity_name",
        type: "string",
      },
    ],
    name: "addMerchantInBulk",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_uen",
        type: "string",
      },
    ],
    name: "deleteMerchant",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllMerchants",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "uen",
            type: "string",
          },
          {
            internalType: "string",
            name: "entity_name",
            type: "string",
          },
          {
            internalType: "string",
            name: "owner_name",
            type: "string",
          },
          {
            internalType: "address",
            name: "wallet_address",
            type: "address",
          },
        ],
        internalType: "struct Registry.Merchant[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_uen",
        type: "string",
      },
    ],
    name: "getMerchantByUEN",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "uen",
            type: "string",
          },
          {
            internalType: "string",
            name: "entity_name",
            type: "string",
          },
          {
            internalType: "string",
            name: "owner_name",
            type: "string",
          },
          {
            internalType: "address",
            name: "wallet_address",
            type: "address",
          },
        ],
        internalType: "struct Registry.Merchant",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_wallet_address",
        type: "address",
      },
    ],
    name: "getMerchantsByWalletAddress",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "uen",
            type: "string",
          },
          {
            internalType: "string",
            name: "entity_name",
            type: "string",
          },
          {
            internalType: "string",
            name: "owner_name",
            type: "string",
          },
          {
            internalType: "address",
            name: "wallet_address",
            type: "address",
          },
        ],
        internalType: "struct Registry.Merchant[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_uen",
        type: "string",
      },
      {
        internalType: "string",
        name: "_entity_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_owner_name",
        type: "string",
      },
      {
        internalType: "address",
        name: "_wallet_address",
        type: "address",
      },
    ],
    name: "updateMerchant",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
