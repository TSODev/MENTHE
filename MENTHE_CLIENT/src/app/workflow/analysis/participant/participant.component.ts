import { Component, OnInit, Input } from '@angular/core';
import { Participant } from 'src/app/_models/bpmn';
import { User } from 'src/app/_models';
import { UserService } from 'src/app/_services';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { CommunicationService } from 'src/app/_services/communication.service';
import { PublishMessageHeader } from 'src/app/_interfaces/publish.interface';
import { Module } from 'src/app/_interfaces/communication.interface';

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
  hasParticipant = false;
  currentParticipant = '';
  selectedUser: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private communicationService: CommunicationService,
  ) {
    this.userForm = this.formBuilder.group({
      selectedUser: ['', Validators.required],
    });
    this.userService.getAllUsers().subscribe(
      users => this.users = users
    );
  }

  ngOnInit() {
//    this.userForm.statusChanges.subscribe(() => this.onFormValid());
  }

  onFormValid() {
    if (this.userForm.status === 'VALID') {
      this.communicationService.announce(
        {
          module: Module.PUBLISH,
          header: PublishMessageHeader.PARTICIPANTVALID,
          commObject: { object: {}}
        }
      );
    }
  }

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
    }
    this.currentParticipant = this.userForm.controls.selectedUser.value;

  }
}
