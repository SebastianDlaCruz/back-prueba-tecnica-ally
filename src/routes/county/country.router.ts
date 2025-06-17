import { Router } from "express";
import { CountryController } from "../../controllers/county/country.controller";
import { authenticateToken } from "../../lib/middleware/authenticate-token/authenticate-token.middleware";

export const countryRouter = (country: CountryController) => {

  const router = Router();

  router.get('/', authenticateToken, (req, res) => {
    country.getCountries(req, res)
  });

  router.get('/city/:id', authenticateToken, (req, res) => {
    country.getCitiesByCountry(req, res)
  });


  return router;

}