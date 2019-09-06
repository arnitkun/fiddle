import { ElectronVersion } from '../interfaces';

export class BisectInstance {
  public versionRange: Array<ElectronVersion>;
  private pivotIndex: number;

  constructor(versionRange: Array<ElectronVersion>) {
    this.versionRange = versionRange;
    this.calculatePivot();
  }

  public getCurrentVersion = () => {
    return this.versionRange[this.pivotIndex];
  }

  public continue = (isGoodVersion: boolean) => {
    if (this.versionRange.length === 1) {
      return this.versionRange[0];
    }

    if (isGoodVersion) {
      this.versionRange.splice(0, this.pivotIndex + 1);
    } else {
      this.versionRange.splice(this.pivotIndex);
    }
    this.calculatePivot();
    return this.getCurrentVersion();
  }

  private calculatePivot = () => {
    this.pivotIndex = Math.floor(this.versionRange.length / 2);
  }
}
