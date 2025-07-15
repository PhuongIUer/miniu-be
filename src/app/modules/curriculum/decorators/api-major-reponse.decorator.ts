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
import { MajorResponseDto } from '../dtos/major.dto';

export function ApiMajorResponse(
  type: 'create' | 'findAll' | 'findOne' | 'update' | 'remove'
) {
  switch (type) {
    case 'create':
      return applyDecorators(
        ApiOperation({ summary: 'Create Major' }),
        ApiConsumes('application/json', 'multipart/form-data'),
        ApiBody({
          schema: {
            type: 'object',
            required: ['name', 'position'],
            properties: {
              name: {
                type: 'string',
                example: 'Major 1: New Item'
              }
            }
          }
        }),
        ApiResponse({
          status: 201,
          description: 'Major created successfully',
          type: MajorResponseDto
        }),
        ApiResponse({ status: 400, description: 'Invalid input data' }),
        ApiBearerAuth('JWT-auth')
      );

    case 'findAll':
      return applyDecorators(
        ApiOperation({ summary: 'Get list of Majors in a Majors' }),
        ApiResponse({ 
          status: 200, 
          description: 'List of Majors',
          type: [MajorResponseDto]
        }),
        ApiResponse({ status: 404, description: 'Majors not found' })
      );

    case 'findOne':
      return applyDecorators(
        ApiOperation({ summary: 'Get detailed Major information by ID' }),
        ApiParam({ name: 'id', type: 'number', description: 'ID of the Major' }),
        ApiResponse({ 
          status: 200, 
          description: 'Major information',
          type: MajorResponseDto
        }),
        ApiResponse({ status: 404, description: 'Major not found' })
      );

    case 'update':
      return applyDecorators(
        ApiOperation({ summary: 'Update Major information' }),
        ApiConsumes('application/json', 'multipart/form-data'),
        ApiParam({ name: 'id', type: 'number', description: 'ID of the Major' }),
        ApiBody({
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                example: 'Major 1: New Item (Updated)'
              }
            }
          }
        }),
        ApiResponse({ 
          status: 200, 
          description: 'Major updated successfully',
          type: MajorResponseDto
        }),
        ApiResponse({ status: 400, description: 'Invalid input data' }),
        ApiResponse({ status: 404, description: 'Major not found' }),
        ApiBearerAuth('JWT-auth')
      );

    case 'remove':
      return applyDecorators(
        ApiOperation({ summary: 'Delete Major' }),
        ApiParam({ name: 'id', type: 'number', description: 'ID of the Major' }),
        ApiResponse({ status: 200, description: 'Major deleted successfully' }),
        ApiResponse({ status: 404, description: 'Major not found' }),
        ApiBearerAuth('JWT-auth')
      );
  }
} 