import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Song } from 'src/app/model';
import { SongService } from 'src/app/service';
import { GenreService } from 'src/app/service/genre/genre.service';

@Component({
  selector: 'app-own-songs',
  templateUrl: './own-songs.component.html',
  styleUrls: ['./own-songs.component.css', './own-songs.component.scss']
})
export class OwnSongsComponent implements OnInit {
  sortOptions: SelectItem[] = [];

  sortOrder: number = 0;

  sortField: string = 'songName';

  songs: Song[] = [];
  genres: Map<number, string> = new Map<number, string>();

  constructor(
    private router: Router,
    private songService: SongService,
    private genreService: GenreService
  ) {
    this.sortOptions = [
      { label: 'Sort by name', value: 'songName' },
      { label: 'Sort by author', value: 'author' },
      { label: 'Sort by genre', value: 'genreId' }
    ];
  }
  ngOnInit(): void {
    this.songs = this.songService.getCurrentOwnSongs();
    this.songService.getOwnSongsObservable().subscribe(songs => this.songs = songs);
    this.songService.refreshOwnSongs();

    this.genres = this.genreService.getCurrentGenres();
    this.genreService.getGenresObservable().subscribe(genres => this.genres = genres);
    if (this.genres.size === 0)
      this.genreService.refreshGenres();
  }

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
}
