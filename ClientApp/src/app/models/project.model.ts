  import { ClassificationObject } from '../models/classification-object.model';

export class Project {
  public Id: string;
  public Title: string;
  public Classifier: any;
  public ClassificationObjects = new Array<ClassificationObject>();

  getClassificationObject(id: string) {
    return this.ClassificationObjects.find(object => object.Id === id);
  }
}
