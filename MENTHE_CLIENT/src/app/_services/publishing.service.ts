import { Injectable } from '@angular/core';
import { Variable, PublishList, VariableType, VariableDirection } from '../_interfaces/publish.interface';
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
  public toBePublished$ = from(this.toBePublished);

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
//                              this.variables.push(o);
                          });
                  console.log('[PUBLISHING] Added in Variables List : ', data );
        }
      )
    );
  }

  addToPublishList(object: any, role: string) {
    this.toBePublished.push({object, role});
  }

  removeFromPublishList(object: any, role: string) {
    this.toBePublished.splice(
      this.toBePublished.indexOf(
        this.toBePublished.find(o => (( o.object === object ) && (o.role === role)))), 1);
  }

  // addVariableInList(direction: VariableDirection, type: VariableType, name: string, defaultValue?: any) {
  //   this.variables.push({direction, type, name, defaultValue});
  // }

  addVariableInPublishList(v: Variable) {
    console.log('Push new variable in List : ', v);
    this.variablesSource.next(v);
//    this.variables.push(v);
  }

  // getVariableList(): Variable[] {
  //   return this.variables;
  // }

  getPublishList(): PublishList[] {
    return this.toBePublished;
  }
}
