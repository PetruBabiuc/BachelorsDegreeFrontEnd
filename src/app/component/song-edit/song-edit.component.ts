import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Genre, Song } from 'src/app/model';
import { GenreService, SongService } from 'src/app/service';

@Component({
  selector: 'app-song-edit',
  templateUrl: './song-edit.component.html',
  styleUrls: ['./song-edit.component.css']
})
export class SongEditComponent implements AfterContentChecked {
  @Output('onEdited') onEdited = new EventEmitter<void>();
  @Input('song') set song(value: Song | null) {
    if (value === null)
      return;
    this.songForm.controls.name.setValue(value.songName);
    this.songForm.controls.author.setValue(value.author);
    this.songForm.controls.genreId.setValue(value.genreId);
    this.songId = value.songId;
  }

  genres: Genre[] = [];
  isSubmitting: boolean = false;

  songId: number = -1;
  songForm = this.fb.group({
    name: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
    author: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
    genreId: [1, Validators.required]
  });

  constructor(
    private songService: SongService,
    private messageService: MessageService,
    private genreService: GenreService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
    this.genres = this.genreMapToArray(this.genreService.getCurrentGenres());
    this.genreService.getGenresObservable().subscribe(
      genres => this.genres = this.genreMapToArray(genres)
    );
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  private genreMapToArray(map: Map<number, string>): Genre[] {
    let genres: Genre[] = [];
    map.forEach((genreName, genreId) => {
      if (genreName !== 'Computing...')
        genres = [...genres, { genreId: genreId, genreName: genreName }];
    });
    return genres;
  }

  onSubmit(): void {
    if (!this.songForm.valid)
      return;

    const name = this.songForm.controls.name.value!;
    const author = this.songForm.controls.author.value!;
    const genreId = this.songForm.controls.genreId.value!;

    this.messageService.add({
      severity: 'info',
      summary: 'Editing song...'
    });

    this.isSubmitting = true;

    this.songService.editSong(this.songId, name, author, genreId).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Song edited!',
        });
        this.isSubmitting = false;
        this.songService.refreshOwnSongs();
        this.onEdited.emit();
      },
      _ => {
        this.messageService.add({
          severity: 'error',
          summary: 'Song edit failed!',
        });
        this.isSubmitting = false;
        this.onEdited.emit();
      }
    );
  }
}
