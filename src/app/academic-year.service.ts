import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAcademicYear } from './academic-year.model';

@Injectable()
export class AcademicYearService {
  readonly API_URL = 'https://localhost:7074/api/AcademicYear';
  constructor(private httpClient: HttpClient) { }

  getAcademicYears(): Observable<IAcademicYear[]> {
    return this.httpClient.get<IAcademicYear[]>(this.API_URL);
  }
}
