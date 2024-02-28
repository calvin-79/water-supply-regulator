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
import { v4 as uuidv4 } from "uuid";

// Define record structures
const Supply = Record({
  id: text,
  price: nat64,
  status: text,
  capacity: nat64,
  currentLevel: nat64,
});

const Home = Record({
  id: text,
  phone: text,
  address: text,
  waterTokens: nat64,
  waterConsumption: nat64,
  status: text,
  bill: nat64,
});

const Token = Record({
  id: text,
  date: text,
  amount: nat64,
  cost: nat64,
  status: text,
});

const Complaint = Record({
  id: text,
  title: text,
  homeId: text,
  date: text,
  description: text,
  status: text,
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


// Initialize storage instances
const suppliesStorage = StableBTreeMap(0, text, Supply);
const homesStorage = StableBTreeMap(1, text, Home);
const tokensStorage = StableBTreeMap(2, text, Token);
const complaintsStorage = StableBTreeMap(3, text, Complaint);

// Export default Canister module
export default Canister({
  // Function to add home details
  addHome: update([HomePayload], Result(Home, ErrorType), (payload) => {
    if (!payload || typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ InvalidPayload: "Invalid or empty payload" });
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
  getHomes: query([], Vec(Home), () => homesStorage.values()),

  // Function to retrieve a specific home by id
  getHome: query([text], Result(Home, ErrorType), (id) => {
    const home = homesStorage.get(id);
    return home ? Ok(home) : Err({ NotFound: `Home with id=${id} not found` });
  }),

  // Refill home water tokens and add amount to bill, deducting from supply
  refillTokens: update([RefillPayload], Result(Home, ErrorType), (payload) => {
    const home = homesStorage.get(payload.homeId);
    if (!home) return Err({ NotFound: `Home with id=${payload.homeId} not found` });
    const supply = suppliesStorage.values()[0];
    if (!supply) return Err({ NotFound: "No water supply available" });

    const amount = Math.min(payload.amount, supply.currentLevel);

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

  // Function for home to pay bill
  payBill: update([RefillPayload], Result(Home, ErrorType), (payload) => {
    const home = homesStorage.get(payload.homeId);
    if (!home) return Err({ NotFound: `Home with id=${payload.homeId} not found` });
    homesStorage.insert(home.id, { ...home, bill: home.bill - payload.amount });
    return Ok(home);
  }),

  // Function to update a home
  updateHome: update([UpdateHomePayload], Result(Home, ErrorType), (payload) => {
    const home = homesStorage.get(payload.id);
    if (!home) return Err({ NotFound: `Home with id=${payload.id} not found` });
    const updatedHome = { ...home, ...payload };
    homesStorage.insert(home.id, updatedHome);
    return Ok(updatedHome);
  }),

  // Function to add a supply
  addSupply: update([SupplyPayload], Result(Supply, ErrorType), (payload) => {
    if (!payload || typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ InvalidPayload: "Invalid or empty payload" });
    }
    const id = uuidv4();
    const supply = { id, ...payload, status: "active" };
    suppliesStorage.insert(id, supply);
    return Ok(supply);
  }),

  // Function to retrieve all supplies
  getSupplies: query([], Vec(Supply), () => suppliesStorage.values()),

  // Function to retrieve a specific supply by id
  getSupply: query([], Result(Supply, ErrorType), () => {
    const supply = suppliesStorage.values()[0];
    return supply ? Ok(supply) : Err({ NotFound: "Supply not found" });
  }),

  // Function to update a supply
  updateSupply: update([UpdateSupplyPayload], Result(Supply, ErrorType), (payload) => {
    const supply = suppliesStorage.values()[0];
    if (!supply) return Err({ NotFound: "Supply not found" });
    const updatedSupply = { ...supply, ...payload, currentLevel: supply.currentLevel + payload.refill };
    suppliesStorage.insert(supply.id, updatedSupply);
    return Ok(updatedSupply);
  }),

  // Function to add a token to user and deduct amount from the supply
  addToken: update([text, nat64], Result(Token, ErrorType), (homeId, amount) => {
    const home = homesStorage.get(homeId);
    if (!home) return Err({ NotFound: `Home with id=${homeId} not found` });
    const supply = suppliesStorage.values()[0];
    if (!supply || supply.currentLevel < amount) return Err({ InsufficientSupply: "Insufficient water supply" });

    const cost = amount * supply.price;
    const token = { id: uuidv4(), date: new Date().toISOString(), amount, cost, status: "active" };
    tokensStorage.insert(token.id, token);
    homesStorage.insert(home.id, { ...home, bill: home.bill + cost, waterTokens: home.waterTokens + amount });
    suppliesStorage.insert(supply.id, { ...supply, currentLevel: supply.currentLevel - amount });
    return Ok(token);
  }),

  // Function to retrieve all tokens
  getTokens: query([], Vec(Token), () => tokensStorage.values()),

  // Function to retrieve a specific token by id
  getToken: query([text], Result(Token, ErrorType), (id) => {
    const token = tokensStorage.get(id);
    return token ? Ok(token) : Err({ NotFound: `Token with id=${id} not found` });
  }),

  // Function to create a complaint
  createComplaint: update([ComplaintPayload], Result(Complaint, ErrorType), (payload) => {
    if (!payload || typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ InvalidPayload: "Invalid or empty payload" });
    }
    const id = uuidv4();
    const complaint = { id, ...payload, date: new Date().toISOString(), status: "active" };
    complaintsStorage.insert(id, complaint);
    return Ok(complaint);
  }),

  // Function to retrieve all complaints
  getComplaints: query([], Vec(Complaint), () => complaintsStorage.values()),

  // Function to retrieve a specific complaint by id
  getComplaint: query([text], Result(Complaint, ErrorType), (id) => {
    const complaint = complaintsStorage.get(id);
    return complaint ? Ok(complaint) : Err({ NotFound: `Complaint with id=${id} not found` });
  }),

  // Function to update a complaint
  updateComplaint: update([UpdateComplaintPayload], Result(Complaint, ErrorType), (payload) => {
    const complaint = complaintsStorage.get(payload.complaintId);
    if (!complaint) return Err({ NotFound: `Complaint with id=${payload.complaintId} not found` });
    const updatedComplaint = { ...complaint, ...payload };
    complaintsStorage.insert(complaint.id, updatedComplaint);
    return Ok(updatedComplaint);
  }),
});

// A workaround to make the UUID package work with Azle
globalThis.crypto = {
  getRandomValues: () => {
    let array = new Uint8Array(32);
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  },
};
