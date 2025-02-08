import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IAcademicYear } from './academic-year.model';

@Injectable({providedIn: 'root'})
export class AcademicYearService {
  readonly API_URL = 'https://localhost:7074/api/AcademicYear';

  constructor(private httpClient: HttpClient) { }

  getAcademicYears(): Observable<IAcademicYear[]> {
    return this.httpClient.get<IAcademicYear[]>(this.API_URL);
  }

  createACademicYear(request: IAcademicYear): Observable<IAcademicYear> {
    return this.httpClient.post<IAcademicYear>(this.API_URL, request);
  }
}
