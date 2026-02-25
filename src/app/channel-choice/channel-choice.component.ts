import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-channel-choice',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './channel-choice.component.html',
  styleUrl: './channel-choice.component.css'
})
export class ChannelChoice {

  channelForm: FormGroup;

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {
    this.channelForm = this.fb.group({
      channelName: new FormControl('', Validators.required)
    });
  }

  search() {

    if(this.channelForm.valid) {
      const channelName = this.channelForm.value['channelName'];
      console.log(channelName);

      this.http.get('https://api.streamelements.com/kappa/v2/channels/' + channelName, { observe: 'response' }).subscribe({
        next: (response: any) => {
          console.log(response, response.body.provider);
          if (response.status == '200' && response.body.provider == 'twitch') {
            console.log("Channel found");

            localStorage.setItem('channelName', response.body.displayName);
            localStorage.setItem('channelId', response.body.providerId);

            this.router.navigate(['/' + channelName]).then(() => {
              window.location.reload();
            });
          } else {
            this.channelForm.controls['channelName'].setErrors({'incorrect': true});
            console.log("Channel not found");
          }
        },
        error: err => {
          this.channelForm.controls['channelName'].setErrors({'incorrect': true});
          console.log("Channel not found");
        }
      });

    }
  }
}
