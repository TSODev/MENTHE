import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Variable, PublishList } from 'src/app/_interfaces/publish.interface';
import { PublishingService } from 'src/app/_services/publishing.service';
import { SubSink } from 'subsink';
import { Observable } from 'rxjs/internal/Observable';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DBVariableService } from 'src/app/_services/variable.service';
import { DBVariable } from 'src/app/_models/variable';
import { Process } from 'src/app/_models/bpmn';
import { Workflow } from 'src/app/_models/workflow';

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

  displayedColumns: string[] = ['name', 'direction', 'type', 'defaultValue'];
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
  ) {

    this.dataSource = this.variables;
  }

  ngOnInit() {
    this.subs.add(
      this.publishingService.variables$.subscribe(
        variable => {
          if ((variable.processId === this.process.attr.id) && (variable.workflowId === this.workflow.workflow_id)) {
            console.log('[GRID] Receive new row ', variable);
            this.variables.push(variable);
            this.mustAddVariable = false;
            const cloned = [...this.dataSource];
            this.dataSource = cloned;
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

  receiveEvent(event: {header, data}) {
    if (event.header === 'cancel') {
      this.mustAddVariable = false;
    }
  }


}
