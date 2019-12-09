import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AnalysisService } from 'src/app/_services/analysis.service';
import { PublishingService } from 'src/app/_services/publishing.service'
import { SequenceFlow } from 'src/app/_models/bpmn';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { Variable, PublishMessageHeader } from 'src/app/_interfaces/publish.interface';
import { CommunicationService } from 'src/app/_services/communication.service';
import { Module, CommunicationMessageHeader } from 'src/app/_interfaces/communication.interface';
import { map } from 'rxjs/operators';
import { AnalysisMessagesHeaders } from 'src/app/_interfaces/analysis.interface';

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
  hasAlias = false;

  hasMapping = false;

  variableForm: FormGroup;
  variables: Variable[] = [];
  variables$: Observable<Variable>;
  aliasValue = '';
  varValue = 'Not Mapped';
  oldvarValue = this.varValue;

  subs = new SubSink();


  constructor(
    private formBuilder: FormBuilder,
    private analysisService: AnalysisService,
    private publishingService: PublishingService,
    private communicationService: CommunicationService,
  ) {
    this.variableForm = this.formBuilder.group({
      variableType: ['', Validators.required],
      name: ['', Validators.required],
      defaultValue: [''],
      alias: [''],
    });

    this.variables$ = this.publishingService.variables$;

    this.subs.add(this.publishingService.variables$.subscribe(
      data => {
        this.variables.push(data);
      }
    ));

    this.subs.add(
      this.communicationService.commMessage$.subscribe(
        mapping => {
          if (mapping.module === Module.PUBLISH) {
            if (mapping.header === PublishMessageHeader.ADDMAPPING) {
              console.log('Incoming intercept message :', mapping);
              if (mapping.commObject.relatedToId === this.incoming) {
                this.varValue = mapping.commObject.object;
                this.hasMapping = true;
              }
            } else {
              if (mapping.header === PublishMessageHeader.CHANGEMAPPING) {
                      console.log('Incoming intercept message :', mapping);
                      if (mapping.commObject.relatedToId === this.incoming) {
                        this.varValue = mapping.commObject.object.new;
                        this.hasMapping = true;
                      }
            }
          }
        }
      }
      )
    );
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


  onChange() {
    //    console.log('[Outgoing Mapped Value] :', this.varValue);
    if (this.varValue === '') { }
    if (this.oldvarValue === 'Not Mapped') {
      this.oldvarValue = this.varValue;
      this.communicationService.announce(
        {
          header: PublishMessageHeader.ADDMAPPING,
          module: Module.PUBLISH,
          commObject: {
            object: this.varValue,
            relatedToId: this.incoming
          }
        }
      );
    } else {
      this.communicationService.announce(
        {
          header: PublishMessageHeader.CHANGEMAPPING,
          module: Module.PUBLISH,
          commObject: {
            object: { old: this.oldvarValue, new: this.varValue },
            relatedToId: this.incoming
          }
        }
      );
      this.oldvarValue = this.varValue;
    }
  }

  addAlias() {
    this.hasAlias = !this.hasAlias;
  }

  onAliasChange(link: SequenceFlow) {
    //    console.log('Alias :', this.variableForm.controls.alias.value);
    this.aliasValue = this.variableForm.controls.alias.value;
    this.communicationService.announce(
      {
        module: Module.PUBLISH,
        header: PublishMessageHeader.ALIAS,
        commObject: {
          object: { aliasValue: this.aliasValue },
          relatedToId: link.attr.id
        }
      }
    );
  }


  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
