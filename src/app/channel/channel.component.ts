import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.css'
})
export class Channel implements OnInit {

  channelName: string | null = null;
  channelId: string | null = null;

  isStreaming: Boolean = false;
  isFollowAvailable: Boolean = false;
  isABCAvailable: Boolean = false;

  infoList: Array<string> | null = ["Odgadnij emotke 7tv po zablurowanym obrazku",
                                    "Odgadnij emotke 7tv po miejscu i liczbie użyć w top 100 używanych emotek na kanale",
                                    "Niedostępne :/ | Odgadnij osobę z czatu po wysłanych wiadomościach",
                                    "Odgadnij widza po miejscu i liczbie wiadomości w top 100",
                                    "Niedostępne :/ | Odgadnij widza (z followem) po czasie oglądania i followa",
                                    "Niedostępne :/ | Przypomnij sobie po jednym widzu na każdą litere"
                                   ];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.channelName = localStorage.getItem('channelName');
    this.channelId = localStorage.getItem('channelId');

    this.http.get('https://api.streamelements.com/kappa/v2/chatstats/' + this.channelName + '/stats', { observe: 'response' }).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.status == '200') {
          console.log("Channel found");
          this.isStreaming = true;
        } else {
          console.log("Channel not found");
        }
      },
      error: err => {
        console.log("Channel not found");
      }
    });
  }
}
