import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Building } from './building.entity';
import { BuildingRepository } from './building.repository';
import { CreateBuildingDTO, UpdateBuildingDTO } from './dto/building.dto';
import { BaseService } from '../common/base.service';
import {
  GetAllBuildingRO,
  GetDetailBuildingRO,
  GetDetailWithChildBuildingRO,
  ResultRO,
} from './ro/building.ro';

@Injectable()
export class BuildingService extends BaseService {
  private logger = new Logger(BuildingService.name);
  constructor(private buildingRepo: BuildingRepository) {
    super();
  }
  async create(@Body() dto: CreateBuildingDTO) {
    const {
      buildingName,
      locationName,
      locationNumber,
      area,
      parentNameBuilding,
      parentNumberLocation,
    } = dto;
    const data = new Building();
    try {
      if (buildingName) {
        await this.isBuildingNameExist(buildingName);
        data.buildingName = buildingName;
      } else {
        if (!locationName || !locationNumber || !area) {
          throw new HttpException(
            {
              code: 'BAD_REQUEST',
              message: 'locationName, locationNumber, area should not be empty',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        if (!parentNameBuilding && !parentNumberLocation) {
          throw new HttpException(
            {
              code: 'BAD_REQUEST',
              message:
                'parentNameBuilding, parentNumberLocation should not be empty',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        data.locationName = locationName;
        data.locationNumber = locationNumber;
        data.area = area;
        if (parentNameBuilding) {
          const countByName =
            await this.buildingRepo.isBuildingNameExist(parentNameBuilding);
          if (countByName) {
            data.parent = await this.buildingRepo.findOne({
              where: { buildingName: parentNameBuilding },
            });
          } else {
            throw new HttpException(
              {
                code: 'BUILDING_NAME_DOES_NOT_EXIST',
                message: 'buildingName does not exist',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
        }

        if (parentNumberLocation) {
          const countByNumber =
            await this.buildingRepo.isLocationNumberExist(parentNumberLocation);
          if (countByNumber) {
            data.parent = await this.buildingRepo.findOne({
              where: { locationNumber: parentNumberLocation },
            });
          } else {
            throw new HttpException(
              {
                code: 'LOCATION_NUMBER_DOES_NOT_EXIST',
                message: 'locationNumber does not exist',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
        }
      }

      await this.buildingRepo.createBuilding(data);
      return this.formatData(
        HttpStatus.CREATED,
        plainToInstance(
          ResultRO,
          { result: true },
          {
            excludeExtraneousValues: true,
          },
        ),
      );
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      console.log(error);
      if (error.status === HttpStatus.INTERNAL_SERVER_ERROR) {
        this.formatError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'INTERNAL_SERVER_ERROR',
          'INTERNAL_SERVER_ERROR',
        );
      } else {
        const response = error.getResponse();
        const status = error.getStatus();
        console.log(status, error.status);
        this.formatError(status, response.code, response.message);
      }
    }
  }

  async getAll() {
    try {
      const buildings = await this.buildingRepo.getAll();
      if (buildings.length > 0) {
        const result = buildings.map((building) => {
          const { id, buildingName, children } = building;
          const locations = plainToInstance(
            GetDetailWithChildBuildingRO,
            children,
            {
              excludeExtraneousValues: true,
            },
          );
          return {
            id,
            buildingName,
            locations,
          };
        });
        return this.formatData(HttpStatus.OK, result);
      } else {
        return this.formatData(HttpStatus.OK, []);
      }
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.formatError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'INTERNAL_SERVER_ERROR',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  async getById(id: number) {
    try {
      await this.isExist(id);
      const building = await this.buildingRepo.getById(id);
      if (building.buildingName) {
        return this.formatData(
          HttpStatus.OK,
          plainToInstance(GetAllBuildingRO, building, {
            excludeExtraneousValues: true,
          }),
        );
      } else {
        return this.formatData(
          HttpStatus.OK,
          plainToInstance(GetDetailBuildingRO, building, {
            excludeExtraneousValues: true,
          }),
        );
      }
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      if (error.status === HttpStatus.INTERNAL_SERVER_ERROR) {
        this.formatError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'INTERNAL_SERVER_ERROR',
          'INTERNAL_SERVER_ERROR',
        );
      } else {
        const response = error.getResponse();
        const status = error.getStatus();
        console.log(status, error.status);
        this.formatError(status, response.code, response.message);
      }
    }
  }

  async isExist(id: number) {
    const countById = await this.buildingRepo.isBuildingExist(id);
    if (!countById) {
      throw new HttpException(
        { code: 'ID_DOES_NOT_EXIST', message: 'id does not exist' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async isBuildingNameExist(buildingName: string) {
    const countByName =
      await this.buildingRepo.isBuildingNameExist(buildingName);
    if (countByName) {
      throw new HttpException(
        { code: 'BUILDING_NAME_EXIST', message: 'buildingName exist' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateById(id: number, dto: UpdateBuildingDTO) {
    try {
      await this.isExist(id);
      await this.buildingRepo.updateById(id, dto);
      return this.formatData(
        HttpStatus.OK,
        plainToInstance(
          ResultRO,
          { result: true },
          {
            excludeExtraneousValues: true,
          },
        ),
      );
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      if (error.status === HttpStatus.INTERNAL_SERVER_ERROR) {
        this.formatError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'INTERNAL_SERVER_ERROR',
          'INTERNAL_SERVER_ERROR',
        );
      } else {
        const response = error.getResponse();
        const status = error.getStatus();
        console.log(status, error.status);
        this.formatError(status, response.code, response.message);
      }
    }
  }

  async deleteById(id: number) {
    try {
      await this.isExist(id);
      await this.buildingRepo.deleteById(id);
      return this.formatData(
        HttpStatus.OK,
        plainToInstance(
          ResultRO,
          { result: true },
          {
            excludeExtraneousValues: true,
          },
        ),
      );
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      if (error.status === HttpStatus.INTERNAL_SERVER_ERROR) {
        this.formatError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'INTERNAL_SERVER_ERROR',
          'INTERNAL_SERVER_ERROR',
        );
      } else {
        const response = error.getResponse();
        const status = error.getStatus();
        console.log(status, error.status);
        this.formatError(status, response.code, response.message);
      }
    }
  }
}
