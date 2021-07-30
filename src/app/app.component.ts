import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <input type="file" (change)="uploadFile($event)" />
    <div *ngIf="uploadPercent">
      <progress id="file" value="{{ uploadPercent | async }}" max="100"> {{ uploadPercent | async }} </progress>&nbsp;{{ uploadPercent | async }}%
    </div>
    <a [href]="downloadURL | async">{{ downloadURL | async }}</a>
 `
})
export class AppComponent {
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  constructor(private storage: AngularFireStorage) {}
  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = '/test/'+file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(

        finalize(() => this.downloadURL = fileRef.getDownloadURL() )
     )
    .subscribe()
  }


  copyToClipboard()
  {
    const el = document.createElement('textarea');
    el.value= "testdata";
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

  }


}


