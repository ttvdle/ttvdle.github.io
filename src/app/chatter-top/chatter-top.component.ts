import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

const FULLHEARTS: Array<number> = [1,1,1,1,1];
const MAXLIVES: number = 5;
const SECONDCLUELVL: number = 3;

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

@Component({
  selector: 'app-chatter-top',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './chatter-top.component.html',
  styleUrl: './chatter-top.component.css'
})
export class ChatterTop {

  guessForm: FormGroup;

  channelName: string | null = null;
  channelId: string | null = null;

  chatterFullList: Array<any> | null = null;
  chatterList: Array<string> | null = null;
  chatterShuffledList: Array<string> | null = null;
  chatterId: number | null = null;
  chatterName: string | null = null;
  chatterCount: number | null = null;

  solvedChatters: number = 0;

  lives: number = MAXLIVES;
  status: string = "game";
  secondClue: Boolean = false;

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
          this.chatterFullList = response.body.chatters;
          if(this.chatterFullList) {
            this.chatterList = this.chatterFullList.map(s => s.name);
            this.chatterShuffledList = this.chatterList.slice();
            shuffle(this.chatterShuffledList);

            this.chatterId = this.getRandomId();
            this.chatterName = this.chatterFullList[this.chatterId].name;
            this.chatterCount = this.chatterFullList[this.chatterId].amount;
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
    if(this.chatterFullList == null || this.chatterFullList.length === 0) {
      console.log("array empty");
      return 0;
    } else {
      return Math.floor(Math.random() * this.chatterFullList.length);
    }
  }

  guessChatter() {
    if(this.guessForm.valid) {
      const guess: string = this.guessForm.value['guess'];
       if(guess && this.chatterName && this.chatterList && this.chatterFullList){
         if(guess === this.chatterName) {
          this.win();
          if(this.chatterId && this.chatterName && this.chatterCount) {
            let geid = this.chatterId + 1;
            let guessEntry = [geid + '', this.chatterName, this.chatterCount + '',
                              'correct', 'correct', 'correct'];
            this.guessList.push(guessEntry);
          }
        } else {
          let geid = this.chatterList.indexOf(guess);
          let geurl = '-';
          let gen = '-';
          let highlow = '-';
          let distance = -1;
          let distanceClue = '-';
          if(this.chatterId) distance = Math.abs(geid - this.chatterId);
          if(geid != -1) gen = this.chatterFullList[geid].amount;

          if(distance <= DISTANCEVC) distanceClue = 'very-close';
          else if(distance <= DISTANCEC) distanceClue = 'close';
          else if(distance <= DISTANCEF) distanceClue = 'far';
          else distanceClue = 'very-far';
          geid += 1;
          if(this.chatterCount && parseInt(gen) > this.chatterCount) highlow = 'low'; else highlow = 'high';
          let guessEntry = [geid + '', guess, gen,
                            distanceClue, 'incorrect', highlow];
          this.guessList.push(guessEntry);
          this.loseLife();
        }
      }
    }
  }

  win() {
    if(this.chatterId != null) {
      this.chatterList?.splice(this.chatterId, 1);
      this.chatterFullList?.splice(this.chatterId, 1);
    }
    if(this.chatterList)
      this.solvedChatters = 100 - this.chatterList.length;

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
    this.chatterId = this.getRandomId();
    if(this.chatterFullList) {
      this.chatterName = this.chatterFullList[this.chatterId].name;
      this.chatterCount = this.chatterFullList[this.chatterId].amount;
    }
    this.hearts = [1,1,1,1,1];
    this.heartbreaks = [];
    this.secondClue = false;
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
