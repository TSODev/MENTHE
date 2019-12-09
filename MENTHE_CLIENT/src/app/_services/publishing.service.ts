import { Injectable } from '@angular/core';
import { Variable, PublishList, Mapping, Publication, PublishingAction, PublishMessageHeader } from '../_interfaces/publish.interface';
import { Observable, Subject, from, BehaviorSubject, ReplaySubject } from 'rxjs';
import { SubSink } from 'subsink';
import { CommunicationService } from './communication.service';
import { DBVariableService } from './variable.service';
import { Module } from '../_interfaces/communication.interface';



@Injectable({
  providedIn: 'root'
})

export class PublishingService {

  private toBePublished: PublishList[] = [];
  private publishListSource = new Subject<Publication>();
  public toBePublished$ = this.publishListSource.asObservable();

  private variablesSource = new ReplaySubject<Variable>();
  public variables$ = this.variablesSource.asObservable();

  subs = new SubSink();

  constructor(
    private dbVariableService: DBVariableService,
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

  addToPublishList(object: any, role: string) {
    this.toBePublished.push({object, role});
    this.publishListSource.next({action: PublishingAction.INSERT, post: {object, role}});
  }

  removeFromPublishList(object: any, role: string) {
    this.toBePublished.splice(
      this.toBePublished.indexOf(
        this.toBePublished.find(o => (( o.object === object ) && (o.role === role)))), 1);
    this.publishListSource.next({action: PublishingAction.REMOVE, post: {object, role}});
  }


  addVariableInPublishList(v: Variable) {
    this.variablesSource.next(v);
    this.addToPublishList(v, 'Variable');
  }

  removeVariableFromPublishList(v: Variable) {
    this.removeFromPublishList(v, 'Variable');
  }

  addMappingInPublidhList(m: Mapping) {
    this.toBePublished.push( {
      object: m,
      role: 'Mapping'
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
