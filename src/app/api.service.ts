import { Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Cases } from './cases';
import { Statistic } from './statistic';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = 'http://localhost:3000/api/cases';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getCases(): Observable<Cases[]> {
    return this.http.get<Cases[]>(`${apiUrl}`)
      .pipe(
        tap(cases => console.log('fetched cases')),
        map( 
          responseData => {
            const postsArray: Cases[] = [];
            for (const key in responseData) {
              if (responseData.hasOwnProperty(key)) {
                postsArray.push({ ...responseData[key], _id: key });
              }
            }
            return postsArray;
          }),
        catchError(this.handleError('getCases', []))
      );
  }

  getCasesById(id: string): Observable<Cases> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Cases>(url).pipe(
      tap(_ => console.log(`fetched cases id=${id}`)),
      catchError(this.handleError<Cases>(`getCasesById id=${id}`))
    );
  }

  addCases(cases: Cases): Observable<Cases> {
    return this.http.post<Cases>(apiUrl, cases, httpOptions).pipe(
      tap((c: Cases) => console.log(`added product w/ id=${c._id}`)),
      catchError(this.handleError<Cases>('addCases'))
    );
  }

  updateCases(id: string, cases: Cases): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url, cases, httpOptions).pipe(
      tap(_ => console.log(`updated cases id=${id}`)),
      catchError(this.handleError<any>('updateCases'))
    );
  }

  deleteCases(id: string): Observable<Cases> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Cases>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted cases id=${id}`)),
      catchError(this.handleError<Cases>('deleteCases'))
    );
  }

  getStatistic(status: string): Observable<Statistic> {
    //const url = `${apiUrl}/daily/${status}`;
    const filter = `{"where":{"status":"%${status}%"}}`;
     const url = 'http://localhost:3000/api/cases/';
     const params = new HttpParams().set('filter', filter);
    return this.http.get<Statistic>(url,{params}).pipe(
      tap(_ => console.log(`fetched statistic status=${status}`)),
      catchError(this.handleError<Statistic>(`getStatistic status=${status}`))
    );
  }

  /* to exchange data between two component */
  private _data: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public setData(data: any){
      this._data.next(data);
  }

  public getData(): Observable<any> {
      return this._data.asObservable();
  }
}
