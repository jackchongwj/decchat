import { Component, OnInit } from '@angular/core';
import { response } from 'express';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap} from 'rxjs/operators';
import { GetUserService } from '../service/GetUser/get-user.service';

@Component({
  selector: 'app-developer',
  templateUrl: './developer.component.html',
  styleUrl: './developer.component.css'
})
export class DeveloperComponent implements OnInit{
  isCollapsed = false;
  searchValue: string = '';
  private searchSubject: Subject<string> = new Subject<string>();
  searchResult: any[] = []; // array
  
  constructor(private searchService: GetUserService){}

  ngOnInit(): void{
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap(searchValue => searchValue !== '' ? this.searchService.getSearch(searchValue) : of([]))
    ).subscribe(response =>{
      this.searchResult = response;
      console.log('Backend Search Result:', response);
    });
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.searchValue);
    // this.searchService.getSearch(this.searchValue)
    // .subscribe(
    //   response => {
    //     this.searchResult = response;
    //     console.log(this.searchResult.length);
    //     console.log('Backend Search Result:', response);
    // });
  }
}
