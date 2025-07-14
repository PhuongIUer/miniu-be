import { applyDecorators } from '@nestjs/common';
import { 
  ApiResponse, 
  ApiBearerAuth, 
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';

export function ApiAuthResponse(type: 'login' | 'logout' | 'register' | 'verify' | 'resend' | 'profile' | 'forgotPassword' | 'resetPassword' | 'changePassword') {
  switch (type) {
    case 'login':
      return applyDecorators(
        ApiBody({ type: LoginDto }),
        ApiResponse({
          status: 200,
          description: 'Login successful',
          schema: { properties: { access_token: { type: 'string' } } }
        }),
        ApiUnauthorizedResponse({ description: 'Invalid credentials' })
      );
    case 'logout':
      return applyDecorators(
        ApiResponse({
          status: 200,
          description: 'Logout successful',
        })
      );
    case 'register':
      return applyDecorators(
        ApiCreatedResponse({
          description: 'User successfully registered',
          schema: { 
            properties: {
              id: { type: 'number' },
              email: { type: 'string' },
              message: { type: 'string' }
            } 
          }
        }),
        ApiConflictResponse({ description: 'Email already exists' })
      );
    case 'verify':
      return applyDecorators(
        ApiResponse({
          status: 200,
          description: 'Email verified successfully',
          schema: { properties: { message: { type: 'string' } } }
        })
      );
    case 'resend':
      return applyDecorators(
        ApiResponse({
          status: 200,
          description: 'Verification code resent',
          schema: { properties: { message: { type: 'string' } } }
        })
      );
    case 'profile':
      return applyDecorators(
        ApiBearerAuth('JWT-auth'),
        ApiResponse({
          status: 200,
          description: 'Return user profile'
        }),
        ApiUnauthorizedResponse({ description: 'Unauthorized' })
      );
    case 'forgotPassword':
      return applyDecorators(
        ApiBody({ type: ForgotPasswordDto }),
        ApiOkResponse({
          description: 'Password reset instruction has been sent to your email',
          schema: {
            properties: {
              message: { 
                type: 'string', 
                example: 'Password reset instruction has been sent to your email' 
              },
            }
          }
        }),
        ApiBadRequestResponse({ description: 'Invalid data' }),
        ApiInternalServerErrorResponse({ description: 'Cannot send email' })
      );
    case 'resetPassword':
      return applyDecorators(
        ApiBody({ type: ResetPasswordDto }),
        ApiOkResponse({
          description: 'Password has been reset successfully',
          schema: {
            properties: {
              message: { 
                type: 'string', 
                example: 'Password has been reset successfully' 
              },
            }
          }
        }),
        ApiBadRequestResponse({ description: 'Invalid token or expired' }),
        ApiInternalServerErrorResponse({ description: 'Server error' })
      );
    case 'changePassword':
      return applyDecorators(
        ApiBearerAuth('JWT-auth'),
        ApiBody({ type: ChangePasswordDto }),
        ApiOkResponse({
          description: 'Password has been changed successfully',
          schema: {
            properties: {
              message: { 
                type: 'string', 
                example: 'Password has been changed successfully' 
              },
            }
          }
        }),
        ApiBadRequestResponse({ description: 'Invalid data or current password is incorrect' }),
        ApiUnauthorizedResponse({ description: 'Unauthorized' })
      );
  }
} 