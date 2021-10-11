import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BuildingService } from './building.service';
import { BuildingIdDTO } from './dto/building-id.dto';

@ApiTags('Building')
@Controller('buildings')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @ApiOperation({
    summary: 'Buildings',
    description: 'Some description here...',
  })
  @ApiResponse({
    status: 200,
    description: 'List of buildings.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error in ERP get buildings.',
  })
  @Get()
  getBuildings() {
    return this.buildingService.getBuildings();
  }

  @ApiOperation({
    summary: 'Building floors',
    description: 'Some description here...',
  })
  @ApiResponse({
    status: 200,
    description: 'List of building floors.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error in ERP get building floors.',
  })
  @Get('floors/:buildingId')
  getBuildingFloors(@Query() { buildingId }: BuildingIdDTO) {
    return this.buildingService.getBuildingFloors(buildingId);
  }
}
