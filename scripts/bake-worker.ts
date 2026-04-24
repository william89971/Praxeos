import { renderTileSvg } from "@/modules/halving-garden/lib/tile";
import type { Block } from "@/modules/halving-garden/lib/types";

export function bakeTile(
  job: { z: number; x: number; y: number },
  blocks: readonly Block[],
) {
  return renderTileSvg(job.z, job.x, job.y, blocks);
}
