import { Exclude, Expose } from 'class-transformer';

export class ExSubjectResponseDto {
  @Expose() // Chỉ hiển thị các trường có @Expose()
  name: string;

  @Expose()
  credits: number;

  @Exclude() // Ẩn trường id
  id: number;
}

export class ExSemesterResponseDto {
  @Expose()
  name: string;

  @Expose()
  subjects: ExSubjectResponseDto[];

  @Exclude()
  id: number;
}

export class ExConcentrationResponseDto {
  @Expose()
  name: string;

  @Expose()
  semesters: ExSemesterResponseDto[];

  @Exclude()
  id: number;
}

export class ExMajorResponseDto {
  @Expose()
  name: string;

  @Expose()
  concentrations: ExConcentrationResponseDto[];

  @Exclude()
  id: number;
}

export class ExCurriculumResponseDto {
  @Expose()
  name: string;

  @Expose()
  majors: ExMajorResponseDto[];

  @Exclude()
  id: number;
}