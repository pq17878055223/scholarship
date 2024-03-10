import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
@Injectable()
export class AppService {
    private serverUrl = 'http://localhost:5000';
    constructor(private http: HttpClient, private router: Router) { }

    login(param): Observable<any> {
        return this.http.post(`${this.serverUrl}/login`, param);
    }

    register(param): Observable<any> {
        return this.http.post(`${this.serverUrl}/register`, param);
    }

}
