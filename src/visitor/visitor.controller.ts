import { Controller } from '@nestjs/common';
import { VisitorService } from './visitor.service';

@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}
}
