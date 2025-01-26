import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AcademicYearService } from './academic-year.service';
import { IAcademicYear } from './academic-year.model';
import { HttpClientModule } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, HttpClientModule, CommonModule],
  providers: [AcademicYearService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  academicYears: any[] = [];
  isLoadingAcademicYears: boolean = false;
  errors: string[] = [];

  constructor(private academicYearService: AcademicYearService) {
  }

  ngOnInit(): void {
    this.getAcademicYears();
  }

  getAcademicYears(): void {
    this.isLoadingAcademicYears = true;
    this.errors = [];
    this.academicYearService.getAcademicYears()
      .pipe(finalize(() => this.isLoadingAcademicYears = false))
      .subscribe({
        next: (academicYears: IAcademicYear[]) => this.academicYears = academicYears,
        error: (err: any) => {
          this.errors = [err.message];
        },
        complete: () => console.info('Finalizó la carga de años académicos')
      });
  }
}
