import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, map, finalize, Subject, combineLatest, distinctUntilChanged, shareReplay, takeUntil } from "rxjs";
import { IAcademicYear } from "./academic-year.model";
import { AcademicYearService } from "./academic-year.service";
import { IModelState } from "./academic-year.state";

@Injectable({ providedIn: 'root' })
export class AcademicYearStore implements OnDestroy {
  private initialState: IModelState<IAcademicYear[]> = {
    items: [] as IAcademicYear[],
    isLoading: false,
    hasLoadedAtLeastOnce: false,
    errorMessage: null as string | null,
    searchFilter: ''
  };

  private destroySubscriptions$ = new Subject<void>();

  // BehaviorSubject mantiene el último valor
  private stateSubject = new BehaviorSubject(this.initialState);

  readonly academicYears$ = this.stateSubject.pipe(
    map(state => ({
      items: state.items,
      isLoading: state.isLoading,
      hasData: !state.isLoading && state.hasLoadedAtLeastOnce && state.items.length > 0 && !state.errorMessage,
      isEmpty: !state.isLoading && state.hasLoadedAtLeastOnce && state.items.length === 0 && !state.errorMessage,
      errorMessage: state.errorMessage
    })),
    // Evita actualizaciones innecesarias si los valores no cambiaron
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    // Comparte el último valor emitido entre todas las suscripciones
    shareReplay(1)
  );

  constructor(private academicYearService: AcademicYearService) { }

  loadAcademicYears(): void {
    this.updateState({
      isLoading: true,
      errorMessage: null,
      hasLoadedAtLeastOnce: true
    });

    this.academicYearService.getAcademicYears()
      .pipe(
        takeUntil(this.destroySubscriptions$),
        finalize(() => this.updateState({ isLoading: false }))
      )
      .subscribe({
        next: (items) => this.updateState({ items }),
        error: (error) => this.updateState({ errorMessage: error.message, items: [] })
      });
  }

  createItem(newItem: IAcademicYear): void {
    this.updateState({ isLoading: true, errorMessage: null });

    this.academicYearService.createACademicYear(newItem)
      .pipe(
        takeUntil(this.destroySubscriptions$),
        finalize(() => this.updateState({ isLoading: false }))
      )
      .subscribe({
        next: (createdItem) => {
          const updatedItems = [...this.stateSubject.getValue().items, createdItem];
          this.updateState({ items: updatedItems });
        },
        error: (error) => this.updateState({ errorMessage: error.message })
      });
  }

  cancelCurrentRequest(): void {
    this.updateState({ isLoading: false, errorMessage: null, hasLoadedAtLeastOnce: false });
    this.destroySubscriptions$.next();
  }

  private updateState(newState: Partial<typeof this.initialState>) {
    this.initialState = { ...this.initialState, ...newState };
    this.stateSubject.next(this.initialState);
  }

  ngOnDestroy(): void {
    this.destroySubscriptions$.next();
    this.destroySubscriptions$.complete();
  }
}
