import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { SongService } from 'src/app/service';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.css']
})
export class AddSongComponent implements AfterViewInit {
  @ViewChild(FileUpload) songUpload!: FileUpload;

  isSubmitting: boolean;

  songForm = this.fb.group({
    name: ['', Validators.required],
    author: ['', Validators.required],
  });

  constructor(
    private songService: SongService,
    private router: Router,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
    this.isSubmitting = this.songService.isSubmitting();
    this.songService.isSubmittingObservable().subscribe(isSubmitting =>
      this.isSubmitting = isSubmitting
    );
  }

  ngAfterViewInit(): void {
    this.updateFieldsValidity();
  }

  isFormValid(): boolean {
    return this.songForm.valid && this.songUpload.hasFiles();
  }

  private updateFieldsValidity(): void {
    const controls = this.songForm.controls;
    Object.values(controls).forEach(c => {
      c.markAsTouched();
      c.markAsDirty();
      c.updateValueAndValidity();
    });

    this.songForm.markAsTouched();
    this.songForm.markAsDirty();
    this.songForm.updateValueAndValidity();

    this.cdRef.detectChanges();
  }

  onSubmit(): void {
    if (!this.isFormValid())
      return;

    const name = this.songForm.controls.name.value;
    const author = this.songForm.controls.author.value;

    this.songService.addSong(name!, author!, this.songUpload.files[0]).subscribe(
      genre => {
        alert(`The song ${name} has the genre ${genre}!\nCurrent route: ${this.router.url}`);
        this.isSubmitting = false;
        this.songService.refreshOwnSongs();
        this.router.navigateByUrl('/own-songs');
      }
    );
  }
}
