import { StateResponse } from "../../../lib/interfaces/state.response.interface";

export interface Country {
  country_id: number;
  country_name: string;
}

export interface City {
  city_id: number;
  city_name: string;
}


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