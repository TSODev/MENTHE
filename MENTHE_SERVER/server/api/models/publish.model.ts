export enum PublishingAction {
    INSERT = 'INSERT',
    REMOVE = 'REMOVE',
  }
  
  export interface PublishList {
    object: any;
    role: string;
  }
  
  export interface Publication {
    action: PublishingAction;
    post: PublishList;
  }
  