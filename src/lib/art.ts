import manifest from "./art-manifest.json";

// Registry of generated decorative assets (see docs/IMAGE_GENERATION_AND_ASSET_POLICY.md).
// Every entry is decorative_only=true and product_proof=false; none may be used as product imagery.

export interface ArtAsset {
  id: string;
  file: string;
  kind: string;
  purpose: string;
  routes: string[];
  width: number;
  height: number;
  bytes: number;
  date: string;
  source: "generated";
  generator: string;
  seed: number | null;
  palette: string;
  decorative_only: true;
  product_proof: false;
  alt: string;
  approval_status: "provisional" | "approved" | "rejected";
}

const assets = manifest as ArtAsset[];

export function art(id: string): ArtAsset {
  const a = assets.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown art asset "${id}". Run: node scripts/generate-art.mjs`);
  if (a.approval_status === "rejected") throw new Error(`Art asset "${id}" was rejected and must not be used`);
  return a;
}

export const allArt = assets;
