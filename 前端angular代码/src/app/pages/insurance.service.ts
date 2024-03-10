import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
@Injectable()
export class InsuranceService {
    private serverUrl = 'http://localhost:5000';
    constructor(private http: HttpClient, private router: Router) { }

    getAvatarUrl(fileName) {
        return `${this.serverUrl}/static/images/${fileName}`;
    }
  register(param): Observable<any> {
    return this.http.post(`${this.serverUrl}/register`, param);
  }

  getUser(param): Observable<any> {
        return this.http.post(`${this.serverUrl}/getUser`, param);
    }

  addInform(param): Observable<any> {
    return this.http.post(`${this.serverUrl}/addInform`, param);
  }

  getAllInform(): Observable<any> {
    return this.http.get(`${this.serverUrl}/getAllInform`);
  }

  getInform(param): Observable<any> {
    return this.http.post(`${this.serverUrl}/getInform`, param);
  }

  deleteInform(param): Observable<any> {
    return this.http.post(`${this.serverUrl}/deleteInform`, param);
  }

  addScore(param): Observable<any> {
    return this.http.post(`${this.serverUrl}/addScore`, param);
  }

  deleteScore(param): Observable<any> {
    return this.http.post(`${this.serverUrl}/deleteScore`, param);
  }

  getAllScore(): Observable<any> {
    return this.http.get(`${this.serverUrl}/getAllScore`);
  }

  getAllActivity(): Observable<any> {
    return this.http.get(`${this.serverUrl}/getAllActivity`);
  }

  changeActivityStatus(param: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/changeActivityStatus`, param);
  }

  addDemocracy(param): Observable<any> {
    return this.http.post(`${this.serverUrl}/addDemocracy`, param);
  }

  deleteDemocracy(param): Observable<any> {
    return this.http.post(`${this.serverUrl}/deleteDemocracy`, param);
  }

  getAllDemocracy(): Observable<any> {
    return this.http.get(`${this.serverUrl}/getAllDemocracy`);
  }
  setScholarship30(): Observable<any> {
    return this.http.get(`${this.serverUrl}/setScholarship30`);
  }
  setScholarship10(): Observable<any> {
    return this.http.get(`${this.serverUrl}/setScholarship10`);
  }
  getManagerScores(): Observable<any> {
    return this.http.get(`${this.serverUrl}/getManagerScores`);
  }
  getAllUpgrade(): Observable<any> {
    return this.http.get(`${this.serverUrl}/getAllUpgrade`);
  }
  getAllUser(): Observable<any> {
    return this.http.get(`${this.serverUrl}/getAllUser`);
  }
  changeUpgradeStatus(param: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/changeUpgradeStatus`, param);
  }
  deleteUsers(param: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/deleteUsers`, param);
  }
  setDescription(param: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/setDescription`, param);
  }
    getSalesPersons(param): Observable<any> {
        return this.http.post(`${this.serverUrl}/getSalesPersons`, param);
    }

    addSalesPerson(param): Observable<any> {
        return this.http.post(`${this.serverUrl}/addSalesPerson`, param);
    }

    deleteSalesPerson(param): Observable<any> {
        return this.http.post(`${this.serverUrl}/deleteSalesPerson`, param);
    }

    deleteProduct(param): Observable<any> {
        return this.http.post(`${this.serverUrl}/deleteProduct`, param);
    }

    deleteOrder(param): Observable<any> {
        return this.http.post(`${this.serverUrl}/deleteOrder`, param);
    }

    getOrders(param): Observable<any> {
        return this.http.post(`${this.serverUrl}/getOrders`, param);
    }

    getAreaStats(param): Observable<any> {
        return this.http.post(`${this.serverUrl}/getAreaStats`, param);
    }

    getStaffStats(param): Observable<any> {
        return this.http.post(`${this.serverUrl}/getStaffStats`, param);
    }

    addOrder(param): Observable<any> {
        return this.http.post(`${this.serverUrl}/addOrder`, param);
    }

    setUser(param): Observable<any> {
        return this.http.post(`${this.serverUrl}/setUser`, param);
    }

    addProduct(param): Observable<any> {
        return this.http.post(`${this.serverUrl}/addProduct`, param);
    }

    getProducts(): Observable<any> {
        return this.http.get(`${this.serverUrl}/getProducts`);
    }

    sell(param): Observable<any> {
        return this.http.post(`${this.serverUrl}/sell`, param);
    }

}
