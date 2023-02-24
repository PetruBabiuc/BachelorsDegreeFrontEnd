import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Song } from 'src/app/model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private ownSongsSubject: BehaviorSubject<Song[]>;
  private allSongsSubject: BehaviorSubject<Song[]>;

  constructor(
    private accountService: AccountService,
    private http: HttpClient
  ) {
    this.ownSongsSubject = new BehaviorSubject<Song[]>([]);
    this.allSongsSubject = new BehaviorSubject<Song[]>([]);

    accountService.getObservableAccount().subscribe(_ => {
      this.ownSongsSubject.next([]);
      this.allSongsSubject.next([]);
    });
  }

  getCurrentOwnSongs(): Song[] {
    return this.ownSongsSubject.getValue();
  }

  getOwnSongsObservable(): Observable<Song[]> {
    return this.ownSongsSubject.asObservable();
  }

  refreshOwnSongs(): void {
    const account = this.accountService.getCurrentAccount();

    if (account === null)
      throw new Error('The refreshOwnSongs method has been called while not logged in...');
    this.http.get<any[]>(`${environment.databaseRootUrl}/users/${account.userId}/songs`)
      .pipe(
        map(songs => songs.map(song => this.mapResponseToSong(song)))
      )
      .subscribe(songs => this.ownSongsSubject.next(songs));
  }

  private mapResponseToSong(song: any): Song {
    return {
      songId: song.song_id,
      userId: song.user_id,
      genreId: song.genre_id,
      songName: song.song_name,
      author: song.song_info.author,
      originalFormatId: song.song_info.original_format_id
    };
  }
}
