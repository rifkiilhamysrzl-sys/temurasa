/**
 * MAYAR HEADLESS API V2 CLIENT
 * Strictly implements Mayar API V2 without automatic V1 fallback.
 * Base URL: https://api.mayar.id/hl/v2
 * Create Invoice: POST /invoices/create
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
  redirectUrl?: string;
  extraData: {
    transactionId: string;
    roomCode: string;
    idProd?: string;
    noCustomer?: string;
  };
}

export interface MayarInvoiceResponseData {
  id: string;            // Mayar Invoice UUID
  transactionId?: string; // Mayar Transaction UUID
  link: string;          // Customer Payment/Checkout URL
  expiredAt?: number | string;
  extraData?: {
    transactionId?: string;
    roomCode?: string;
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
  expiredAt?: number | string;
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
 * Ensures no trailing slash
 */
export function getMayarApiBase(): string {
  const envBase = process.env.MAYAR_API_BASE?.trim();
  if (envBase && envBase.length > 0) {
    return envBase.replace(/\/+$/, '');
  }

  return process.env.MAYAR_ENV === 'sandbox'
    ? 'https://api.mayar.io/hl/v2'
    : 'https://api.mayar.id/hl/v2';
}

/**
 * Cleanly combines baseUrl and relative path without double slash
 */
