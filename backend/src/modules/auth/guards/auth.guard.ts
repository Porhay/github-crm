import { Injectable } from '@nestjs/common';
import { AuthGuard as JWT } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends JWT('jwt') {} 