import { BLOCKS_PER_EPOCH, EPOCHS, getEpoch } from "./epochs";

export function totalIssuedAtHeight(height: number): number {
  if (height <= 0) return 50;

  let total = 0;
  for (const epoch of EPOCHS) {
    if (height >= epoch.endHeight) {
      total += (epoch.endHeight - epoch.startHeight + 1) * epoch.subsidy;
      continue;
    }

    const partialBlocks = Math.max(0, height - epoch.startHeight + 1);
    total += partialBlocks * epoch.subsidy;
    break;
  }

  return total;
}

export function remainingSubsidyAtHeight(height: number): number {
  return getEpoch(height).subsidy;
}

export function issuedBtcPerDay(height: number): number {
  return remainingSubsidyAtHeight(height) * (24 * 6);
}

export function issuanceSinceHeight(startHeight: number, endHeight: number): number {
  if (endHeight <= startHeight) return 0;
  return totalIssuedAtHeight(endHeight) - totalIssuedAtHeight(startHeight);
}

export function nextHalvingHeight(height: number): number {
  const nextEpoch = EPOCHS.find((epoch) => epoch.startHeight > height);
  return (
    nextEpoch?.startHeight ?? Math.ceil(height / BLOCKS_PER_EPOCH) * BLOCKS_PER_EPOCH
  );
}
