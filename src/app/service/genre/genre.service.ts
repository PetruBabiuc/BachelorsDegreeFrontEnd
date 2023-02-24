import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Genre } from 'src/app/model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private genreSubject: BehaviorSubject<Map<number, string>>;
  constructor(
    private http: HttpClient
  ) {
    this.genreSubject = new BehaviorSubject<Map<number, string>>(new Map());
  }

  getCurrentGenres(): Map<number, string> {
    return this.genreSubject.getValue();
  }

  getGenresObservable(): Observable<Map<number, string>> {
    return this.genreSubject.asObservable();
  }

  refreshGenres(): void {
    this.http.get<Genre[]>(environment.genresUrl)
      .subscribe(genres => {
        genres = this.mapResponseToGenre(genres);
        this.genreSubject.next(this.generateMap(genres))});
  }

  private generateMap(genres: Genre[]): Map<number, string> {
    const map = new Map<number, string>();
    genres.forEach(genre => map.set(genre.genreId, genre.genreName));
    return map;
  }

  private mapResponseToGenre(response: any[]): Genre[] {
    return response.map(genre => ({
      genreId: genre.song_genre_id,
      genreName: genre.song_genre_name
    }));
  } 
}
