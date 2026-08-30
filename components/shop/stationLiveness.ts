export function createStationRelease({
  isStale,
  release,
}: {
  isStale: () => boolean;
  release: () => void;
}) {
  let released = false;

  return () => {
    if (released || isStale()) return false;
    released = true;
    release();
    return true;
  };
}
