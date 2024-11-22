import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { BuildingService } from './building.service';
import { CreateBuildingDTO, UpdateBuildingDTO } from './dto/building.dto';
import {
  GetAllBuildingRO,
  GetDetailBuildingRO,
  ResultRO,
} from './ro/building.ro';
import { HttpErrorRO } from './ro/http-error.ro';

@Controller('building')
export class BuildingController {
  constructor(private buildingService: BuildingService) {}

  @ApiOperation({ summary: 'Create buildingName or location' })
  @ApiCreatedResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpErrorRO })
  @ApiInternalServerErrorResponse({ type: HttpErrorRO })
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() dto: CreateBuildingDTO, @Res() res: Response) {
    const result = await this.buildingService.create(dto);
    return res.status(result.status).json(result.body);
  }

  @ApiOperation({ summary: 'Get all info building and location' })
  @ApiOkResponse({ type: [GetAllBuildingRO] })
  @ApiInternalServerErrorResponse({ type: HttpErrorRO })
  @Get('')
  async getAll(@Res() res: Response) {
    const result = await this.buildingService.getAll();
    return res.status(result.status).json(result.body);
  }

  @ApiOperation({ summary: 'Get info building or location by id' })
  @ApiOkResponse({ type: GetDetailBuildingRO })
  @ApiBadRequestResponse({ type: HttpErrorRO })
  @ApiInternalServerErrorResponse({ type: HttpErrorRO })
  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const result = await this.buildingService.getById(id);
    return res.status(result.status).json(result.body);
  }

  @ApiOperation({ summary: 'Update location by id' })
  @ApiOkResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpErrorRO })
  @ApiInternalServerErrorResponse({ type: HttpErrorRO })
  @UsePipes(new ValidationPipe())
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBuildingDTO,
    @Res() res: Response,
  ) {
    const result = await this.buildingService.updateById(id, dto);
    return res.status(result.status).json(result.body);
  }

  @ApiOperation({ summary: 'Delete location by id' })
  @ApiOkResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpErrorRO })
  @ApiInternalServerErrorResponse({ type: HttpErrorRO })
  @Delete('/:id')
  async deleteById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const result = await this.buildingService.deleteById(id);
    return res.status(result.status).json(result.body);
  }
}
