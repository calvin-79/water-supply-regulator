export async function createHome(home) {
  return window.canister.supply.addHome(home);
}

export async function updateHome(home) {
  return window.canister.supply.updateHome(home);
}

// function to pay bill for a home
export async function payBill(data) {
  return window.canister.supply.payBill(data);
}

// function to refill water for a home
export async function refillHome(data) {
  return window.canister.supply.refillTokens(data);
}

export async function getHomes() {
  try {
    return await window.canister.supply.getHomes();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// getCollectionsByHomeId
export async function getHomesByHomeId(homeId) {
  return window.canister.supply.getHome(homeId);
}
