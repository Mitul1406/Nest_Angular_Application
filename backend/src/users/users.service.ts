import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private userRepository: any,
    ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {

    const user = await this.userRepository.findOne({
      where: { email : id },
    });
    return {
      message:"Got the user",
      data: user};
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async updateProfilePic(userId: string, filename: string) {
  await this.userRepository.update(userId, {
    profilePic: filename
  });

  return {
    success: true,
    message: 'Profile updated',
    data: filename
  };
}
}
