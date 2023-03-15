import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { CrawlerState, Genre, PaidService } from 'src/app/model';
import { AccountService, PaidServiceService } from 'src/app/service';
import { CrawlerService } from 'src/app/service/crawler/crawler.service';
import { GenreService } from 'src/app/service/genre/genre.service';

@Component({
  selector: 'app-start-crawling',
  templateUrl: './start-crawling.component.html',
  styleUrls: ['./start-crawling.component.css']
})
export class StartCrawlingComponent implements AfterViewInit, OnInit {
  genres: Genre[] = [];
  crawlerState: CrawlerState | null = null;
  services: PaidService[];

  isStarted: boolean = false;
  forceCrawlNewDomain: boolean = true;
  maxPrice: string = 'Not yet computed...';

  // Tooltips
  crawlNewDomainTooltip: string = '';
  onlyDeliverSongsTooltip: string = '';

  isActive: boolean;

  crawlingRequestForm = this.fb.group({
    domain: ['https://cdn.freesound.org/mtg-jamendo/raw_30s/audio/00/1002000.mp3', this.domainConditionalValidator()],
    maxComputedGenres: [3, Validators.compose([Validators.required, Validators.min(1), Validators.max(10)])],
    maxCrawledResources: [15, Validators.compose([Validators.required, Validators.min(1), Validators.max(100)])],
    desiredGenreId: [1, Validators.required],
    crawlNewDomain: [true]
  });

  constructor(
    private genreService: GenreService,
    private crawlerService: CrawlerService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private paidServiceService: PaidServiceService,
    private messageService: MessageService,
    private accountService: AccountService,
  ) {
    this.crawlerState = this.crawlerService.getCurrentCrawlerState();
    this.updateAvailableGenres();
    this.services = this.paidServiceService.getServices();

    this.isActive = this.accountService.getCurrentAccount()?.isActive || false;
    this.accountService.getObservableAccount().subscribe(account =>
      this.isActive = account?.isActive || false
    );
  }

  ngOnInit(): void {
    this.handleCrawlerStateChange(this.crawlerState);
    this.crawlerService.getCrawlerStateObservable()
      .subscribe(state => {
        this.handleCrawlerStateChange(state);
        this.updateAvailableGenres();
      });
    this.crawlerService.refreshCrawlerState().subscribe();

    this.genreService.getGenresObservable()
      .subscribe(_ => this.updateAvailableGenres());
    if (this.genres.length === 0)
      this.genreService.refreshGenres();

    this.paidServiceService.getServicesObservable().subscribe(services => {
      this.services = services;
      this.updateMaxPrice();
    });
    if (this.services.length === 0)
      this.paidServiceService.refreshServices();
  }

  updateMaxPrice(): void {
    const maxComputedGenres = this.crawlingRequestForm.controls.maxComputedGenres.value || 0;
    const maxCrawledResources = this.crawlingRequestForm.controls.maxCrawledResources.value || 0;

    const genreComputationPrice = this.getServiceByName('genre_computation')?.price || 0;
    const crawledResourcePrice = this.getServiceByName('crawled_resource')?.price || 0;

    const maxPrice = maxComputedGenres * genreComputationPrice + maxCrawledResources * crawledResourcePrice;
    this.maxPrice = `Max price: ${maxPrice}`;
  }

  private getServiceByName(name: string): PaidService | null {
    return this.services.find(s => s.serviceName === name) || null;
  }

  onCrawlNewDomainChange(): void {
    this.updateAvailableGenres();
    if (this.crawlingRequestForm.controls.crawlNewDomain.value)
      this.crawlingRequestForm.controls.domain.enable();
    else
      this.crawlingRequestForm.controls.domain.disable();
  }

