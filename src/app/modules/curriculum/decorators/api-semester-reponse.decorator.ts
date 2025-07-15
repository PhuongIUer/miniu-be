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
import { SemesterResponseDto } from '../dtos/semester.dto';

export function ApiSemesterResponse(
  type: 'create' | 'findAll' | 'findOne' | 'update' | 'remove'
) {
  switch (type) {
    case 'create':
      return applyDecorators(
        ApiOperation({ summary: 'Create Semester' }),
        ApiConsumes('application/json', 'multipart/form-data'),
        ApiBody({
          schema: {
            type: 'object',
            required: ['name', 'position'],
            properties: {
              name: {
                type: 'string',
                example: 'Semester 1: New Item'
              }
            }
          }
        }),
        ApiResponse({
          status: 201,
          description: 'Semester created successfully',
          type: SemesterResponseDto
        }),
        ApiResponse({ status: 400, description: 'Invalid input data' }),
        ApiBearerAuth('JWT-auth')
      );

    case 'findAll':
      return applyDecorators(
        ApiOperation({ summary: 'Get list of Semesters in a Semesters' }),
        ApiResponse({ 
          status: 200, 
          description: 'List of Semesters',
          type: [SemesterResponseDto]
        }),
        ApiResponse({ status: 404, description: 'Semesters not found' })
      );

    case 'findOne':
      return applyDecorators(
        ApiOperation({ summary: 'Get detailed Semester information by ID' }),
        ApiParam({ name: 'id', type: 'number', description: 'ID of the Semester' }),
        ApiResponse({ 
          status: 200, 
          description: 'Semester information',
          type: SemesterResponseDto
        }),
        ApiResponse({ status: 404, description: 'Semester not found' })
      );

    case 'update':
      return applyDecorators(
        ApiOperation({ summary: 'Update Semester information' }),
        ApiConsumes('application/json', 'multipart/form-data'),
        ApiParam({ name: 'id', type: 'number', description: 'ID of the Semester' }),
        ApiBody({
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                example: 'Semester 1: New Item (Updated)'
              }
            }
          }
        }),
        ApiResponse({ 
          status: 200, 
          description: 'Semester updated successfully',
          type: SemesterResponseDto
        }),
        ApiResponse({ status: 400, description: 'Invalid input data' }),
        ApiResponse({ status: 404, description: 'Semester not found' }),
        ApiBearerAuth('JWT-auth')
      );

    case 'remove':
      return applyDecorators(
        ApiOperation({ summary: 'Delete Semester' }),
        ApiParam({ name: 'id', type: 'number', description: 'ID of the Semester' }),
        ApiResponse({ status: 200, description: 'Semester deleted successfully' }),
        ApiResponse({ status: 404, description: 'Semester not found' }),
        ApiBearerAuth('JWT-auth')
      );
  }
} 