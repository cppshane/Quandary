import { Injectable, Inject } from '@angular/core';

import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projects: Array<Project> = new Array<Project>();

  constructor() {
    let testProject = new Project();
    testProject.Id = '0001';
    testProject.Title = 'Project 1';

    this.projects.push(testProject);
  }

  getProject(projectId: string) {
    return this.projects.find(project => project.Id === projectId);
  }
}
