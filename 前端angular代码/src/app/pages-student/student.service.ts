import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private serverUrl = 'http://localhost:5000';
  constructor(private http: HttpClient, private router: Router) { }

  getAvatarUrl(fileName) {
    return `${this.serverUrl}/static/images/${fileName}`;
  }
  getUser(param): Observable<any> {
    return this.http.post(`${this.serverUrl}/getUser`, param);
  }
  addActivity(param): Observable<any> {
    return this.http.post(`${this.serverUrl}/addActivity`, param);
  }
  getActivity(userId: string): Observable<any>{
    return this.http.get(`${this.serverUrl}/getActivity/${userId}`)
  }
  addUpgrade(param): Observable<any> {
    return this.http.post(`${this.serverUrl}/addUpgrade`, param);
  }
  getUpgrade(userId: string): Observable<any>{
    return this.http.get(`${this.serverUrl}/getUpgrade/${userId}`)
  }
  getAllInform(): Observable<any> {
    return this.http.get(`${this.serverUrl}/getAllInform`);
  }
  getStudentScore(param: any): Observable<any>{
    return this.http.post(`${this.serverUrl}/getStudentScore`, param);
  }
  setPassword(param: any): Observable<any>{
    return this.http.post(`${this.serverUrl}/setPassword`, param);
  }

}
