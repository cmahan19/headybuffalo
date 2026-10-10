import { getPublishedProduct } from "./catalog";
import { concepts } from "./concepts";

/** Concepts still in development. Once a concept launches as a product it leaves the ideas showcase. */
export function unlaunchedConcepts() {
  return concepts.filter((c) => !getPublishedProduct(c.id));
}
