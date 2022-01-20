import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

import { Subscription } from 'rxjs';

import { IAudioDialogData, IStreamState } from './../../interfaces';
import { AudioService } from './../../services';

@Component({
  templateUrl: './audio-player.dialog.html',
  styleUrls: ['./audio-player.dialog.scss']
})
export class AudioPlayerDialog implements OnInit, OnDestroy {
  private _subscription = new Subscription();
  state: IStreamState;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IAudioDialogData,
    private _dialogRef: MatDialogRef<AudioPlayerDialog>,
    private _audioService: AudioService
  ) {}

  ngOnInit(): void {
    this._subscribePlayStream(this.data.url);
    this._subscribeAudioState();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  onSliderChangeEnd(change: MatSliderChange): void {
    this._audioService.seekTo(change.value);
  }

  play(): void {
    this._audioService.play();
  }

  pause(): void {
    this._audioService.pause();
  }

  close(): void {
    this._dialogRef.close({ foo: '123' });
  }

  private _subscribePlayStream(url: string): void {
    const subscription = this._audioService.playStream(url).subscribe();

    this._subscription.add(subscription);
  }

  private _subscribeAudioState(): void {
    const subscription = this._audioService.getState().subscribe((state) => {
      this.state = state;
    });

    this._subscription.add(subscription);
  }
}
