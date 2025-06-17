import { RowDataPacket } from "mysql2";
import { InternalServerError } from "../../lib/errors/internal-server/internal-server.error";
import { Connection, ConnectionDBModel } from "../connection-db/connection-db.model";
import { City, Country, CountryMethods, ResponseCity, ResponseCountry } from "./interface/country.methods";

type CountyQuery = Country & RowDataPacket;
type CityQuery = City & RowDataPacket;

export class CountryModel extends ConnectionDBModel implements CountryMethods {

  constructor(connection: Connection) {
    super(connection);
  }


  async getCountries(): Promise<ResponseCountry> {

    try {

      const [countries] = await this.connection.method.query<CountyQuery[]>(`SELECT * FROM Country`);

      return {
        statusCode: 200,
        message: 'Éxito',
        success: true,
        data: countries
      }

    } catch (error) {

      throw new InternalServerError('Error al obtener los países');

    } finally {
      this.release();
    }

  }


  async getCitiesByCountry(country_id: number): Promise<ResponseCity> {

    try {

      const [cities] = await this.connection.method.query<CityQuery[]>("SELECT * FROM City WHERE id_country = ?", [country_id]);


      return {
        statusCode: 200,
        message: 'Éxito',
        success: true,
        data: cities
      }
    } catch {

      throw new InternalServerError('Error al obtener las ciudades');


    } finally {
      this.release();
    }
  }



}