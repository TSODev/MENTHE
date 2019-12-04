export  enum ProcessState {
  RUNNING,
  WAITING,
  STOPPED,
  LOADING,
}


export class DBProcess {
  workflowId: string;
  processId: string;
  name: string;
  status: ProcessState;
}
