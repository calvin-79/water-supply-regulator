export async function createComplaint(complaint) {
  return window.canister.supply.createComplaint(complaint);
}

export async function updateComplaint(complaint) {
  return window.canister.supply.updateComplaint(complaint);
}

export async function getComplaints() {
  try {
    return await window.canister.supply.getComplaints();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}
