import { Injectable } from '@angular/core';

export interface PublishList {
  object: any;
  role: string;
}

@Injectable({
  providedIn: 'root'
})

export class PublishingService {

  private toBePublished: PublishList[] = [];

  constructor() { }

  addToPublishList(object: any, role: string) {
    this.toBePublished.push({object, role});
  }

  removeFromPublishList(object: any, role: string) {
    this.toBePublished.splice(
      this.toBePublished.indexOf(
        this.toBePublished.find(o => (( o.object === object ) && (o.role === role)))), 1);
  }

  getPublishList(): PublishList[] {
    return this.toBePublished;
  }

  consoleLogPublishList() {
    console.log('[PUBLISH]', this.toBePublished);
  }
}
