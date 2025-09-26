// Shared API response types
export interface ApiResponse<T> {
  value: T[];
  Count: number;
}

export interface ApiSingleResponse<T> {
  value: T;
}
