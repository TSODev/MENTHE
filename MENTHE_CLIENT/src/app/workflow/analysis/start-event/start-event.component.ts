import { Component, OnInit, Input } from '@angular/core';
import { StartEvent, SequenceFlow, Process } from 'src/app/_models/bpmn';
import { AnalysisService } from 'src/app/_services/analysis.service';
import { CommunicationService } from 'src/app/_services/communication.service';
import { CommunicationMessageHeader, Module } from 'src/app/_interfaces/communication.interface';
import { MenthePhase, MentheStep } from 'src/app/_interfaces/analysis.interface';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { PublishingService } from 'src/app/_services/publishing.service';
import { Variable, PublishMessageHeader } from 'src/app/_interfaces/publish.interface';

@Component({
  selector: 'app-start-event',
  templateUrl: './start-event.component.html',
  styleUrls: ['./start-event.component.css']
})
export class StartEventComponent implements OnInit {

  @Input()
    process: Process;
  @Input()
    startEvents: StartEvent[];

    hasVariables = false;
    variables: Variable[] = [];

    inputVariableForm: FormGroup;
    validationOK = false;
    publishedOK = false;
    variableMgmtDone = false;
    mustAddVariable = false;
    inputType = 'Input';

    outgoings: SequenceFlow[];

    vtypes = [
      'integer',
      'decimal',
      'string',
      'boolean'
    ];


  constructor(
//    private formBuilder: FormBuilder,
    private analysisService: AnalysisService,
//    private communicationService: CommunicationService,
//    private publishingService: PublishingService,
  ) {
    // this.inputVariableForm = this.formBuilder.group({
    //   input: ['', Validators.required],
    // });

    // this.publishingService.variables$.subscribe(
    //   data => {
    //     console.log('Publishing Service Variable : ', data);
    //     this.variables.push(data);
    //     this.hasVariables = this.variables.length > 0;
    //   }
    // );
  }


  ngOnInit() {
    this.startEvents.forEach(
      sEvent => this.outgoings = this.analysisService.getElementAsArray(sEvent.outgoing)
    );
  }

  onSubmit() {

  }

  isPublishValid() {

  }

  addVariable() {
    this.mustAddVariable = true;

  }


}
