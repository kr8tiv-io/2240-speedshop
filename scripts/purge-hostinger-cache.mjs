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

  const response = await fetchImpl(endpoint, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Hostinger cache purge failed with HTTP ${response.status}.`);
  }

  log(`Hostinger server and CDN cache purge accepted for ${domain}.`);
  return { status: "purged", domain };
}

const isEntryPoint =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isEntryPoint) await purgeHostingerCache();
