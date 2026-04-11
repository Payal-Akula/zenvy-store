const BASE_URL = "https://zenvy-store.onrender.com/api/address";

export async function getAddresses() {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
}

export async function addAddress(data) {
  const token = localStorage.getItem("token");
console.log("TOKEN SENT:", token);

  if (!token) {
    throw new Error("No token found. Please login again.");
  }

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  const text = await res.text();
  console.log("RAW RESPONSE:", text);

  if (!res.ok) {
    throw new Error(text);
  }

  return JSON.parse(text);
}

export async function deleteAddress(id) {
  const token = localStorage.getItem("token");

  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}