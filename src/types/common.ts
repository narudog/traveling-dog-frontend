export type ErrorResponse = {
  code: string;
  message: string;
  errors?: Record<string, string>;
};

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
