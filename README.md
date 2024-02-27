# Water Supply and Home Management Canister

## Overview

The Water Supply and Home Management Canister offers a comprehensive solution for effectively managing water resources and home-related activities within a community. By leveraging advanced data structures, error handling mechanisms, and storage techniques, it provides residents and administrators with the tools needed to ensure efficient water supply management and residential satisfaction.

### Modules and Libraries

- **Azle Framework**: The Azle framework is used for defining data structures, handling queries and updates, and managing error types.
- **UUID**: The UUID library is used for generating unique identifiers for records.

### Record Structures

#### Supply

- **id**: Unique identifier for the supply.
- **price**: Price of water.
- **status**: Status of the supply (e.g., active, inactive).
- **capacity**: Total capacity of the supply.
- **currentLevel**: Current level of water in the supply.

#### Home

- **id**: Unique identifier for the home.
- **phone**: Phone number of the home owner.
- **address**: Address of the home.
- **waterTokens**: Number of water tokens available to the home.
- **waterConsumption**: Total water consumption by the home.
- **status**: Status of the home (e.g., active, inactive).
- **bill**: Total bill amount for water consumption.

#### Token

- **id**: Unique identifier for the token.
- **date**: Date of token issuance.
- **amount**: Amount of water tokens.
- **cost**: Cost of the tokens.
- **status**: Status of the token (e.g., active, inactive).

#### Complaint

- **id**: Unique identifier for the complaint.
- **title**: Title of the complaint.
- **homeId**: ID of the home associated with the complaint.
- **date**: Date of the complaint.
- **description**: Description of the complaint.
- **status**: Status of the complaint (e.g., active, resolved).

### Functions

#### Home Management

- **addHome**: Add details of a new home including phone, address, and initial token and bill information.
- **getHomes**: Retrieve details of all homes stored in the system.
- **getHome**: Retrieve details of a specific home by its ID.
- **updateHome**: Update details of an existing home including phone, address, and status.

#### Water Supply Management

- **addSupply**: Add details of a new water supply including price, capacity, and initial status.
- **getSupplies**: Retrieve details of all water supplies stored in the system.
- **getSupply**: Retrieve details of the current water supply.
- **updateSupply**: Update details of the current water supply including price, capacity, and current level.

#### Token Management

- **addToken**: Add tokens to a home and deduct the corresponding amount from the water supply.
- **getTokens**: Retrieve details of all tokens issued.
- **getToken**: Retrieve details of a specific token by its ID.

#### Complaint Management

- **createComplaint**: Register a new complaint including title, description, and associated home.
- **getComplaints**: Retrieve details of all complaints stored in the system.
- **getComplaint**: Retrieve details of a specific complaint by its ID.
- **updateComplaint**: Update status of an existing complaint.

### Workflow

1. **Supply Management**:
   - Admins can add, update, and monitor water supply details including price, capacity, and current levels.

2. **Home Management**:
   - Residents or administrators can add, update, and view details of individual homes, including address, contact information, and billing status.

3. **Token Issuance**:
   - Tokens are issued to homes based on their water consumption needs, with corresponding costs deducted from the supply.

4. **Complaint Handling**:
   - Residents can register complaints related to water supply issues, with administrators responsible for reviewing, updating, and resolving complaints as necessary.

### Error Handling

The system utilizes `Result` types to handle errors. Possible error types include NotFound, InvalidPayload, PaymentFailed, and InsufficientSupply.

### UUID Workaround

A workaround is provided to make the UUID package compatible with Azle. This enables the generation of unique identifiers for records.

## How to deploy canisters implemented in the course

### Ledger canister

`./deploy-local-ledger.sh` - deploys a local Ledger canister. IC works differently when run locally so there is no default network token available and you have to deploy it yourself. Remember that it's not a token like ERC-20 in Ethereum, it's a native token for ICP, just deployed separately.
This canister is described in the `dfx.json`:

`remote.id.ic` - that is the principal of the Ledger canister and it will be available by this principal when you work with the ledger.

Also, in the scope of this script, a minter identity is created which can be used for minting tokens
for the testing purposes.
Additionally, the default identity is pre-populated with 1000_000_000_000 e8s which is equal to 10_000 * 10**8 ICP.
The decimals value for ICP is 10**8.

List identities:
`dfx identity list`

Switch to the minter identity:
`dfx identity use minter`

Transfer ICP:
`dfx ledger transfer <ADDRESS>  --memo 0 --icp 100 --fee 0`
where:

- `--memo` is some correlation id that can be set to identify some particular transactions (we use that in the canister).
- `--icp` is the transfer amount
- `--fee` is the transaction fee. In this case it's 0 because we make this transfer as the minter idenity thus this transaction is of type MINT, not TRANSFER.
- `<ADDRESS>` is the address of the recipient. To get the address from the principal, you can use the helper function from the canister - `getAddressFromPrincipal(principal: Principal)`, it can be called via the Candid UI.

### Internet identity canister

`dfx deploy internet_identity` - that is the canister that handles the authentication flow. Once it's deployed, the `js-agent` library will be talking to it to register identities. There is UI that acts as a wallet where you can select existing identities
or create a new one.

### canister

`dfx deploy dfinity_js_backend` - deploys the canister where the business logic is implemented.
Basically, it implements functions like add, view, update, delete, and buy products + a set of helper functions.

Do not forget to run `dfx generate dfinity_js_backend` anytime you add/remove functions in the canister or when you change the signatures.
Otherwise, these changes won't be reflected in IDL's and won't work when called using the JS agent.

### frontend canister

`dfx deploy dfinity_js_frontend` - deployes the frontend app for the `dfinity_js_backend` canister on IC.
