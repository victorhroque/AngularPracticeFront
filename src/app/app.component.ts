import { Component, OnInit } from '@angular/core';
import { AcademicYearStore } from './services/academic-year.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(public academicYearStore: AcademicYearStore) {
  }

  ngOnInit(): void {
    this.academicYearStore.loadAcademicYears();
  }

  reloadAcademicYears(): void {
    this.academicYearStore.loadAcademicYears();
  }

  cancelRequests(): void {
    this.academicYearStore.cancelCurrentRequest();
  }
}
