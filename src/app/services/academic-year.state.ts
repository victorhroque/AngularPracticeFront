export interface IModelState<T> {
  items: T;
  isLoading: boolean;
  hasLoadedAtLeastOnce: boolean;
  errorMessage: string | null;
  // selectedItem: T | null;
  searchFilter: string;
}
