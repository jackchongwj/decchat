import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development'; 

@Injectable({
  providedIn: 'root'
})
export class ChatlistService {

  private url: string = environment.apiBaseUrl+ 'Users/'

  constructor(private http: HttpClient) {}

  getChatListByUserId(userID: number): Observable<any> {
    return this.http.get(`${this.url}getChatListByUserId`,{params:{userId : userID}});
  }

  createNewGroup(roomName: string, selectedUserIds: number[]): Observable<any> {
    const createGroup = {
      roomName,
      selectedUserIds
    };

    // Adjust the URL and pass the createGroup object as the request body
    return this.http.post(`${this.url}createGroup`, createGroup);
  }
}

//   createNewGroup((roomName: string, selectedUserIds: number[]): Observable<any> {
//     const createGroup = {
//       roomName,
//       selectedUserIds
//     };

//     // return this.http.post<any>(this.url, createGroupRequest);
//     return this.http.post(`${this.url}createGroup`, createGroup);

//     // const payload = { roomName: groupName }; // Assume your backend expects 'roomName'
//     // return this.http.post(`${this.url}/createGroup`, payload);
//   }
// }

  

