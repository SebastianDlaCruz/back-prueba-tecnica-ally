import { StateResponse } from "../../../lib/interfaces/state.response.interface";

export interface Country {
  id: number;
  name: string;
}

export interface City extends Country { };


export interface ResponseCountry extends StateResponse {
  data: Country[];
}


export interface ResponseCity extends StateResponse {
  data: City[];
}

export interface CountryMethods {
  getCountries(): Promise<ResponseCountry>;
  getCitiesByCountry(country_id: number): Promise<ResponseCity>;
}