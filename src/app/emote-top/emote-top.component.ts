import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

const FULLHEARTS: Array<number> = [1,1,1,1,1];
const MAXLIVES: number = 5;
const SECONDCLUELVL: number = 3;
const THIRDCLUELVL: number = 2;

const DISTANCEVC: number = 3;
const DISTANCEC: number = 8;
const DISTANCEF: number = 15;

function shuffle(array: Array<string>) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

function isEmoteAnimated(obj: EmoteTop, src: string) {
  var request = new XMLHttpRequest();
  request.open('GET', src, true);
  request.addEventListener('loadend', function () {
    if(request.response.indexOf("ANMF") != -1){
      obj.emoteAnimated =  'Tak';
    } else {
      obj.emoteAnimated = 'Nie';
    }
  });
  request.send();
}
function isGuessedEmoteAnimated(guessEntry: string[], src: string, answer: string|null) {
  var request = new XMLHttpRequest();
  request.open('GET', src, true);
  request.addEventListener('loadend', function () {
    if(request.response.indexOf("ANMF") != -1){
      guessEntry[4] =  'Tak';
    } else {
      guessEntry[4] = 'Nie';
    }
    if(guessEntry[4] == answer)
      guessEntry[9] = 'correct';
    else
      guessEntry[9] = 'incorrect';
  });
  request.send();
}

@Component({
  selector: 'app-emote-top',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './emote-top.component.html',
  styleUrl: './emote-top.component.css'
})
export class EmoteTop {

  guessForm: FormGroup;

  channelName: string | null = null;
  channelId: string | null = null;

  emoteFullList: Array<any> | null = null;
  emoteList: Array<string> | null = null;
  emoteShuffledList: Array<string> | null = null;
  emoteId: number | null = null;
  emoteUrl: string | null = null;
  emoteName: string | null = null;
  emoteCount: number | null = null;
  emoteAnimated: string | null = null;

  solvedEmotes: number = 0;

  maxlives: number = MAXLIVES;
  lives: number = MAXLIVES;
  status: string = "game";
  secondClue: Boolean = false;
  thirdClue: Boolean = false;

  hearts: Array<number> = FULLHEARTS;
  heartbreaks: Array<number> = [];

  guessList: string[][] = [];

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {
    this.guessForm = this.fb.group({
      guess: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.channelName = localStorage.getItem('channelName');
    this.channelId = localStorage.getItem('channelId');

    this.http.get('https://api.streamelements.com/kappa/v2/chatstats/' + this.channelName + '/stats', { observe: 'response' }).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.status == 200) {
          this.emoteFullList = response.body.sevenTVEmotes;
          if(this.emoteFullList) {
            this.emoteList = this.emoteFullList.map(s => s.emote);
            this.emoteShuffledList = this.emoteList.slice();
            shuffle(this.emoteShuffledList);

            this.emoteId = this.getRandomId();
            this.emoteUrl = 'https://cdn.7tv.app/emote/' + this.emoteFullList[this.emoteId].id + '/4x.webp';
            this.emoteName = this.emoteFullList[this.emoteId].emote;
            this.emoteCount = this.emoteFullList[this.emoteId].amount;
            isEmoteAnimated(this, this.emoteUrl);
          }
        }
      },
      error: err => {
      }
    });
  }

  @ViewChild('input', { static: false })
  set input(element: ElementRef<HTMLInputElement>) {
    if(element) {
      element.nativeElement.focus()
    }
  }
  ngAfterViewInit() {
    this.autofocus();
  }

  getRandomId(): number {
    if(this.emoteFullList == null || this.emoteFullList.length === 0) {
      console.log("array empty");
      return 0;
    } else {
      return Math.floor(Math.random() * this.emoteFullList.length);
    }
  }

  guessEmote() {
    if(this.guessForm.valid) {
      const guess: string = this.guessForm.value['guess'];
      if(guess && this.emoteName && this.emoteList && this.emoteFullList){
        if(guess === this.emoteName) {
          this.win();
          if(this.emoteId && this.emoteName && this.emoteCount && this.emoteUrl && this.emoteAnimated) {
            let geid = this.emoteId + 1;
            let guessEntry = [geid + '', this.emoteName, this.emoteCount + '', this.emoteUrl, this.emoteAnimated,
                              'correct', 'correct', 'correct', 'correct', 'correct'];
            this.guessList.push(guessEntry);
          }
        } else {
          let geid = this.emoteList.indexOf(guess);
          let geurl = '-';
          let gen = '-';
          let highlow = '-';
          let distance = -1;
          let distanceClue = '-';
          if(this.emoteId) distance = Math.abs(geid - this.emoteId);
          if(geid != -1) {
            geurl = 'https://cdn.7tv.app/emote/' + this.emoteFullList[geid].id + '/4x.webp';
            gen = this.emoteFullList[geid].amount;
          }
          if(distance <= DISTANCEVC) distanceClue = 'very-close';
          else if(distance <= DISTANCEC) distanceClue = 'close';
          else if(distance <= DISTANCEF) distanceClue = 'far';
          else distanceClue = 'very-far';
          geid += 1;
          if(this.emoteCount && parseInt(gen) > this.emoteCount) highlow = 'low'; else highlow = 'high';
          let guessEntry = [geid + '', guess, gen, geurl, '',
                            distanceClue, 'incorrect', highlow, 'incorrect', ''];
          isGuessedEmoteAnimated(guessEntry, geurl, this.emoteAnimated);
          this.guessList.push(guessEntry);
          this.loseLife();
        }
      }
    }
  }

  win() {
    if(this.emoteId != null) {
      this.emoteList?.splice(this.emoteId, 1);
      this.emoteFullList?.splice(this.emoteId, 1);
    }
    if(this.emoteList)
      this.solvedEmotes = 100 - this.emoteList.length;

    this.status = "win";
  }

  loseLife() {
    this.lives -= 1;
    if(this.lives <= 0) {
      this.lose();
    }
    if(this.lives <= SECONDCLUELVL) {
      this.secondClue = true;
    }
    if(this.lives <= THIRDCLUELVL) {
      this.thirdClue = true;
    }
    var heart = this.hearts.pop();
    if(heart)
      this.heartbreaks.push(heart);
  }

  lose() {
    this.status = "lose";
    this.autofocus();
  }

  next() {
    this.lives = MAXLIVES;
    this.status = "game";
    this.emoteId = this.getRandomId();
    if(this.emoteFullList) {
      this.emoteUrl = 'https://cdn.7tv.app/emote/' + this.emoteFullList[this.emoteId].id + '/4x.webp';
      this.emoteName = this.emoteFullList[this.emoteId].emote;
      this.emoteCount = this.emoteFullList[this.emoteId].amount;
      isEmoteAnimated(this, this.emoteUrl);
    }
    this.hearts = [1,1,1,1,1];
    this.heartbreaks = [];
    this.secondClue = this.thirdClue = false;
    this.guessList = [];
  }

  autofocus() {
    setTimeout(()=>{
    if(this.status != "game") {
      var nextButtonInput = document.getElementById('next-button-input');
      if(nextButtonInput)
        nextButtonInput.focus();
    } else {
      var guessInput = document.getElementById('guess');
      if(guessInput)
        guessInput.focus();
    }
    },0);
  }

}
