import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase";
import type { Product } from "@/lib/types";

type ProductQueryResult = {
  products: Product[];
  errorMessage: string | null;
};

function formatSupabaseError(error: unknown) {
  if (!error) {
    return null;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object") {
    const maybeError = error as { message?: string; details?: string; hint?: string; code?: string };
    return [maybeError.message, maybeError.details, maybeError.hint, maybeError.code]
      .filter(Boolean)
      .join(" / ");
  }

  return String(error);
}

export async function getActiveProductsResult(): Promise<ProductQueryResult> {
  try {
    if (!supabaseUrl || !supabasePublishableKey) {
      return {
        products: [],
        errorMessage: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
      };
    }

    const endpoint = new URL("products", supabaseUrl.endsWith("/") ? supabaseUrl : `${supabaseUrl}/`);
    endpoint.searchParams.set(
      "select",
      "id,name,origin,process,roast_level,flavor_notes,bean_price,drip_price,image_url,is_active"
    );
    endpoint.searchParams.set("is_active", "eq.true");
    endpoint.searchParams.set("order", "name.asc");

    const response = await fetch(endpoint.toString(), {
      cache: "no-store",
      headers: {
        apikey: supabasePublishableKey,
        Authorization: `Bearer ${supabasePublishableKey}`
      }
    });

    if (!response.ok) {
      const body = await response.text();
      return {
        products: [],
        errorMessage: `Supabase REST error ${response.status}: ${body}`
      };
    }

    const data = (await response.json()) as Product[];

    return {
      products: data.map((product) => ({
        ...product,
        id: String(product.id)
      })),
      errorMessage: null
    };
  } catch (error) {
    return {
      products: [],
      errorMessage: formatSupabaseError(error) ?? "Unable to connect to Supabase."
    };
  }
}

export async function getActiveProducts(): Promise<Product[]> {
  const result = await getActiveProductsResult();
  return result.products;
}

export async function getActiveProductById(id: string): Promise<Product | null> {
  try {
    if (!supabaseUrl || !supabasePublishableKey) {
      return null;
    }

    const endpoint = new URL("products", supabaseUrl.endsWith("/") ? supabaseUrl : `${supabaseUrl}/`);
    endpoint.searchParams.set(
      "select",
      "id,name,origin,process,roast_level,flavor_notes,bean_price,drip_price,image_url,is_active"
    );
    endpoint.searchParams.set("id", `eq.${id}`);
    endpoint.searchParams.set("is_active", "eq.true");
    endpoint.searchParams.set("limit", "1");

    const response = await fetch(endpoint.toString(), {
      cache: "no-store",
      headers: {
        apikey: supabasePublishableKey,
        Authorization: `Bearer ${supabasePublishableKey}`
      }
    });

    if (!response.ok) {
      console.warn(await response.text());
      return null;
    }

    const data = (await response.json()) as Product[];
    const product = data[0];

    return product ? { ...product, id: String(product.id) } : null;
  } catch {
    return null;
  }
}
