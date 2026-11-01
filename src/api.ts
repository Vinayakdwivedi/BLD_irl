export interface DonationPayload {
  transaction_id: string;
  name: string;
  email: string;
  work: string;
  profession: string;
  address: string;
  miscellaneous: string;
}

interface DonationResponse {
  id: number;
  detail: string;
}

const donationApiUrl = import.meta.env.VITE_DONATION_API_URL?.replace(/\/$/, "");

export async function submitDonation(payload: DonationPayload): Promise<DonationResponse> {
  if (!donationApiUrl) {
    throw new Error("Donation API is not configured.");
  }

  const response = await fetch(`${donationApiUrl}/api/donations/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(errorBody?.detail || "Donation submission failed.");
  }

  return (await response.json()) as DonationResponse;
}
