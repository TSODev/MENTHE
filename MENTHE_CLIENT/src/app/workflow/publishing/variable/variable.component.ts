import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommunicationService } from 'src/app/_services/communication.service';
import { AnalysisService } from 'src/app/_services/analysis.service';
import { PublishingService } from 'src/app/_services/publishing.service';
import { SubSink } from 'subsink';
import { VariableDirection, PublishMessageHeader, Variable } from 'src/app/_interfaces/publish.interface';
import { CommunicationMessageHeader, Module } from 'src/app/_interfaces/communication.interface';
import { SequenceFlow, Process } from 'src/app/_models/bpmn';
import { Workflow } from 'src/app/_models/workflow';


@Component({
  selector: 'app-variable',
  templateUrl: './variable.component.html',
  styleUrls: ['./variable.component.css']
})
export class VariableComponent implements OnInit, OnDestroy {

  @Input()
  process: Process;

  @Input()
  workflow: Workflow;

  @Output()
  sentEvent = new EventEmitter<{header, data}>();

  flows: SequenceFlow[];

  inputVariableForm: FormGroup;
  vtypes = [
    'integer',
    'decimal',
    'string',
    'boolean'
  ];

  directions = [
    'INPUT',
    'OUTPUT',
  ];
  isFormValid = false;

  subs = new SubSink();

  constructor(
    private formBuilder: FormBuilder,
    private analysisService: AnalysisService,
    private communicationService: CommunicationService,
    private publishingService: PublishingService
  ) {
    this.inputVariableForm = this.formBuilder.group({
      direction: [''],
      variableType: ['', Validators.required],
      name: ['', Validators.required],
      defaultValue: [''],
      mappedTo: [''],
    });

    // this.subs.add(
    //   this.publishingService.variables$.subscribe(
    //     data => {
    //       console.log('[PUBLISH] - Variable List', data);
    //     }
    //   )
    // );

    this.flows = this.analysisService.ElementList.flow;
  }


  ngOnInit() {
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  Submit() {
    this.communicationService.announce(
      {
        header: PublishMessageHeader.ADDVARIABLE,
        module: Module.PUBLISH,
        commObject: {
          object: {
            direction: VariableDirection.NONE,
            type: this.inputVariableForm.controls.variableType.value,
            name: this.inputVariableForm.controls.name.value,
            defaultValue: this.inputVariableForm.controls.defaultValue.value,
            processId: this.process.attr.id,
            workflowId: this.workflow.workflow_id,
          }
        }
      }
    );
  }

  changeVariableType() {

  }

  changeVariableDirection() {

  }

  changeMapped() {
  }

  cancel() {
    this.inputVariableForm.controls.direction.setValue('');
    this.inputVariableForm.controls.variableType.setValue('');
    this.inputVariableForm.controls.name.setValue('');
    this.inputVariableForm.controls.defaultValue.setValue('');
    this.inputVariableForm.controls.mappedTo.setValue('');
    this.sentEvent.emit({header: 'cancel', data: {}});
  }

}
