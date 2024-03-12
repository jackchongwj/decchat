import {Injectable} from '@angular/core';
import {AppComponent} from '../../app.component';

class LocalStorage implements Storage {
  [name: string]: any;
  readonly length!: number;
  clear(): void {}
  getItem(key: string): string | null {return null;}
  key(index: number): string | null {return null;}
  removeItem(key: string): void {}
  setItem(key: string, value: string): void {}
}


@Injectable({
  providedIn: 'root'
})
export class LocalstorageService implements Storage {

  private storage: Storage;

  constructor() {
    this.storage = new LocalStorage();

    AppComponent.isBrowser.subscribe(isBrowser => {
      if (isBrowser) {
        this.storage = localStorage;
      }
    });
  }

  [name: string]: any;

  get length(): number {
    return this.storage.length;
}

  clear(): void {
    this.storage.clear();
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  removeItem(key: string): void {
    return this.storage.removeItem(key);
  }

  setItem(key: string, value: string): void {
    return this.storage.setItem(key, value);
  }

  getUserId():number{
    const token = this.storage.getItem("accessToken");
    if (token === null) {
      return 0; 
    }
    
    const parts = token.split('.');
    const payload = parts[1];
    try 
    {
      // Decode the base64-encoded payload
      const decodedPayload = JSON.parse(atob(payload));
      return Number(decodedPayload.UserId);
    } 
    catch (error) {
      console.error('Error decoding payload:', error);
      return 0;
    }
  }
}