import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AnalysisService } from 'src/app/_services/analysis.service';
import { SequenceFlow } from 'src/app/_models/bpmn';
import { Variable, PublishMessageHeader, VariableDirection, VariableType } from 'src/app/_interfaces/publish.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PublishingService } from 'src/app/_services/publishing.service';
import { SubSink } from 'subsink';
import { Observable } from 'rxjs';
import { CommunicationService } from 'src/app/_services/communication.service';
import { Module, CommunicationMessageHeader } from 'src/app/_interfaces/communication.interface';

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
//      variableType: ['', Validators.required],
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
              if (mapping.commObject.relatedToId === this.outgoing) {
                this.variableForm.controls.name.setValue(mapping.commObject.object);
                this.varValue = mapping.commObject.object;
                this.hasMapping = true;
              }
            } else {
              if (mapping.header === PublishMessageHeader.CHANGEMAPPING) {
                      if (mapping.commObject.relatedToId === this.outgoing) {
                        this.variableForm.controls.name.setValue(mapping.commObject.object.new);
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
    this.linked = this.analysisService.getLinkedFlowFromElementList(this.outgoing);
    if (typeof this.linked !== 'undefined') {
      this.haslink = true;
      this.links = this.linked;
    }
    const workflowId = this.analysisService.getElementList().wf.workflow_id;
    const processes = this.analysisService.getElementList().proc;
    this.variables = this.variables.filter(w => w.workflowId === workflowId).sort();
  }

  onChange() {
//    console.log('[Outgoing Mapped Value] :', this.varValue);
    if (this.varValue === '') {}
    if (this.oldvarValue === 'Not Mapped') {
        this.oldvarValue = this.varValue;
        this.communicationService.announce(
          {
            header: PublishMessageHeader.ADDMAPPING,
            module: Module.PUBLISH,
            commObject: { object: this.varValue ,
                          relatedToId: this.outgoing}
          }
        );
    } else {
      this.communicationService.announce(
        {
          header: PublishMessageHeader.CHANGEMAPPING,
          module: Module.PUBLISH,
          commObject: { object: { old: this.oldvarValue, new: this.varValue },
                        relatedToId: this.outgoing}
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
        commObject: { object: { aliasValue: this.aliasValue},
                      relatedToId: link.attr.id
        }
      }
    );
  }


  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
