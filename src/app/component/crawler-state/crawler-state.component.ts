import { Component, OnInit } from '@angular/core';
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

  constructor(
    private crawlerService: CrawlerService,
    private genreService: GenreService
  ) {
    this.genres = this.genreService.getCurrentGenres();
    this.updateAvailable = this.crawlerService.isUpdateAvailable();
  }

  onUpdateClick(): void {
    if (!this.updateAvailable)
      return;
    this.crawlerService.refreshCrawlerState();
  }

  ngOnInit(): void {
    this.crawlerService.isUpdateAvailableObservable().subscribe(value => this.updateAvailable = value);
    
    this.genreService.getGenresObservable().subscribe(genres => this.genres = genres);
    if (this.genres.size === 0)
      this.genreService.refreshGenres();

    this.crawlerState = this.crawlerService.getCurrentCrawlerState();
    this.crawlerService.getCrawlerStateObservable().subscribe(crawlerState => {
      this.crawlerState = crawlerState;
    });
    this.crawlerService.refreshCrawlerState();
  }
}