export function buildMayarUrl(path: string): string {
  const base = getMayarApiBase();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Get Mayar Bearer Authorization Header
 * Never leaks the API key in logs
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
 * Create Invoice via Mayar API V2
 * Endpoint: POST https://api.mayar.id/hl/v2/invoices/create
 */
export async function createMayarInvoice(
  params: CreateMayarInvoiceParams
): Promise<MayarInvoiceResponseData> {
  const endpoint = buildMayarUrl('/invoices/create');

  const requestPayload: Record<string, any> = {
    name: params.name,
    email: params.email,
    mobile: params.mobile,
    description: params.description || 'Temurasa Premium Relationship Report',
    expiredAt: params.expiredAt,
    items: params.items.map((item) => ({
      quantity: item.quantity,
      rate: item.rate,
      description: item.description,
    })),
    extraData: {
      transactionId: params.extraData.transactionId,
      roomCode: params.extraData.roomCode,
      idProd: params.extraData.transactionId,
      noCustomer: params.extraData.roomCode,
    },
  };

  if (params.redirectUrl) {
    requestPayload.redirectUrl = params.redirectUrl;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: getMayarHeaders(),
      body: JSON.stringify(requestPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      const status = res.status;
      let errorDetails = '';

      if (body) {
        // 1. Look for detailed field-level errors list or object
        if (body.errors) {
          if (Array.isArray(body.errors)) {
            const list = body.errors
              .map((e: any) => {
                if (typeof e === 'string') return e;
                if (e.field && e.message) return `${e.field}: ${e.message}`;
                if (e.message) return e.message;
                return JSON.stringify(e);
              })
              .filter(Boolean);
            if (list.length > 0) errorDetails = list.join('; ');
          } else if (typeof body.errors === 'object') {
            const list = Object.entries(body.errors)
              .map(([field, val]) => {
                const msg = Array.isArray(val) ? val.join(', ') : val;
                return `${field}: ${msg}`;
              })
              .filter(Boolean);
            if (list.length > 0) errorDetails = list.join('; ');
          }
        }

        // 2. Look for nested errors in data.errors
        if (!errorDetails && body.data?.errors && typeof body.data.errors === 'object') {
          const list = Object.entries(body.data.errors)
            .map(([field, val]) => `${field}: ${Array.isArray(val) ? val.join(', ') : val}`)
            .filter(Boolean);
          if (list.length > 0) errorDetails = list.join('; ');
        }

        // 3. Look for messages string or array
        if (!errorDetails) {
          const msg = body.messages || body.message;
          if (Array.isArray(msg)) {
            errorDetails = msg.join(', ');
          } else if (typeof msg === 'string' && msg.toLowerCase() !== 'validation error') {
            errorDetails = msg;
          }
        }

        // 4. Look for error property
        if (!errorDetails && body.error && typeof body.error === 'string') {
          errorDetails = body.error;
        }

        // 5. If Mayar specifically returned generic 'Validation Error' without sub-fields:
        if (!errorDetails && (
          (typeof body.messages === 'string' && body.messages.toLowerCase().includes('validation')) ||
          (typeof body.message === 'string' && body.message.toLowerCase().includes('validation'))
        )) {
          errorDetails = 'Format data pembayar tidak valid (pastikan nama lengkap minimal 3 karakter, email aktif, dan nomor HP/WhatsApp 10-15 digit angka).';
        }
      }

      // Differentiate 404 Endpoint vs 404 Resource/Customer Not Found
      let userFriendlyMsg = '';
      if (status === 404) {
        const lower = (errorDetails || '').toLowerCase();
        if (
          lower.includes('customer') ||
          lower.includes('pelanggan') ||
          lower.includes('user')
        ) {
          userFriendlyMsg = `Customer/pelanggan tidak ditemukan di Mayar (${errorDetails || '404 Customer Not Found'}).`;
        } else {
          userFriendlyMsg = `Endpoint Mayar tidak ditemukan (HTTP 404 pada ${endpoint}).`;
        }
      } else {
        userFriendlyMsg = `Mayar API V2 Create Invoice gagal (HTTP ${status}): ${errorDetails || res.statusText}`;
      }

      // Safe logging without exposing sensitive customer info or API keys
      console.error(`[MAYAR_API_ERROR] POST ${endpoint} returned HTTP ${status}:`, {
        status,
        errorDetails: errorDetails || res.statusText,
      });

      throw new Error(userFriendlyMsg);
    }

    const responseData = body?.data || body;
    const invoiceId = responseData?.id || responseData?.invoiceId;
    const link = responseData?.link || responseData?.url || responseData?.paymentUrl;

    if (!invoiceId || !link) {
      console.error('[MAYAR_API_ERROR] Invalid response structure:', {
        hasBody: !!body,
        hasData: !!body?.data,
        keys: body ? Object.keys(body) : [],
      });
      throw new Error('Mayar API V2 tidak mengembalikan ID invoice atau link checkout yang valid.');
    }

    return {
      id: invoiceId,
      transactionId: responseData.transactionId,
      link,
      expiredAt: responseData.expiredAt,
      extraData: responseData.extraData,
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error(
        'Koneksi ke gateway pembayaran Mayar melebihi batas waktu (timeout). Silakan coba lagi.'
      );
    }
    throw err;
  }
}

/**
 * Get Invoice Detail via Mayar API V2
 * Tries /invoices/{id} first, then fallback to /invoice/{id} if 404 route occurs.
 */
export async function getMayarInvoiceDetail(
  invoiceId: string
): Promise<MayarInvoiceDetail> {
  if (!invoiceId || invoiceId.trim().length === 0) {
    throw new Error('Invoice ID is required to fetch details.');
  }

  const cleanId = encodeURIComponent(invoiceId.trim());
  const endpoints = [
    buildMayarUrl(`/invoices/${cleanId}`),
    buildMayarUrl(`/invoice/${cleanId}`),
  ];

  let lastError: any = null;

  for (const endpoint of endpoints) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: getMayarHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // If route not found on first endpoint variant, gracefully try next variant
      if (res.status === 404 && endpoint !== endpoints[endpoints.length - 1]) {
        continue;
      }

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        const status = res.status;
        let errorDetails = '';
        if (body) {
          if (Array.isArray(body.messages)) {
            errorDetails = body.messages.join(', ');
          } else if (typeof body.messages === 'string') {
            errorDetails = body.messages;
          } else if (body.message) {
            errorDetails =
              typeof body.message === 'string'
                ? body.message
                : JSON.stringify(body.message);
          } else if (body.error) {
            errorDetails =
              typeof body.error === 'string'
                ? body.error
                : JSON.stringify(body.error);
          }
        }

        console.error(`[MAYAR_API_ERROR] GET ${endpoint} returned HTTP ${status}:`, {
          status,
          errorDetails: errorDetails || res.statusText,
        });

        throw new Error(
          `Mayar API V2 Get Detail Invoice gagal (HTTP ${status}): ${errorDetails || res.statusText}`
        );
      }

      const invoiceData = body?.data || body;
      if (!invoiceData) {
        throw new Error('Mayar API V2 mengembalikan response detail invoice kosong.');
      }

      return invoiceData as MayarInvoiceDetail;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Pemeriksaan status invoice ke Mayar melebihi batas waktu (timeout).');
      }
      lastError = err;
    }
  }

  throw lastError || new Error('Gagal memeriksa detail invoice dari Mayar API V2.');
}
