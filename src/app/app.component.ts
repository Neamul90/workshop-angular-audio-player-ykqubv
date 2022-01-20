import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AudioPlayerDialog } from './dialogs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private _dialog: MatDialog) {}

  openDialog() {
    this._dialog
      .open(AudioPlayerDialog, {
        width: '300px',
        data: {
          url:
            'https://ia801009.us.archive.org/8/items/EdSheeranPerfectOfficialMusicVideoListenVid.com/Ed_Sheeran_-_Perfect_Official_Music_Video%5BListenVid.com%5D.mp3'
        }
      })
      .afterClosed()
      .subscribe((result: any) => {
        console.log(`Dialog result: ${JSON.stringify(result)}`);
      });
  }
}
