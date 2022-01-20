import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

import { IStreamState } from './../interfaces';

const INIT_STATE: IStreamState = {
  playing: false,
  readableCurrentTime: '',
  readableDuration: '',
  duration: null,
  currentTime: null,
  canplay: false,
  error: false
};

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private _stop$ = new Subject();
  private _audio = new Audio();
  private _state = INIT_STATE;
  private _stateChange$ = new BehaviorSubject(INIT_STATE);
  private _audioEvents = [
    'ended',
    'error',
    'play',
    'playing',
    'pause',
    'timeupdate',
    'canplay',
    'loadedmetadata',
    'loadstart'
  ];

  playStream(url: string) {
    return this._streamObservable(url).pipe(takeUntil(this._stop$));
  }

  play(): void {
    this._audio.play();
  }

  pause(): void {
    this._audio.pause();
  }

  stop(): void {
    this._stop$.next();
  }

  seekTo(seconds: number): void {
    this._audio.currentTime = seconds;
  }

  formatTime(time: number, format: string = 'HH:mm:ss'): string {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  getState(): Observable<IStreamState> {
    return this._stateChange$.asObservable();
  }

  private _streamObservable(url: string): Observable<Event> {
    return new Observable((observer) => {
      this._audio.src = url;
      this._audio.load();
      this._audio.play();

      const handler = (event: Event) => {
        this._updateStateEvents(event);
        observer.next(event);
      };

      this._addEvents(this._audio, this._audioEvents, handler);

      return () => {
        this._audio.pause();
        this._audio.currentTime = 0;
        this._removeEvents(this._audio, this._audioEvents, handler);
        this._resetState();
      };
    });
  }

  private _addEvents(
    obj: HTMLAudioElement,
    events: string[],
    handler: EventListener
  ): void {
    events.forEach((event) => {
      obj.addEventListener(event, handler);
    });
  }

  private _removeEvents(
    obj: HTMLAudioElement,
    events: string[],
    handler: EventListener
  ): void {
    events.forEach((event) => {
      obj.removeEventListener(event, handler);
    });
  }

  private _updateStateEvents(event: Event): void {
    switch (event.type) {
      case 'canplay':
        this._state.duration = this._audio.duration;
        this._state.readableDuration = this.formatTime(this._state.duration);
        this._state.canplay = true;
        break;
      case 'playing':
        this._state.playing = true;
        break;
      case 'pause':
        this._state.playing = false;
        break;
      case 'timeupdate':
        this._state.currentTime = this._audio.currentTime;
        this._state.readableCurrentTime = this.formatTime(
          this._state.currentTime
        );
        break;
      case 'error':
        this._resetState();
        this._state.error = true;
        break;
    }

    this._stateChange$.next(this._state);
  }

  private _resetState(): void {
    this._state = INIT_STATE;
  }
}
