import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CrawlerState } from 'src/app/model';
import { CrawlerService } from 'src/app/service/crawler/crawler.service';
import { GenreService } from 'src/app/service/genre/genre.service';

@Component({
  selector: 'app-crawler-state',
  templateUrl: './crawler-state.component.html',
  styleUrls: ['./crawler-state.component.css']
})
export class CrawlerStateComponent implements OnInit {
  crawlerState: CrawlerState | null = null;
  genres: Map<number, string>;
  updateAvailable: boolean;
  alreadyFoundSongsData: any;
  anySongFound: boolean = false;

  constructor(
    private crawlerService: CrawlerService,
    private genreService: GenreService,
    private messageService: MessageService
  ) {
    this.genres = this.genreService.getCurrentGenres();
    this.updateAvailable = this.crawlerService.isUpdateAvailable();
  }

  onUpdateClick(): void {
    if (!this.updateAvailable)
      return;
    this.messageService.add({
      severity: 'info',
      summary: "Fetching crawler's state..."
    });
    this.crawlerService.refreshCrawlerState().subscribe(_ => this.messageService.add({
      severity: 'success',
      summary: "Crawler's state fetched!"
    }));
  }

  ngOnInit(): void {
    this.crawlerService.isUpdateAvailableObservable().subscribe(value => this.updateAvailable = value);

    this.genreService.getGenresObservable().subscribe(genres => this.genres = genres);
    if (this.genres.size === 0)
      this.genreService.refreshGenres();

    this.crawlerState = this.crawlerService.getCurrentCrawlerState();
    this.crawlerService.getCrawlerStateObservable().subscribe(crawlerState => {
      this.crawlerState = crawlerState;

      if (crawlerState !== null) {
        this.anySongFound = false;
        
        const data: number[] = [];
        for (let i = 1; i <= this.genres.size; ++i) {
          const pair = crawlerState.genreIdToSongsCount.find(pair => pair.genreId === i);
          if (pair !== undefined) {
            data.push(pair.songsCount);
            this.anySongFound = true;
          }
          else
            data.push(0);
        }

        this.alreadyFoundSongsData = {
          labels: [...this.genres.values()],
          datasets: [
            {
              data: data
            }
          ]
        };
      }
    });
    this.crawlerService.refreshCrawlerState().subscribe();
  }
}
