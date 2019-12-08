import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Variable, PublishList, PublishMessageHeader } from 'src/app/_interfaces/publish.interface';
import { PublishingService } from 'src/app/_services/publishing.service';
import { SubSink } from 'subsink';
import { Observable } from 'rxjs/internal/Observable';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DBVariableService } from 'src/app/_services/variable.service';
import { DBVariable } from 'src/app/_models/variable';
import { Process } from 'src/app/_models/bpmn';
import { Workflow } from 'src/app/_models/workflow';
import { CommunicationService } from 'src/app/_services/communication.service';
import { Module } from 'src/app/_interfaces/communication.interface';

@Component({
  selector: 'app-variable-grid',
  templateUrl: './variable-grid.component.html',
  styleUrls: ['./variable-grid.component.css']
})
export class VariableGridComponent implements OnInit, OnDestroy {

  @Input()
  process: Process;
  @Input()
  workflow: Workflow;

  subs = new SubSink();

  displayedColumns: string[] = ['name', 'type', 'action'];
  dataSource: Variable[] = [];

  variableForm: FormGroup;
  variables: Variable[] = [];
  validationOK = false;
  publishedOK = false;
  variableMgmtDone = false;
  mustAddVariable = false;
  inputType = 'Input';

  constructor(
    private publishingService: PublishingService,
    private communicationService: CommunicationService,
  ) {

    this.dataSource = this.variables;
  }

  ngOnInit() {
    this.subs.add(
      this.publishingService.variables$.subscribe(
        variable => {
          if (variable.workflowId === this.workflow.workflow_id) {
              if (variable.processId === this.process.attr.id) {
                this.variables.push(variable);
                this.mustAddVariable = false;
                const cloned = [...this.variables];
                this.dataSource = cloned;
              }
            }
        }
      )
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  isPublishValid() {

  }

  addVariable() {
    this.mustAddVariable = true;
  }

  deleteVariable(variable: Variable) {
    this.communicationService.announce(
      {
        module: Module.PUBLISH,
        header: PublishMessageHeader.REMOVEVARIABLE,
        commObject: { object: variable}
      }
    );
    this.variables.splice(this.variables.indexOf(this.variables.find(o => o === variable)), 1);
    const cloned = [...this.variables];
    this.dataSource = cloned;
  }

  receiveEvent(event: {header, data}) {
    if (event.header === 'cancel') {
      this.mustAddVariable = false;
    }
  }


}
