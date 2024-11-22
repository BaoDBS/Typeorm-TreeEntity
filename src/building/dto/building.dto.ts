import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBuildingDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  buildingName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  locationName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  locationNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  area: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  parentNameBuilding: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  parentNumberLocation: string;
}

export class UpdateBuildingDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  locationName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  locationNumber: string;
}
