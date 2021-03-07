import { ClassificationObjectType } from "../enums/classification-object-type.enum";

export class ClassificationObject {
  public Id: string;
  public Title: string;
  public Color: string;
  public Data = new Array<string>();
  public Tensors = new Array<any>();
  public Type = ClassificationObjectType.StateDetection;

  public DetectionConfidence: number;
}
