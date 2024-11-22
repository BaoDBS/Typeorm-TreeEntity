import { Expose, Type } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';

export class GetDetailBuildingRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  locationName: string;

  @ApiProperty()
  @Expose()
  locationNumber: string;

  @ApiProperty()
  @Expose()
  area: string;
}

export class GetDetailWithChildBuildingRO extends GetDetailBuildingRO {
  @ApiProperty({ isArray: true, type: GetDetailWithChildBuildingRO })
  @Type(() => GetDetailWithChildBuildingRO)
  @Expose()
  children: GetDetailWithChildBuildingRO[];
}

export class GetAllBuildingRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  buildingName: string;

  @ApiProperty({ isArray: true, type: GetDetailWithChildBuildingRO })
  @Type(() => GetDetailWithChildBuildingRO)
  @Expose()
  locations: GetDetailWithChildBuildingRO[];
}

export class ResultRO {
  @ApiProperty()
  @Expose()
  result: boolean;
}
