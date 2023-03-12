import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { CrawlerState, GenreIdToSongsCount } from 'src/app/model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class CrawlerService {
  private crawlerStateSubject: BehaviorSubject<CrawlerState | null>;
  private updateAvailableSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private accountService: AccountService
  ) {
    this.updateAvailableSubject = new BehaviorSubject<boolean>(true);
    this.crawlerStateSubject = new BehaviorSubject<CrawlerState | null>(null);
    this.accountService.getObservableAccount().subscribe(_ =>
      this.crawlerStateSubject.next(null)
    );
  }

  isUpdateAvailable(): boolean {
    return this.updateAvailableSubject.getValue();
  }

  isUpdateAvailableObservable(): Observable<boolean> {
    return this.updateAvailableSubject.asObservable();
  }

  getCurrentCrawlerState(): CrawlerState | null {
    return this.crawlerStateSubject.getValue();
  }

  getCrawlerStateObservable(): Observable<CrawlerState | null> {
    return this.crawlerStateSubject.asObservable();
  }

  refreshCrawlerState(): Observable<CrawlerState | null> {
    this.updateAvailableSubject.next(false);
    setTimeout(() => this.updateAvailableSubject.next(true), 5_000);
    return this.http.get<any>(environment.crawlerStateUrl).pipe(
      map(
        state => {
          state = this.mapCrawlerState(state);
          this.crawlerStateSubject.next(state);
          return state;
        }
      ),
      catchError(
        error => {
          if (error.status === 404) {
            this.crawlerStateSubject.next(null);
            return of(null);
          }
          else
            throw error;
        })
    )
  }

  startCrawling(desiredGenreId: number, maxCrawledResources: number,
    maxComputedGenres: number, domain: string | null): Observable<Message> {
    const body: any = {
      desired_genre_id: desiredGenreId,
      max_crawled_resources: maxCrawledResources,
      max_computed_genres: maxComputedGenres
    };

    if (domain !== null)
      body.domain = domain;

    return this.http.post(environment.startCrawlingUrl, body, { observe: 'response', responseType: 'blob' }).pipe(
      map(response => {
        const contentTye = response.headers.get('Content-Type');
        if (contentTye === 'application/json') {
          return {
            severity: 'warn',
            summary: 'Crawling finished!',
            detail: 'No song having the desired genre was found..'
          };
          // console.log(`Start crawling JSON response: ${JSON.stringify(response)}`);
        } else if (contentTye === 'audio/*') {
          if (response.body === null)
            throw Error(`Error: the Content-Type was ${contentTye} the response body was NULL.`);
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(new Blob([response.body], { type: response.body.type }));
          downloadLink.download = 'Song.mp3';
          downloadLink.click();
          return {
            severity: 'success',
            summary: 'Crawling finished!',
            detail: 'The song was downloaded.'
          };
        }
        throw Error(`Response with unexpected Content-Type: ${contentTye}`);
      })
    );
  }

  private mapCrawlerState(state: any): CrawlerState {
    let genreIdToSongsCount: GenreIdToSongsCount[] = [];
    for (let e of state.genre_id_to_songs_count)
      genreIdToSongsCount = [...genreIdToSongsCount, {
        genreId: parseInt(e.genre_id),
        songsCount: e.count
      }];

    const result: CrawlerState = {
      isStarted: state.is_started,
      domain: state.domain,
      resourcesUrlsCount: state.resources_urls_count,
      genreIdToSongsCount: genreIdToSongsCount
    };

    return result;
  }
}