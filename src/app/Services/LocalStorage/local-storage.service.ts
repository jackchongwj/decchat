import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

class InMemoryStorage implements Storage {
  private storage = new Map<string, string>();

  get length(): number {
    return this.storage.size;
  }
  clear(): void {
    this.storage.clear();
  }
  getItem(key: string): string | null {
    return this.storage.get(key) ?? null;
  }
  key(index: number): string | null {
    const keys = Array.from(this.storage.keys());
    return keys[index] ?? null;
  }
  removeItem(key: string): void {
    this.storage.delete(key);
  }
  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }
  [name: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  private storage: Storage;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.storage = isPlatformBrowser(platformId) ? localStorage : new InMemoryStorage();
  }

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
    this.storage.removeItem(key);
  }
  setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
  }
  [name: string]: any;

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
