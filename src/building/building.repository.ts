import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Building } from './building.entity';
import { UpdateBuildingDTO } from './dto/building.dto';

@Injectable()
export class BuildingRepository extends Repository<Building> {
  constructor(private dataSource: DataSource) {
    super(Building, dataSource.createEntityManager());
  }

  async createBuilding(data) {
    return await this.save(data);
  }

  async getAll() {
    return await this.dataSource.manager
      .getTreeRepository(Building)
      .findTrees();
  }

  async getById(id: number) {
    return await this.findOneBy({ id });
  }

  async isBuildingExist(id: number) {
    return await this.countBy({ id });
  }

  async updateById(id: number, dto: UpdateBuildingDTO) {
    return await this.update({ id }, dto);
  }

  async deleteById(id: number) {
    return await this.delete(id);
  }
}
