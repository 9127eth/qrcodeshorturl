const WEB_RISK_TIMEOUT_MS = 4_000;

interface WebRiskResponse {
  threat?: {
    threatTypes: string[];
  };
}

export function normalizeHttpUrl(value: string): string | null {
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const parsed = new URL(candidate);
    if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export async function checkUrlSafety(url: string): Promise<boolean> {
  const apiKey = process.env.WEBRISK_API_KEY;
  if (!apiKey) {
    console.error('WEBRISK_API_KEY is not configured.');
    return false;
  }

  const params = new URLSearchParams({ key: apiKey, uri: url });
  ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'].forEach((type) =>
    params.append('threatTypes', type)
  );

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEB_RISK_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://webrisk.googleapis.com/v1/uris:search?${params.toString()}`,
      { signal: controller.signal }
    );

    if (!response.ok) {
      console.error(`Web Risk request failed with status ${response.status}.`);
      return false;
    }

    const data = (await response.json()) as WebRiskResponse;
    return !data.threat;
  } catch (error) {
    console.error('Web Risk request failed:', error);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
