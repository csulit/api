import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BuildingService {
  constructor(private httpService: HttpService) {}

  async getBuildings() {
    const buildings = this.httpService.get('/api/Buildings', {
      params: { pageSize: 100 },
    });

    const promisifyBuildings = await firstValueFrom(buildings);

    if (promisifyBuildings.status !== 200) {
      throw new BadRequestException('Error in ERP get buildings.');
    }

    return promisifyBuildings.data;
  }

  async getBuildingFloors(buildingId: number) {
    const buildingFloors = this.httpService.get(
      `/api/Buildings/${buildingId}/floors`,
    );

    const promisifyBuildingFloors = await firstValueFrom(buildingFloors);

    if (promisifyBuildingFloors.status !== 200) {
      throw new BadRequestException('Error in ERP get building floors.');
    }

    return promisifyBuildingFloors.data;
  }
}
