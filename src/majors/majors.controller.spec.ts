import { Test, TestingModule } from '@nestjs/testing';
import { MajorsController } from './majors.controller';

describe('MajorsController', () => {
  let controller: MajorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MajorsController],
    }).compile();

    controller = module.get<MajorsController>(MajorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
