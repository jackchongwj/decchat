import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

@Component({
  selector: 'app-attachment-button',
  templateUrl: './attachment-button.component.html',
  styleUrl: './attachment-button.component.css'
})
export class AttachmentButtonComponent {
  // transformFile = (file: NzUploadFile): Observable<Blob> =>
  //   new Observable((observer: Observer<Blob>) => {
  //     const reader = new FileReader();
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     reader.readAsDataURL(file as any);
  //     reader.onload = () => {
  //       const canvas = document.createElement('canvas');
  //       const img = document.createElement('img');
  //       img.src = reader.result as string;
  //       img.onload = () => {
  //         const ctx = canvas.getContext('2d')!;
  //         ctx.drawImage(img, 0, 0);
  //         ctx.fillStyle = 'red';
  //         ctx.textBaseline = 'middle';
  //         ctx.fillText('Ant Design', 20, 20);
  //         canvas.toBlob(blob => {
  //           observer.next(blob!);
  //           observer.complete();
  //         });
  //       };
  //     };
  //   });

  fileList: NzUploadFile[] =[];

  previewImage: string | undefined = '';
  previewVisible = false;

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };
}
