import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingController } from './building.controller';
import { Building } from './building.entity';
import { BuildingRepository } from './building.repository';
import { BuildingService } from './building.service';

@Module({
  imports: [TypeOrmModule.forFeature([Building])],
  controllers: [BuildingController],
  providers: [BuildingService, BuildingRepository],
})
export class BuildingModule {}
