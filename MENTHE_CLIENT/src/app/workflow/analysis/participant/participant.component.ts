import { Component, OnInit, Input } from '@angular/core';
import { Participant } from 'src/app/_models/bpmn';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { User } from 'src/app/_models';
import { UserService } from 'src/app/_services';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { CommunicationService } from 'src/app/_services/communication.service';
import { PublishingService } from 'src/app/_services/publishing.service';
import { MenthePhase, MentheStep } from 'src/app/_interfaces/analysis.interface';
import { CommunicationMessageHeader, Module } from 'src/app/_interfaces/communication.interface';
import { PublishMessageHeader } from 'src/app/_interfaces/publish.interface';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {

  @Input()
  participant: Participant;

  userForm: FormGroup;
  users: User[];
  validationOK = false;
  publishedOK = false;
  hasParticipant = false;
  currentParticipant = '';
  selectedUser: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private communicationService: CommunicationService,
    private publishingService: PublishingService,
  ) {
    this.userForm = this.formBuilder.group({
      selectedUser: ['', Validators.required],
    });
    this.userService.getAllUsers().subscribe(
      users => this.users = users
    );
  }

  ngOnInit() {
    // this.communicationService.announce(
    //   {
    //     header: CommunicationMessageHeader.COMMUNICATION,
    //     module: Module.COMMUNICATION,
    //     commObject: { object: { phase: MenthePhase.PUBLISH, step: MentheStep.PARTICIPANT } }
    //   });
  }

  // onSubmit() {
  //   this.communicationService.announce(
  //     {
  //       header: PublishMessageHeader.ADDPARTICIPANT,
  //       module: Module.PUBLISH,
  //       commObject: { object: this.userForm.value }
  //     }
  //   );
  //   this.hasParticipant = true;
  //   this.publishedOK = true;

  // }

  changeUser(e) {
    if (this.hasParticipant) {
      this.communicationService.announce(
        {
          header: PublishMessageHeader.CHANGEPARTICIPANT,
          module: Module.PUBLISH,
          commObject: { object:
                          {
                            old: this.currentParticipant,
                            new: this.userForm.controls.selectedUser.value
                          }
                        }
        }
      );
    } else {
      this.communicationService.announce(
        {
          header: PublishMessageHeader.ADDPARTICIPANT,
          module: Module.PUBLISH,
          commObject: { object: this.userForm.controls.selectedUser.value }
        }
      );
      this.hasParticipant = true;
      this.publishedOK = true;
    }
    this.currentParticipant = this.userForm.controls.selectedUser.value;
    this.validationOK = true;
    this.publishedOK = false;

  }

  isPublishValid() {
    this.validationOK = (this.userForm.controls.selectedUser.value !== '');
    return {
      disabled: !this.validationOK,

    };
  }

}
