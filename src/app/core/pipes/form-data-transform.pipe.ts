import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class FormDataTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || typeof value !== 'object') {
      return value;
    }

    const transformed = { ...value };

    // Transform numeric fields
    const numericFields = ['position', 'chapterId', 'duration'];
    
    for (const field of numericFields) {
      if (transformed[field] && typeof transformed[field] === 'string') {
        const parsedValue = parseFloat(transformed[field]);
        if (!isNaN(parsedValue)) {
          transformed[field] = parsedValue;
        }
      }
    }

    // Transform boolean fields
    const booleanFields = ['isPublished', 'isActive'];
    
    for (const field of booleanFields) {
      if (transformed[field] !== undefined) {
        if (transformed[field] === 'true') {
          transformed[field] = true;
        } else if (transformed[field] === 'false') {
          transformed[field] = false;
        }
      }
    }

    return transformed;
  }
} 