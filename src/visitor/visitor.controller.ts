import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VisitorService } from './visitor.service';

@ApiTags('Visitor')
@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}
}
