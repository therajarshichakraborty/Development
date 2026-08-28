export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
}

export class ApiResponse<T = unknown> {
  public readonly success: true = true;
  public readonly statusCode: number;
  public readonly data: T;
  public readonly message?: string;
  public readonly meta?: ResponseMeta;

  constructor(
    statusCode: number,
    data: T,
    message?: string,
    meta?: ResponseMeta
  ) {
    this.statusCode = statusCode;
    this.data = data;
    if (message !== undefined) {
      this.message = message;
    }
    if (meta !== undefined) {
      this.meta = meta;
    }
  }

  static ok<T>(data: T, message?: string, meta?: ResponseMeta): ApiResponse<T> {
    return new ApiResponse(200, data, message, meta);
  }

  static created<T>(
    data: T,
    message?: string,
    meta?: ResponseMeta
  ): ApiResponse<T> {
    return new ApiResponse(201, data, message, meta);
  }
}