  private updateAvailableGenres(): void {
    this.genres = this.genreMapToArray(this.genreService.getCurrentGenres());
    const controls = [
      this.crawlingRequestForm.controls.maxComputedGenres,
      this.crawlingRequestForm.controls.maxCrawledResources
    ];


    // If the user wants to continue crawling a domain that has no resources URLs in the queue
    // and no songs with the genre not yet computed,
    // the desired genres are restricted to the genres of the songs already found
    if (!this.crawlingRequestForm.controls.crawlNewDomain.value && // Not wanting to crawl a new domain 
      this.crawlerState!.resourcesUrlsCount === 0 && // No more resources URLs in queue
      this.crawlerState?.genreIdToSongsCount.find(pair => pair.genreId === 7) === undefined // No songs with the genre not computed yet
    ) {
      this.genres = this.genres.filter(g1 =>
        this.crawlerState?.genreIdToSongsCount.some(g2 =>
          g2.genreId === g1.genreId));
      controls.forEach(c => {
        c.disable();
        c.setValue(1);
      });
      this.crawlingRequestForm.controls.desiredGenreId.setValue(this.genres[0].genreId);
      this.onlyDeliverSongsTooltip = `There are no more resources to be crawled nor more songs with uncomputed genre. 
      You can only receive the songs that haven't been delivered to you yet.`;
    } else {
      controls.forEach(c => c.enable());
      this.onlyDeliverSongsTooltip = '';
    }
  }

  private handleCrawlerStateChange(state: CrawlerState | null): void {
    this.crawlerState = state;
    const crawlNewDomainControl = this.crawlingRequestForm.controls.crawlNewDomain;
    if (state === null) {
      // No domain crawled at all
      this.forceCrawlNewDomain = true;
      crawlNewDomainControl.setValue(true);
      this.isStarted = false;
      this.crawlNewDomainTooltip = 'No crawling session to continue';
      return;
    }
    this.forceCrawlNewDomain = state.resourcesUrlsCount === 0
      && state.genreIdToSongsCount?.length === 0;

    crawlNewDomainControl.setValue(this.forceCrawlNewDomain);
    this.isStarted = state.isStarted;
    this.onCrawlNewDomainChange();

    if (this.forceCrawlNewDomain)
      this.crawlNewDomainTooltip = 'The domain is completely crawled so you have start crawling another one';
    else
      this.crawlNewDomainTooltip = '';
  }

  private genreMapToArray(map: Map<number, string>): Genre[] {
    let genres: Genre[] = [];
    map.forEach((genreName, genreId) => {
      if (genreName !== 'Computing...')
        genres = [...genres, { genreId: genreId, genreName: genreName }];
    });
    return genres;
  }

  ngAfterViewInit(): void {
    this.updateFieldsValidity();
  }

  private updateFieldsValidity(): void {
    const controls = this.crawlingRequestForm.controls;
    Object.values(controls).forEach(c => {
      c.markAsTouched();
      c.markAsDirty();
      c.updateValueAndValidity();
    });

    this.crawlingRequestForm.markAsTouched();
    this.crawlingRequestForm.markAsDirty();
    this.crawlingRequestForm.updateValueAndValidity();

    this.cdRef.detectChanges();
  }

  domainConditionalValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.forceCrawlNewDomain || this.crawlingRequestForm.controls.crawlNewDomain.value) {
        const domainRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
        const domain = control.value;
        const validDomain = domainRegex.test(domain);
        return validDomain ? null : { invalidDomain: { value: domain } };
      }
      return null;
    };
  }

  private handleCrawlingResponse(message: Message): void {
    this.messageService.add(message);
    this.isStarted = false;
    this.crawlerService.refreshCrawlerState().subscribe();
  }

  onSubmit(): void {
    if (!this.crawlingRequestForm.valid)
      return;

    let domain: string | null = null;
    const formControls = this.crawlingRequestForm.controls;
    if (formControls.crawlNewDomain.value)
      domain = formControls.domain.value;

    this.messageService.add({
      severity: 'info',
      summary: 'Crawling started!'
    });

    let maxCrawledResources = formControls.maxCrawledResources.value!;
    let maxComputedGenres = formControls.maxComputedGenres.value!;

    this.crawlerService.startCrawling(formControls.desiredGenreId.value!,
      maxCrawledResources, maxComputedGenres, domain).subscribe(
        message => this.handleCrawlingResponse(message),
        error => this.handleCrawlingResponse({
          severity: 'error',
          summary: 'Crawling request error',
          detail: `An error occured: ${error.message}`
        })
      );
    this.isStarted = true;
  }
}
