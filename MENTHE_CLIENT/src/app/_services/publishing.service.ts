import { Injectable } from '@angular/core';
import { Variable, PublishList, VariableType, VariableDirection, Mapping, Publication, PublishingAction } from '../_interfaces/publish.interface';
import { Observable, Subject, from, BehaviorSubject, ReplaySubject } from 'rxjs';
import { SubSink } from 'subsink';
import { CommunicationService } from './communication.service';
import { DBVariableService } from './variable.service';



@Injectable({
  providedIn: 'root'
})

export class PublishingService {

  private toBePublished: PublishList[] = [];
//  private variables: Variable[] = [];
//  private publishListSource = new ReplaySubject<PublishList>();
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
//                  console.log('[PUBLISHING] Added in Variables List : ', data );
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

  // addVariableInList(direction: VariableDirection, type: VariableType, name: string, defaultValue?: any) {
  //   this.variables.push({direction, type, name, defaultValue});
  // }

  addVariableInPublishList(v: Variable) {
//    console.log('Push new variable in List : ', v);
    this.variablesSource.next(v);
    this.addToPublishList(v, 'Variable');
  }

  addMappingInPublidhList(m: Mapping) {
    this.toBePublished.push( {
      object: m,
      role: 'Mapping'
    });
  }

  // getVariableList(): Variable[] {
  //   return this.variables;
  // }

  getPublishList(): PublishList[] {
    return this.toBePublished;
  }

  closeService() {
    this.subs.unsubscribe();
  }
}
