import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface Dick<T> {
  [key: string]: T;
}
const addEntry = (dict: Dick<string>,
                  key: string, value: string): void => {
                    dict[key] = value;
                  };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ttvdle';

  //lastChannels: Array<string> | null = null;
  //lastChannelsProfUrl: Dick<string> | null = null;

  constructor(private http: HttpClient) {}

  // ngOnInit() {
  //   const leftSide = document.querySelector(".leftSide");
  //
  //   this.lastChannels = this.unpackArray("lastChannels");
  //
  //   for(var channel in this.lastChannels) {
  //     this.http.get("https://api.streamelements.com/kappa/v2/channels/" + channel).subscribe({
  //       next: (response: any) => {
  //         var avatarUrl: string = response.avatar;
  //         if(this.lastChannelsProfUrl)
  //           addEntry(this.lastChannelsProfUrl, channel, avatarUrl);
  //       }
  //     });
  //     var div = document.createElement("div");
  //
  //   }
  //
  //   const p = document.createElement("p");
  //   p.append("TEST");
  //
  //   leftSide?.append(p);
  // }
  //
  // unpackArray(packedArrayKey: string): Array<string> {
  //   const packedArray = localStorage.getItem(packedArrayKey);
  //   if(packedArray) {
  //     return packedArray.split(',').map((str) => str);
  //   }
  //   return new Array<string>;
  // }

}
