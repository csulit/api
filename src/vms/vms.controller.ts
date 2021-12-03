import { Controller } from '@nestjs/common';
import { VmsService } from './vms.service';

@Controller('vms')
export class VmsController {
  constructor(private readonly vmsService: VmsService) {}
}
