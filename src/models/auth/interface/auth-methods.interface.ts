import { Response } from "express";
import { StateResponse } from "../../../lib/interfaces/state.response.interface";
import { InputSingUp, InputsSingIn } from "../auth.model";

export interface ResponseAuth extends StateResponse {
  token: string;
  refreshToken: string;
}

export interface PaginatedResponse extends StateResponse {
  data: any[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface AuthMethods {
  singIn(inputs: InputsSingIn): Promise<ResponseAuth>;
  singUp(inputs: InputSingUp): Promise<StateResponse>;
  singOut(res: Response): StateResponse;
  refreshToken(token: string): ResponseAuth;
  getUsers(page: number, limit: number): Promise<PaginatedResponse>;

}