import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AnalysisService } from 'src/app/_services/analysis.service';
import { SequenceFlow } from 'src/app/_models/bpmn';
import { Variable } from 'src/app/_interfaces/publish.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PublishingService } from 'src/app/_services/publishing.service';
import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-outgoing',
  templateUrl: './outgoing.component.html',
  styleUrls: ['./outgoing.component.css']
})
export class OutgoingComponent implements OnInit, OnDestroy {

  @Input()
    outgoing: string;

    linked: SequenceFlow[];

    outgoingArray: string[];
    links: SequenceFlow[];
    haslink = false;

    variableForm: FormGroup;
    variables: Variable[] = [];
    variables$: Observable<Variable>;

    subs = new SubSink();

  constructor(
    private formBuilder: FormBuilder,
    private analysisService: AnalysisService,
    private publishingService: PublishingService,
  ) {
    this.variableForm = this.formBuilder.group({
      variableType: ['', Validators.required],
      name: ['', Validators.required],
      defaultValue: [''],
    });

    this.variables$ = this.publishingService.variables$;

    this.subs.add(this.publishingService.variables$.subscribe(
      data => {
        this.variables.push(data);
      }
    ));
   }

  ngOnInit() {
    this.linked = this.analysisService.getLinkedFlowFromElementList(this.outgoing);
    if (typeof this.linked !== 'undefined') {
      this.haslink = true;
      this.links = this.linked;
    }
    const workflowId = this.analysisService.getElementList().wf.workflow_id;
    const processes = this.analysisService.getElementList().proc;
    this.variables = this.variables.filter(w => w.workflowId === workflowId);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
