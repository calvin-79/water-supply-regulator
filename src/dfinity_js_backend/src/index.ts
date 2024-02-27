// Import necessary modules and libraries from the Azle framework and UUID for generating unique identifiers.
import {
  query,
  update,
  text,
  Record,
  StableBTreeMap,
  Variant,
  Vec,
  Ok,
  Err,
  nat64,
  Result,
  Canister,
} from "azle";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

// Define record structure for Supply
const Supply = Record({
  id: text,
  price: nat64,
  status: text,
  capacity: nat64,
  currentLevel: nat64,
});

// Define payload structure for creating supply
const SupplyPayload = Record({
  price: nat64,
  capacity: nat64,
  currentLevel: nat64,
});

// Define payload structure for updating supply
const UpdateSupplyPayload = Record({
  price: nat64,
  capacity: nat64,
  refill: nat64,
});

// Define record structure for Home Details
const Home = Record({
  id: text,
  phone: text,
  address: text,
  waterTokens: nat64,
  waterConsumption: nat64,
  status: text,
  bill: nat64,
});

// Define payload structure for adding Home Details
const HomePayload = Record({
  phone: text,
  address: text,
});

// Define payload structure for updating Home Details
const UpdateHomePayload = Record({
  id: text,
  phone: text,
  status: text,
  waterConsumption: nat64,
});

// Define record structure for Token
const Token = Record({
  id: text,
  date: text,
  amount: nat64,
  cost: nat64,
  status: text,
});

// Define record structure for Complaint
const Complaint = Record({
  id: text,
  title: text,
  homeId: text,
  date: text,
  description: text,
  status: text,
});

// Define payload structure for Complaint
const ComplaintPayload = Record({
  title: text,
  homeId: text,
  description: text,
});

// Define update payload structure for Complaint
const UpdateComplaintPayload = Record({
  complaintId: text,
  status: text,
});

// Define payload structure for refill
const RefillPayload = Record({
  homeId: text,
  amount: nat64,
});

// Define variant representing different error types
const ErrorType = Variant({
  NotFound: text,
  InvalidPayload: text,
  PaymentFailed: text,
  InsufficientSupply: text,
});

// Define record structure for home water usage

// Initialize StableBTreeMap instances to store supplies, homes, and complaint records.
const suppliesStorage = StableBTreeMap(0, text, Supply);
const homesStorage = StableBTreeMap(1, text, Home);
const tokensStorage = StableBTreeMap(1, text, Token);
const complaintsStorage = StableBTreeMap(2, text, Complaint);

