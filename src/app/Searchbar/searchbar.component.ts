import { Component, OnInit } from '@angular/core';
import { response } from 'express';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap} from 'rxjs/operators';
import { UserService } from '../Services/UserService/user.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent implements OnInit{
  isCollapsed = false;
  searchValue: string = '';
  private searchSubject: Subject<string> = new Subject<string>();
  searchResult: any[] = []; // array
  
  constructor(private userService: UserService){}

  ngOnInit(): void{
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap(searchValue => searchValue !== '' ? this.userService.getSearch(searchValue) : of([]))
    ).subscribe(response =>{
      this.userService = response;
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
