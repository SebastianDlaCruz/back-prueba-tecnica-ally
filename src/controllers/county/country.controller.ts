import { Request, Response } from "express";
import { InternalServerError } from "../../lib/errors/internal-server/internal-server.error";
import { CountryMethods } from "../../models/country/interface/country.methods";
export class CountryController {

  private country: CountryMethods;

  constructor(country: CountryMethods) {
    this.country = country;
  }

  async getCountries(req: Request, res: Response) {

    try {
      const response = await this.country.getCountries();

      res.status(response.statusCode).json(response);

    } catch (error) {

      if (error instanceof InternalServerError) {
        res.status(error.statusCode).json({
          statusCode: error.statusCode,
          message: error.message,
          success: false
        })
      }
    }
  }

  async getCitiesByCountry(req: Request, res: Response) {

    try {
      const response = await this.country.getCitiesByCountry(parseInt(req.params.id));

      res.status(response.statusCode).json(response);
    }

    catch (error) {

      if (error instanceof InternalServerError) {
        res.status(error.statusCode).json({
          statusCode: error.statusCode,
          message: error.message,
          success: false
        })
      }
    }

  }

}