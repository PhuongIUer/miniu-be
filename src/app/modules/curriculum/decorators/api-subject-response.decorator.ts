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
import { SubjectResponseDto } from '../dtos/subject.dto';

export function ApiSubjectResponse(
  type: 'create' | 'findAll' | 'findOne' | 'update' | 'remove'
) {
  switch (type) {
    case 'create':
      return applyDecorators(
        ApiOperation({ summary: 'Create Subject' }),
        ApiConsumes('application/json', 'multipart/form-data'),
        ApiBody({
          schema: {
            type: 'object',
            required: ['name', 'credit'],
            properties: {
              name: {
                type: 'string',
                example: 'Subject 1: New Item'
              },
              credit: {
                type: 'number',
                example: 0
              }
            }
          }
        }),
        ApiResponse({
          status: 201,
          description: 'Subject created successfully',
          type: SubjectResponseDto
        }),
        ApiResponse({ status: 400, description: 'Invalid input data' }),
        ApiBearerAuth('JWT-auth')
      );

    case 'findAll':
      return applyDecorators(
        ApiOperation({ summary: 'Get list of Subjects in a Subjects' }),
        ApiResponse({ 
          status: 200, 
          description: 'List of Subjects',
          type: [SubjectResponseDto]
        }),
        ApiResponse({ status: 404, description: 'Subjects not found' })
      );

    case 'findOne':
      return applyDecorators(
        ApiOperation({ summary: 'Get detailed Subject information by ID' }),
        ApiParam({ name: 'id', type: 'number', description: 'ID of the Subject' }),
        ApiResponse({ 
          status: 200, 
          description: 'Subject information',
          type: SubjectResponseDto
        }),
        ApiResponse({ status: 404, description: 'Subject not found' })
      );

    case 'update':
      return applyDecorators(
        ApiOperation({ summary: 'Update Subject information' }),
        ApiConsumes('application/json', 'multipart/form-data'),
        ApiParam({ name: 'id', type: 'number', description: 'ID of the Subject' }),
        ApiBody({
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                example: 'Subject 1: New Item (Updated)'
              },
              credit: {
                type: 'number',
                example: 1
              }
            }
          }
        }),
        ApiResponse({ 
          status: 200, 
          description: 'Subject updated successfully',
          type: SubjectResponseDto
        }),
        ApiResponse({ status: 400, description: 'Invalid input data' }),
        ApiResponse({ status: 404, description: 'Subject not found' }),
        ApiBearerAuth('JWT-auth')
      );

    case 'remove':
      return applyDecorators(
        ApiOperation({ summary: 'Delete Subject' }),
        ApiParam({ name: 'id', type: 'number', description: 'ID of the Subject' }),
        ApiResponse({ status: 200, description: 'Subject deleted successfully' }),
        ApiResponse({ status: 404, description: 'Subject not found' }),
        ApiBearerAuth('JWT-auth')
      );
  }
} 