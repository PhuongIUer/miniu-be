import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBearerAuth,
  ApiQuery, 
  ApiConsumes,
  ApiParam
} from '@nestjs/swagger';
import { CurriculumResponseDto } from '../dtos/curriculum.dto';

export function ApiCurriculumResponse(
  type: 'create' | 'findAll' | 'findOne' | 'update' | 'remove'
) {
  switch (type) {
    case 'create':
      return applyDecorators(
        ApiOperation({ summary: 'Create Curriculum' }),
        ApiConsumes('application/json', 'multipart/form-data'),
        ApiBody({
          schema: {
            type: 'object',
            required: ['name', 'position'],
            properties: {
              name: {
                type: 'string',
                example: 'Curriculum 1: New Item'
              }
            }
          }
        }),
        ApiResponse({
          status: 201,
          description: 'Curriculum created successfully',
          type: CurriculumResponseDto
        }),
        ApiResponse({ status: 400, description: 'Invalid input data' }),
        ApiBearerAuth('JWT-auth')
      );

    case 'findAll':
      return applyDecorators(
        ApiOperation({ summary: 'Get list of Curriculums in a Curriculums' }),
        ApiResponse({ 
          status: 200, 
          description: 'List of Curriculums',
          type: [CurriculumResponseDto]
        }),
        ApiResponse({ status: 404, description: 'Curriculums not found' })
      );

    case 'findOne':
      return applyDecorators(
        ApiOperation({ summary: 'Get detailed Curriculum information by ID' }),
        ApiResponse({ 
          status: 200, 
          description: 'Curriculum information',
          type: CurriculumResponseDto
        }),
        ApiResponse({ status: 404, description: 'Curriculum not found' })
      );

    case 'update':
      return applyDecorators(
        ApiOperation({ summary: 'Update Curriculum information' }),
        ApiConsumes('application/json', 'multipart/form-data'),
        ApiParam({ name: 'id', type: 'number', description: 'ID of the Curriculum' }),
        ApiBody({
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                example: 'Curriculum 1: New Item (Updated)'
              }
            }
          }
        }),
        ApiResponse({ 
          status: 200, 
          description: 'Curriculum updated successfully',
          type: CurriculumResponseDto
        }),
        ApiResponse({ status: 400, description: 'Invalid input data' }),
        ApiResponse({ status: 404, description: 'Curriculum not found' }),
        ApiBearerAuth('JWT-auth')
      );

    case 'remove':
      return applyDecorators(
        ApiOperation({ summary: 'Delete Curriculum' }),
        ApiParam({ name: 'id', type: 'number', description: 'ID of the Curriculum' }),
        ApiResponse({ status: 200, description: 'Curriculum deleted successfully' }),
        ApiResponse({ status: 404, description: 'Curriculum not found' }),
        ApiBearerAuth('JWT-auth')
      );
  }
} 