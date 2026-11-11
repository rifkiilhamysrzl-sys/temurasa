/**
 * MAYAR HEADLESS API V2 CLIENT
 * Strictly implements Mayar API V2 without automatic V1 fallback.
 */

export interface CreateInvoiceItem {
  quantity: number;
  rate: number;
  description: string;
}

export interface CreateMayarInvoiceParams {
  name: string;
  email: string;
  mobile: string;
  description: string;
  expiredAt: string; // ISO 8601 UTC
  items: CreateInvoiceItem[];
  redirectUrl: string;
  extraData: {
    noCustomer: string; // roomCode
    idProd: string;     // internal transactionId
  };
}

export interface MayarInvoiceResponseData {
  id: string;            // Mayar Invoice UUID
  transactionId?: string; // Mayar Transaction UUID
  link: string;          // Customer Payment/Checkout URL
  expiredAt: number;     // Expiration timestamp in ms
  extraData?: {
    noCustomer?: string;
    idProd?: string;
  };
}

export interface MayarInvoiceDetail {
  id: string;
  amount: number;
  status: string; // 'paid' | 'unpaid' | 'closed'
  link?: string;
  type?: string;
  expiredAt?: number;
  customer?: {
    id?: string;
    name?: string;
    email?: string;
    mobile?: string;
  };
  transactions?: Array<{
    id: string;
    status?: string;
    paymentMethod?: string;
  }>;
}

/**
 * Get sanitized Mayar API base URL (Strictly V2)
 */
export function getMayarApiBase(): string {
  const envBase = process.env.MAYAR_API_BASE?.trim();
  if (envBase && envBase.length > 0) {
    // Remove trailing slash
    return envBase.replace(/\/+$/, '');
  }

  // Default to Mayar V2 Production base URL
  return process.env.MAYAR_ENV === 'sandbox'
    ? 'https://api.mayar.io/hl/v2'
    : 'https://api.mayar.id/hl/v2';
}

/**
 * Get Mayar Bearer Authorization Header
 */
function getMayarHeaders(): Record<string, string> {
  const apiKey = process.env.MAYAR_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('MAYAR_API_KEY is not configured on the server.');
  }

  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

/**
 * Create Invoice via Mayar API V2 (POST /hl/v2/invoice)
 * Strict V2: No automatic fallback to V1.
 */
export async function createMayarInvoice(
  params: CreateMayarInvoiceParams
): Promise<MayarInvoiceResponseData> {
  const baseUrl = getMayarApiBase();
  const endpoint = `${baseUrl}/invoice`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: getMayarHeaders(),
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg =
        body?.messages ||
        body?.message ||
        body?.error ||
        `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(`Mayar API V2 Create Invoice failed: ${errorMsg}`);
    }

    if (!body || !body.data || !body.data.id || !body.data.link) {
      throw new Error('Mayar API V2 returned an invalid response structure.');
    }

    return body.data as MayarInvoiceResponseData;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Koneksi ke gateway pembayaran Mayar melebihi batas waktu (timeout). Silakan coba lagi.');
    }
    throw err;
  }
}

/**
 * Get Invoice Detail via Mayar API V2 (GET /hl/v2/invoice/{id})
 * Strict V2: No automatic fallback to V1.
 */
export async function getMayarInvoiceDetail(
  invoiceId: string
): Promise<MayarInvoiceDetail> {
  if (!invoiceId || invoiceId.trim().length === 0) {
    throw new Error('Invoice ID is required to fetch details.');
  }

  const baseUrl = getMayarApiBase();
  const endpoint = `${baseUrl}/invoice/${encodeURIComponent(invoiceId.trim())}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: getMayarHeaders(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg =
        body?.messages ||
        body?.message ||
        body?.error ||
        `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(`Mayar API V2 Get Detail Invoice failed: ${errorMsg}`);
    }

    if (!body || !body.data) {
      throw new Error('Mayar API V2 returned empty invoice details.');
    }

    return body.data as MayarInvoiceDetail;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Pemeriksaan status invoice ke Mayar melebihi batas waktu (timeout).');
    }
    throw err;
  }
}
