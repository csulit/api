import { Test, TestingModule } from '@nestjs/testing';
import { VmsController } from './vms.controller';
import { VmsService } from './vms.service';

describe('VmsController', () => {
  let controller: VmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VmsController],
      providers: [VmsService],
    }).compile();

    controller = module.get<VmsController>(VmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
