
export enum VariableType {
  INTERER = 'integer',
  DECIMAL = 'decimal',
  STRING = 'string',
  BOOLEAN = 'boolean',
}

export enum VariableDirection {
  NONE = '',
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export class Variable {
  variableId: string;
  processId: string;
  workflowId: string;
  direction: VariableDirection;
  type: VariableType;
  name: string;
  defaultValue: any;
  mapped: boolean;
}

export class Mapping {
  flowId: string;
  mappedTo: Variable;
}

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

export enum PublishMessageHeader {
  STARTPUBLISHING = 'STARTPUBLISHING',
  ADDPARTICIPANT = 'ADDPARTICIPANT',
  REMOVEPARTICIPANT = 'REMOVEPARTICIPANT',
  CHANGEPARTICIPANT = 'CHANGEPARTICIPANT',
  ADDVARIABLE = 'ADDVARIABLE',
  REMOVEVARIABLE = 'REMOVEVARIABLE',
  ANNOUNCEVARIABLE = 'ANNOUNCEVARIABLE',
  ADDMAPPING = 'ADDMAPPING',
  CHANGEMAPPING = 'CHANGEMAPPING',
  ALIAS = 'ALIAS',
  ENDPUBLISHING = 'ENDPUBLISHING',
}
