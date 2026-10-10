import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ProductStatus, RequirementKey } from "./readiness";
import type { FeeConfig, Listing, SellerApplication, BuyerReport } from "./marketplace/types";
import { DEFAULT_FEE_CONFIG } from "./marketplace/fees";

// Minimal JSON-file persistence for admin workflows until the owner chooses a database
// (see docs/COLORFUL_MARKETPLACE_AUDIT.md §6). Works locally and on any server with a writable disk.
// On read-only/serverless hosts, writes fail and callers surface that honestly to the admin.

export interface AuditEvent {
  at: string;
  actor: string;
  action: string;
  target: string;
  from?: string;
  to?: string;
  note?: string;
}

export interface ConceptState {
  status: ProductStatus;
  checks: Partial<Record<RequirementKey, boolean>>;
  fields: Record<string, string>;
  scorecard: Record<string, boolean>;
}

export interface AffiliateClickEvent {
  at: string;
  productSlug: string;
  merchant: string;
  fromPath: string;
}

export interface StoreData {
  version: 1;
  concepts: Record<string, ConceptState>;
  sellers: SellerApplication[];
  listings: Listing[];
  feeConfig: FeeConfig;
  reports: BuyerReport[];
  clicks: AffiliateClickEvent[];
  audit: AuditEvent[];
}

const empty = (): StoreData => ({
  version: 1,
  concepts: {},
  sellers: [],
  listings: [],
  feeConfig: { ...DEFAULT_FEE_CONFIG },
  reports: [],
  clicks: [],
  audit: [],
});

const dir = () => process.env.HB_DATA_DIR || join(process.cwd(), ".data");
const file = () => join(dir(), "hb-store.json");

export async function readStore(): Promise<StoreData> {
  try {
    return { ...empty(), ...JSON.parse(await readFile(file(), "utf8")) };
  } catch {
    return empty();
  }
}

let queue: Promise<unknown> = Promise.resolve();

export type WriteResult = { ok: true } | { ok: false; error: string };

/** Serialized read-modify-write. The mutator may throw to abort without writing. */
export function updateStore(mutate: (d: StoreData) => void): Promise<WriteResult> {
  const run = queue.then(async (): Promise<WriteResult> => {
    const data = await readStore();
    mutate(data);
    try {
      await mkdir(dir(), { recursive: true });
      const tmp = `${file()}.${process.pid}.tmp`;
      await writeFile(tmp, JSON.stringify(data, null, 2));
      await rename(tmp, file());
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: `Changes could not be saved: this environment has no writable storage (${e instanceof Error ? e.message : e}). Connect a database to enable admin changes in production.`,
      };
    }
  });
  queue = run.catch(() => undefined);
  return run;
}

export function audit(d: StoreData, e: Omit<AuditEvent, "at">) {
  d.audit.unshift({ at: new Date().toISOString(), ...e });
  d.audit = d.audit.slice(0, 1000);
}
