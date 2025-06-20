import { Test, TestingModule } from '@nestjs/testing';
import { LecturersController } from './lecturers.controller';

describe('LecturersController', () => {
  let controller: LecturersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LecturersController],
    }).compile();

    controller = module.get<LecturersController>(LecturersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
