import { Injectable, EventEmitter } from '@angular/core';
import { Variable,
          PublishList,
          Mapping,
          Publication,
          PublishingAction,
          PublishedItem } from '../_interfaces/publish.interface';
import { Subject, ReplaySubject, BehaviorSubject } from 'rxjs';
import { SubSink } from 'subsink';
import { DBVariableService } from './variable.service';
import { AnalysisService } from './analysis.service';
import { ElementList, ElementListCount, ListOfElement } from '../_interfaces/analysis.interface';



@Injectable({
  providedIn: 'root'
})

export class PublishingService {

  private toBePublished: PublishList[] = [];
  private publishListSource = new Subject<Publication>();
  public toBePublished$ = this.publishListSource.asObservable();

  private variablesSource = new ReplaySubject<Variable>();
  public variables$ = this.variablesSource.asObservable();

  private publishDoneSource = new BehaviorSubject<boolean>(false);
  public publishIsDone$ = this.publishDoneSource.asObservable();

  subs = new SubSink();
  elements: ElementList;
  nbItems: ElementListCount[] = [];
  elementThatShouldBeMappedBeforePublishing = [ListOfElement.PARTICIPANT, ListOfElement.FLOW];

  constructor(
    private dbVariableService: DBVariableService,
    private analysisService: AnalysisService,
  ) {

    this.subs.add(
      this.dbVariableService.getAllDBVariable().subscribe(
        data => {
          data.forEach
            (o => {
              this.variablesSource.next(o);
            });
        }
      )
    );
  }

  startPublishing() {
    this.elements = this.analysisService.getElementList();
    Object.keys(this.elements).forEach(element => {
      this.nbItems.push({name: element, count: this.elements[element].length});
    });
  }

  isPublishingFinished() {
    let total = 0;
    this.elementThatShouldBeMappedBeforePublishing.forEach(
      element => { total += this.nbItems.find(e => e.name === element).count; }
    );
    return (total === 0);
  }

  markValidated(elementName: string) {
    const element = this.nbItems.find(e => e.name === elementName);
    element.count -= 1;
    if (this.isPublishingFinished()) {
      this.publishDoneSource.next(true);
    }
  }

addToPublishList(object: any, role: string) {
  this.toBePublished.push({ object, role });
  this.publishListSource.next({ action: PublishingAction.INSERT, post: { object, role } });
}

removeFromPublishList(object: any, role: string) {
  this.toBePublished.splice(
    this.toBePublished.indexOf(
      this.toBePublished.find(o => ((o.object === object) && (o.role === role)))), 1);
  this.publishListSource.next({ action: PublishingAction.REMOVE, post: { object, role } });
}


addVariableInPublishList(v: Variable) {
  this.variablesSource.next(v);
  this.addToPublishList(v, PublishedItem.VARIABLE);
}

removeVariableFromPublishList(v: Variable) {
  this.removeFromPublishList(v, PublishedItem.VARIABLE);
}

addMappingInPublidhList(m: Mapping) {
  this.toBePublished.push({
    object: m,
    role: PublishedItem.MAPPING
  });
}

getPublishList(): PublishList[] {
  return this.toBePublished;
}

getPublishListByElement(element: string) {
  return this.toBePublished.filter(o => o.role === element);
}

closeService() {
  this.subs.unsubscribe();
}
}
