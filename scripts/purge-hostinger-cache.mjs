import process from "node:process";
import { pathToFileURL } from "node:url";

const REQUIRED_ENV = [
  "HOSTINGER_API_TOKEN",
  "HOSTINGER_USERNAME",
  "HOSTINGER_DOMAIN",
];

export async function purgeHostingerCache({
  env = process.env,
  fetchImpl = globalThis.fetch,
  log = console.log,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  random = Math.random,
  timeoutMs = 12_000,
  attempts = 3,
} = {}) {
  const missing = REQUIRED_ENV.filter((name) => !env[name]?.trim());
  if (missing.length > 0) {
    log(`Hostinger cache purge skipped (missing ${missing.join(", ")}).`);
    return { status: "skipped", missing };
  }

  const token = env.HOSTINGER_API_TOKEN.trim();
  const username = env.HOSTINGER_USERNAME.trim();
  const domain = env.HOSTINGER_DOMAIN.trim();
  const endpoint =
    `https://developers.hostinger.com/api/hosting/v1/accounts/` +
    `${encodeURIComponent(username)}/websites/${encodeURIComponent(domain)}/cache/clear`;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let response;
    try {
      response = await fetchImpl(endpoint, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      if (attempt >= attempts) throw error;
      await sleep(350 * 2 ** (attempt - 1) + random() * 250);
      continue;
    }

    if (response.ok) {
      log(`Hostinger server and CDN cache purge accepted for ${domain}.`);
      return { status: "purged", domain };
    }

    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt >= attempts) {
      throw new Error(`Hostinger cache purge failed with HTTP ${response.status}.`);
    }

    const retryAfterHeader = response.headers?.get?.("retry-after");
    const retryAfterSeconds = Number(retryAfterHeader);
    const retryAfterDate = Date.parse(retryAfterHeader ?? "");
    const delay = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
      ? retryAfterSeconds * 1000
      : Number.isFinite(retryAfterDate) && retryAfterDate > Date.now()
        ? retryAfterDate - Date.now()
        : 350 * 2 ** (attempt - 1) + random() * 250;
    await sleep(delay);
  }

  throw new Error("Hostinger cache purge exhausted its retry budget.");
}

const isEntryPoint =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isEntryPoint) {
  const result = await purgeHostingerCache();
  if (process.argv.includes("--required") && result.status !== "purged") {
    console.error("Hostinger cache purge is required for this deployment.");
    process.exitCode = 2;
  }
}
