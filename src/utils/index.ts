async function makeNWSRequest<T>(url: string, params?:Record<string, any>): Promise<T | null> {
  try {
    let fullUrl = url;
    if (params) {
      const urlObj = new URL(url);
      Object.keys(params).forEach(key => {
        urlObj.searchParams.append(key, params[key]?.toString() || "");
      });
      fullUrl = urlObj.toString();
    }
    console.error(fullUrl);
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making NWS request:", error);
    return null;
  }
}

export const API_KEY = "e7d541d8ecc298dd"
export default makeNWSRequest;
