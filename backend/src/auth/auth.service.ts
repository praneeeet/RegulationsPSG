import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { RegisterDto } from '../dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['department'],
    });

    if (user && await user.validatePassword(password)) {
      return user;
    }
    return null;
  }

async login(email: string, password: string): Promise<{ access_token: string, user: { role: string, user_id: number, email: string } }> {
  const user = await this.validateUser(email, password);
  if (!user) {
    throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }

  const payload = { user_id: user.user_id, role: user.role };

  return {
    access_token: this.jwtService.sign(payload),
    user: {
      role: user.role,
      user_id: user.user_id,
      email: user.email,
    }
  };
}

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, username, dept_id, role } = registerDto;

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    // Create new user
    const user = this.userRepository.create({
      user_id: await this.generateUserId(),
      email,
      username,
      password, // Will be hashed by the @BeforeInsert hook
      dept_id,
      role,
    });

    return this.userRepository.save(user);
  }

  async getCurrentUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ['department'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  private async generateUserId(): Promise<number> {
    const lastUser = await this.userRepository.findOne({
      where: {},
      order: { user_id: 'DESC' },
    });
    return lastUser ? lastUser.user_id + 1 : 1;
  }
}