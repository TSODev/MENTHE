import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AnalysisService } from 'src/app/_services/analysis.service';
import { PublishingService } from 'src/app/_services/publishing.service'
import { SequenceFlow } from 'src/app/_models/bpmn';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { Variable } from 'src/app/_interfaces/publish.interface';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.css']
})
export class IncomingComponent implements OnInit, OnDestroy {

  @Input()
    incoming: string;

    linked: SequenceFlow[];

    incomingArray: string[];
    haslink = false;
    links: SequenceFlow[];

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
      this.linked = this.analysisService.getLinkedFlowFromElementList(this.incoming);
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
