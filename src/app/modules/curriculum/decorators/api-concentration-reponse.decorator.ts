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
import { ConcentrationResponseDto } from '../dtos/concentration.dto';

export function ApiConcentrationResponse(
  type: 'create' | 'findAll' | 'findOne' | 'update' | 'remove'
) {
  switch (type) {
    case 'create':
      return applyDecorators(
        ApiOperation({ summary: 'Create Concentration' }),
        ApiConsumes('application/json', 'multipart/form-data'),
        ApiBody({
          schema: {
            type: 'object',
            required: ['name'],
            properties: {
              name: {
                type: 'string',
                example: 'Concentration 1: New Item'
              }
            }
          }
        }),
        ApiResponse({
          status: 201,
          description: 'Concentration created successfully',
          type: ConcentrationResponseDto
        }),
        ApiResponse({ status: 400, description: 'Invalid input data' }),
        ApiBearerAuth('JWT-auth')
      );

    case 'findAll':
      return applyDecorators(
        ApiOperation({ summary: 'Get list of Concentrations in a Concentrations' }),
        ApiResponse({ 
          status: 200, 
          description: 'List of Concentrations',
          type: [ConcentrationResponseDto]
        }),
        ApiResponse({ status: 404, description: 'Concentrations not found' })
      );

    case 'findOne':
      return applyDecorators(
        ApiOperation({ summary: 'Get detailed Concentration information by ID' }),
        ApiParam({ name: 'id', type: 'number', description: 'ID of the Concentration' }),
        ApiResponse({ 
          status: 200, 
          description: 'Concentration information',
          type: ConcentrationResponseDto
        }),
        ApiResponse({ status: 404, description: 'Concentration not found' })
      );

    case 'update':
      return applyDecorators(
        ApiOperation({ summary: 'Update Concentration information' }),
        ApiConsumes('application/json', 'multipart/form-data'),
        ApiParam({ name: 'id', type: 'number', description: 'ID of the Concentration' }),
        ApiBody({
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                example: 'Concentration 1: New Item (Updated)'
              }
            }
          }
        }),
        ApiResponse({ 
          status: 200, 
          description: 'Concentration updated successfully',
          type: ConcentrationResponseDto
        }),
        ApiResponse({ status: 400, description: 'Invalid input data' }),
        ApiResponse({ status: 404, description: 'Concentration not found' }),
        ApiBearerAuth('JWT-auth')
      );

    case 'remove':
      return applyDecorators(
        ApiOperation({ summary: 'Delete Concentration' }),
        ApiParam({ name: 'id', type: 'number', description: 'ID of the Concentration' }),
        ApiResponse({ status: 200, description: 'Concentration deleted successfully' }),
        ApiResponse({ status: 404, description: 'Concentration not found' }),
        ApiBearerAuth('JWT-auth')
      );
  }
} 