// Export default Canister module
export default Canister({
  // add home details
  addHome: update([HomePayload], Result(Home, ErrorType), (payload) => {
    if (typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ NotFound: "invalid payload" });
    }

    const id = uuidv4();
    const home = {
      id,
      ...payload,
      bill: 0n,
      status: "active",
      waterConsumption: 0n,
      waterTokens: 0n,
    };
    homesStorage.insert(id, home);
    return Ok(home);
  }),

  // Function to retrieve all homes
  getHomes: query([], Vec(Home), () => {
    return homesStorage.values();
  }),

  // Function to retrieve a specific home by id
  getHome: query([text], Result(Home, ErrorType), (id) => {
    const homeOpt = homesStorage.get(id);
    if ("None" in homeOpt) {
      return Err({ NotFound: `home with id=${id} not found` });
    }
    return Ok(homeOpt.Some);
  }),

  // refill home water tokens and adding amount to bill and deduct from suply
  refillTokens: update([RefillPayload], Result(Home, ErrorType), (payload) => {
    const homeOpt = homesStorage.get(payload.homeId);
    if ("None" in homeOpt) {
      return Err({ NotFound: `home with id=${payload.homeId} not found` });
    }
    const home = homeOpt.Some;
    const supplies = suppliesStorage.values();

    const supply = supplies[0];

    // if amount is more then supply, use max suply available
    const intAmount = Math.min(
      parseInt(payload.amount.toString(), 10),
      parseInt(supply.currentLevel.toString(), 10)
    );
    const amount = BigInt(intAmount);

    homesStorage.insert(home.id, {
      ...home,
      bill: home.bill + amount * supply.price,
      waterTokens: home.waterTokens + amount,
    });
    suppliesStorage.insert(supply.id, {
      ...supply,
      currentLevel: supply.currentLevel - amount,
    });
    return Ok(home);
  }),

  // function for home to pay bill
  payBill: update([RefillPayload], Result(Home, ErrorType), (payload) => {
    const homeOpt = homesStorage.get(payload.homeId);
    if ("None" in homeOpt) {
      return Err({ NotFound: `home with id=${payload.homeId} not found` });
    }
    const home = homeOpt.Some;
    homesStorage.insert(home.id, {
      ...home,
      bill: home.bill - payload.amount,
    });
    return Ok(home);
  }),

  // Function to update an home
  updateHome: update(
    [UpdateHomePayload],
    Result(Home, ErrorType),
    (payload) => {
      const homeOpt = homesStorage.get(payload.id);
      if ("None" in homeOpt) {
        return Err({ NotFound: `home with id=${payload.id} not found` });
      }
      const home = homeOpt.Some;
      const updatedHome = {
        ...home,
        ...payload,
      };
      homesStorage.insert(home.id, updatedHome);
      return Ok(updatedHome);
    }
  ),

  // Function to add a supply
  addSupply: update([SupplyPayload], Result(Supply, ErrorType), (payload) => {
    if (typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ NotFound: "invalid payload" });
    }

    const id = uuidv4();
    const supply = {
      id,
      ...payload,
      status: "active",
    };
    suppliesStorage.insert(id, supply);
    return Ok(supply);
  }),

  // Function to retrieve all supplies
  getSupplies: query([], Vec(Supply), () => {
    return suppliesStorage.values();
  }),

  // Function to retrieve a specific supply by id
  getSupply: query([], Result(Supply, ErrorType), () => {
    const supplies = suppliesStorage.values();

    if (supplies.length < 1) {
      return Err({ NotFound: `supply with not found` });
    }

    const supply = supplies[0];
    return Ok(supply);
  }),

  // Function to update a supply
  updateSupply: update(
    [UpdateSupplyPayload],
    Result(Supply, ErrorType),
    (payload) => {
      const supplies = suppliesStorage.values();

      const supply = supplies[0];
      const updatedSupply = {
        ...supply,
        ...payload,
        currentLevel: supply.currentLevel + payload.refill,
      };
      suppliesStorage.insert(supply.id, updatedSupply);
      return Ok(updatedSupply);
    }
  ),

  // Function to add a token to user and deducting the amount from the supply
  addToken: update(
    [text, nat64],
    Result(Token, ErrorType),
    (homeId, amount) => {
      const homeOpt = homesStorage.get(homeId);
      if ("None" in homeOpt) {
        return Err({ NotFound: `home with id=${homeId} not found` });
      }
      const home = homeOpt.Some;
      const supplies = suppliesStorage.values();

      const supply = supplies[0];
      if (supply.currentLevel < amount) {
        return Err({ InsufficientSupply: "insufficient water supply" });
      }

      const cost = amount * supply.price;

      const token = {
        id: uuidv4(),
        date: new Date().toISOString(),
        amount,
        cost,
        status: "active",
      };
      tokensStorage.insert(token.id, token);
      homesStorage.insert(home.id, {
        ...home,
        bill: home.bill + cost,
        waterTokens: home.waterTokens + amount,
      });
      suppliesStorage.insert(supply.id, {
        ...supply,
        currentLevel: supply.currentLevel - amount,
      });
      return Ok(token);
    }
  ),

  // Function to retrieve all tokens
  getTokens: query([], Vec(Token), () => {
    return tokensStorage.values();
  }),

  // Function to retrieve a specific token by id
  getToken: query([text], Result(Token, ErrorType), (id) => {
    const tokenOpt = tokensStorage.get(id);
    if ("None" in tokenOpt) {
      return Err({ NotFound: `token with id=${id} not found` });
    }
    return Ok(tokenOpt.Some);
  }),

  //  function to create a complaint
  createComplaint: update(
    [ComplaintPayload],
    Result(Complaint, ErrorType),
    (payload) => {
      if (typeof payload !== "object" || Object.keys(payload).length === 0) {
        return Err({ NotFound: "invalid payload" });
      }

      const id = uuidv4();
      const complaint = {
        id,
        ...payload,
        date: new Date().toISOString(),
        status: "active",
      };
      complaintsStorage.insert(id, complaint);
      return Ok(complaint);
    }
  ),

  // Function to retrieve all complaints
  getComplaints: query([], Vec(Complaint), () => {
    return complaintsStorage.values();
  }),

  // Function to retrieve a specific complaint by id
  getComplaint: query([text], Result(Complaint, ErrorType), (id) => {
    const complaintOpt = complaintsStorage.get(id);
    if ("None" in complaintOpt) {
      return Err({ NotFound: `complaint with id=${id} not found` });
    }
    return Ok(complaintOpt.Some);
  }),

  // Function to update a complaint
  updateComplaint: update(
    [UpdateComplaintPayload],
    Result(Complaint, ErrorType),
    (payload) => {
      const complaintOpt = complaintsStorage.get(payload.complaintId);
      if ("None" in complaintOpt) {
        return Err({
          NotFound: `complaint with id=${payload.complaintId} not found`,
        });
      }
      const complaint = complaintOpt.Some;
      const updatedComplaint = {
        ...complaint,
        ...payload,
      };
      complaintsStorage.insert(complaint.id, updatedComplaint);
      return Ok(updatedComplaint);
    }
  ),
});

// A workaround to make the UUID package work with Azle
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  },
};
