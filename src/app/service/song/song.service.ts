import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Song } from 'src/app/model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private ownSongsSubject: BehaviorSubject<Song[]>;
  private allSongsSubject: BehaviorSubject<Song[]>;
  private isSubmittingSubject: BehaviorSubject<boolean>;

  constructor(
    private accountService: AccountService,
    private http: HttpClient
  ) {
    this.ownSongsSubject = new BehaviorSubject<Song[]>([]);
    this.allSongsSubject = new BehaviorSubject<Song[]>([]);
    this.isSubmittingSubject = new BehaviorSubject<boolean>(false);

    accountService.getObservableAccount().subscribe(_ => {
      this.ownSongsSubject.next([]);
      this.allSongsSubject.next([]);
    });
  }

  isSubmitting(): boolean {
    return this.isSubmittingSubject.getValue();
  }

  isSubmittingObservable(): Observable<boolean> {
    return this.isSubmittingSubject.asObservable();
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
      .subscribe(songs =>
        this.ownSongsSubject.next(songs)
      );
  }

  addSong(name: string, author: string, song: File): Observable<string> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('author', author);
    formData.append('song', song);

    this.isSubmittingSubject.next(true);

    return this.http.post<any>(environment.songAdderUrl, formData).pipe(
      map(response => response.genre),
      tap(_ => this.isSubmittingSubject.next(false))
    );
  }

  editSong(songId: number, name: string, author: string, genreId: number): Observable<any> {
    return this.http.post(`${environment.allSongsUrl}/${songId}/edit`, {
      song_name: name,
      author: author,
      genre_id: genreId
    });
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

  deleteSong(song: Song): Observable<any> {
    return this.http.delete(`${environment.allSongsUrl}/${song.songId}`);
  }
}
