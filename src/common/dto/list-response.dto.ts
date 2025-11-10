export class ListResponseDto<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}