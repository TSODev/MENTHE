
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
}

export interface PublishList {
  object: any;
  role: string;
}

export enum PublishMessageHeader {
  ADDPARTICIPANT = 'ADDPARTICIPANT',
  REMOVEPARTICIPANT = 'REMOVEPARTICIPANT',
  CHANGEPARTICIPANT = 'CHANGEPARTICIPANT',
  ADDVARIABLE = 'ADDVARIABLE',
  ADDMAPPING = 'ADDMAPPING',
  CHANGEMAPPING = 'CHANGEMAPPING',
}
