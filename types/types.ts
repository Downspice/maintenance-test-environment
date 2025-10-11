export interface GenericObject {
  id?:string ;
  name: string;
}

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface ApiResponse<T> {
  length: number;
  data: T[];
  message: string;
  statusCode: number;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface CategoryProps {
  id: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  parentId?: string;
  parentName?: string;
}

export interface SetupMainProps {
  categoryItems: CategoryProps[];
  isError?: boolean;
  isLoading?: boolean;
  setupType?: string;
}

export interface SetUp {
  id: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  categoryId?: string;
  categoryName?: string;
}

export interface SetupResponse {
  data: SetUp[];
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  message: string;
  statusCode: number;
  data: {
    content: T[];
    size: number;
    page: number;
    totalElements: number;
    totalPages: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  dateTime: string;
}
