import { Body, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Building } from './building.entity';
import { BuildingRepository } from './building.repository';
import { CreateBuildingDTO, UpdateBuildingDTO } from './dto/building.dto';
import { BaseService } from '../common/base.service';
import {
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
        data.buildingName = buildingName;
      } else {
        if (!locationName || !locationNumber || !area) {
          this.formatError(
            HttpStatus.BAD_REQUEST,
            'BAD_REQUEST',
            'locationName, locationNumber, area should not be empty',
          );
        }
        if (!parentNameBuilding || !parentNumberLocation) {
          this.formatError(
            HttpStatus.BAD_REQUEST,
            'BAD_REQUEST',
            'parentNameBuilding, parentNumberLocation should not be empty',
          );
        }
        data.locationName = locationName;
        data.locationNumber = locationNumber;
        data.area = area;
        if (parentNameBuilding) {
          data.parent = await this.buildingRepo.findOne({
            where: { buildingName: parentNameBuilding },
          });
        }

        if (parentNumberLocation) {
          data.parent = await this.buildingRepo.findOne({
            where: { locationNumber: parentNumberLocation },
          });
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
      this.formatError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'INTERNAL_SERVER_ERROR',
        'INTERNAL_SERVER_ERROR',
      );
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
      await this.isBuildingExist(id);
      const building = await this.buildingRepo.getById(id);

      return this.formatData(
        HttpStatus.OK,
        plainToInstance(GetDetailBuildingRO, building, {
          excludeExtraneousValues: true,
        }),
      );
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      this.formatError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'INTERNAL_SERVER_ERROR',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  async isBuildingExist(id: number) {
    try {
      const countById = await this.buildingRepo.isBuildingExist(id);
      if (!countById) {
        this.formatError(
          HttpStatus.BAD_REQUEST,
          'BUILDING_DOES_NOT_EXIST',
          'BUILDING_DOES_NOT_EXIST',
        );
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

  async updateById(id: number, dto: UpdateBuildingDTO) {
    try {
      await this.isBuildingExist(id);
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
      this.formatError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'INTERNAL_SERVER_ERROR',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  async deleteById(id: number) {
    try {
      await this.isBuildingExist(id);
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
      this.formatError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'INTERNAL_SERVER_ERROR',
        'INTERNAL_SERVER_ERROR',
      );
    }
  }
}
