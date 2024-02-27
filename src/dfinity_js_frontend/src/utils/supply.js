export async function createSupply(supply) {
  return window.canister.supply.addSupply(supply);
}

export async function updateSupply(supply) {
  return window.canister.supply.updateSupply(supply);
}

// get supply
export async function getSupply() {
  return window.canister.supply.getSupply();
}

export async function getSupplies() {
  try {
    return await window.canister.supply.getSupplies();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}
