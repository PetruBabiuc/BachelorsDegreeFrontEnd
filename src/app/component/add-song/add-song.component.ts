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
  @Input() name: string = '';
  @Input() author: string = '';
  @ViewChild(FileUpload) songUpload!: FileUpload; 

  songForm = this.fb.group({
    name: [this.name, Validators.required],
    author: [this.author, Validators.required],
  });

  constructor(
    private songService: SongService,
    private router: Router,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {

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
    this.songService.addSong(this.name, this.author, this.songUpload.files[0]).subscribe(
      genre => {
        alert(`The song ${this.name} has the genre ${genre}!`);
        this.songService.refreshOwnSongs();
        this.router.navigateByUrl('/own-songs');
      }
    );
  }
}
