export class BoundingBox {

  constructor(x, y, width, height) {
    this.setDimensions(x, y, width, height);
  }

  public X: number;
  public Y: number;
  public Width: number;
  public Height: number;

  public setDimensions(x, y, width, height) {
    this.X = x;
    this.Y = y;
    this.Width = width;
    this.Height = height;
  }
}
