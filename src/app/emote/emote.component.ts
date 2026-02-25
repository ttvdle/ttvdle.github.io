import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { compareTwoStrings } from 'string-similarity';

@Component({
  selector: 'app-emote',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './emote.component.html',
  styleUrl: './emote.component.scss'
})
export class Emote {

  guessForm: FormGroup;

  channelName: string | null = null;
  channelId: string | null = null;

  emoteCount: number = 0;
  emoteNumber: number = 0;
  emoteUrlIdArray: any[] | null = null;
  emoteUrlId: string | null = null;
  emoteName: string | null = null;
  emoteUrl: string | null = null;
  emoteStyle: string = 'emote-loading';

  allEmotesIds: Array<number> | null = null;
  solvedEmotesIds: Array<number> | null = null;
  availableEmotesIds: Array<number> | null = null;
  solved: string = '';
  solvedPercent: number = 0;

  level: number = 1;
  score: number = -1;

  hearts: Array<number> = [1,1,1,1,1,1];
  heartbreaks: Array<number> = [];

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {
    this.guessForm = this.fb.group({
      guess: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.channelName = localStorage.getItem('channelName');
    this.channelId = localStorage.getItem('channelId');

    this.http.get('https://api.7tv.app/v3/users/twitch/' + this.channelId, { observe: 'response' }).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.status == '200') {
          this.emoteCount = response.body.emote_set.emote_count;

          this.allEmotesIds = new Array(this.emoteCount).fill(null).map((_, i) => i + 1);
          this.solvedEmotesIds = this.unpackArray();

          this.solved = this.solvedEmotesIds.length + '/' + this.allEmotesIds.length;
          this.solvedPercent = Math.floor((this.solvedEmotesIds.length / this.allEmotesIds.length) * 100);

          var sEI = this.solvedEmotesIds;
          this.availableEmotesIds = this.allEmotesIds.filter(function (x) {
            if(sEI) return sEI.indexOf(x) < 0;
            return
          });

          this.emoteNumber = this.getRandomId();

          this.emoteStyle = 'emote-loaded blur-0';
          this.emoteUrlIdArray = Array.of(response.body.emote_set.emotes);
          this.refreshEmote();
        }
      },
      error: err => {
      }
    });
  }

  unpackArray(): Array<number> {
    const idstr = localStorage.getItem(this.channelName + '-solvedEmotesIds');
    if(idstr) {
      return idstr.split(',').map((str) => parseInt(str));
    }
    return new Array<number>;
  }

  getRandomId(): number {
    if(this.availableEmotesIds == null || this.availableEmotesIds.length === 0) {
      console.log("array empty");
      return 0;
    } else {
      const n: number = Math.floor(Math.random() * this.availableEmotesIds.length);
      return this.availableEmotesIds[n];
    }
  }

  refreshEmote() {
    if(this.emoteUrlIdArray) {
      this.emoteUrlId = this.emoteUrlIdArray[0][this.emoteNumber].id;
      this.emoteName = this.emoteUrlIdArray[0][this.emoteNumber].name;
    }
    this.emoteUrl = 'https://cdn.7tv.app/emote/' + this.emoteUrlId + '/4x.webp'
  }

  guessEmote() {
    if(this.guessForm.valid) {
      const guess: string = this.guessForm.value['guess'];
      var similarity: number = 0;
      if(guess && this.emoteName){
        similarity = Math.floor(compareTwoStrings(this.emoteName.toLocaleLowerCase(), guess.toLocaleLowerCase()) * 100);
        console.log(similarity);
        this.score = similarity;
        if(similarity == 100){
          this.win();
        } else {
          this.lose();
        }
      }
    }
  }

  win() {
    this.emoteStyle = 'emote-loaded win';
    var sEI: string | null = localStorage.getItem(this.channelName + '-solvedEmotesIds');
    if(sEI)
      localStorage.setItem(this.channelName + '-solvedEmotesIds', sEI + ',' + this.emoteNumber);
    else
      localStorage.setItem(this.channelName + '-solvedEmotesIds', '' + this.emoteNumber);
    if(this.solvedEmotesIds && this.allEmotesIds) {
      this.solvedPercent = Math.floor(((this.solvedEmotesIds.length + 1) / this.allEmotesIds.length) * 100);
      this.solved = (this.solvedEmotesIds.length + 1) + '/' + this.allEmotesIds.length;
    }
  }

  lose() {
    if(this.level < 7)
      this.skip();
    if(this.level == 7)
      console.log(this.emoteName);
    var heart = this.hearts.pop();
    if(heart)
      this.heartbreaks.push(heart);

  }

  skip() {
    if(this.level < 5){
      this.emoteStyle = 'emote-loaded blur-' + this.level;
    } else {
      this.emoteStyle = 'emote-loaded';
    }
    this.level += 1;
  }

  next() {
    this.emoteUrlId = null;
    this.emoteUrl = './loading_78x78.webp';
    this.level = 1;
    this.score = -1;
    this.emoteStyle = 'emote-loaded blur-0';
    this.emoteNumber = this.getRandomId();
    this.refreshEmote();
    this.hearts = [1,1,1,1,1,1];
    this.heartbreaks = [];
  }
}
