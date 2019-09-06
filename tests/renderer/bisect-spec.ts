import { ElectronVersionSource, ElectronVersionState } from '../../src/interfaces';
import { BisectInstance } from '../../src/renderer/bisect';

const generateVersionRange = (rangeLength: number) =>
  (new Array(rangeLength)).fill(0).map((_, i) => ({
    state: ElectronVersionState.ready,
    version: `${i + 1}.0.0`,
    source: ElectronVersionSource.local
  }));

describe('bisect', () => {
  let bisectInstance: BisectInstance;

  beforeEach(() => {
    const versions = generateVersionRange(9);
    bisectInstance = new BisectInstance(versions);
  });

  it('selects a pivot in the middle of the array', () => {
    const pivot = bisectInstance.getCurrentVersion();
    const middleIndex = Math.floor(bisectInstance.versionRange.length / 2);
    expect(pivot).toBe(bisectInstance.versionRange[middleIndex]);
  });

  describe('continue()', () => {
    it('returns the current version', () => {
      const result = bisectInstance.continue(true);
      const version = bisectInstance.getCurrentVersion();
      expect(result).toBe(version);
    });

    it('discards lower half of the range if pivot is good version', () => {
      const pivot = bisectInstance.getCurrentVersion();
      const pivotIndex = bisectInstance.versionRange.indexOf(pivot);
      const upperHalf = bisectInstance.versionRange.slice(pivotIndex + 1);

      bisectInstance.continue(true);
      expect(bisectInstance.versionRange).toMatchObject(upperHalf);
    });

    it('discards upper half of the range if pivot is bad version', () => {
      const pivot = bisectInstance.getCurrentVersion();
      const pivotIndex = bisectInstance.versionRange.indexOf(pivot);
      const lowerHalf = bisectInstance.versionRange.slice(0, pivotIndex);

      bisectInstance.continue(false);
      expect(bisectInstance.versionRange).toMatchObject(lowerHalf);
    });

    it('does nothing if version range has length 1', () => {
      const versions = generateVersionRange(1);
      bisectInstance = new BisectInstance(versions);

      expect(bisectInstance.versionRange.length).toBe(1);
      bisectInstance.continue(true);
      expect(bisectInstance.versionRange.length).toBe(1);
    });
  });

  describe('getCurrentVersion()', () => {
    it('returns a version within the range', () => {
      const version = bisectInstance.getCurrentVersion();
      expect(bisectInstance.versionRange).toContain(version);
    });
  });
});
