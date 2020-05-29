import {
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './category.model';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/user.model';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly cateoriesService: CategoriesService) {}

  @Get()
  async getAllCategory(): Promise<Category[]> {
    return await this.cateoriesService.getAllCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string): Promise<Category> {
    return await this.cateoriesService.getCategoryById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @UsePipes(ValidationPipe)
  async addCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const saved = await this.cateoriesService.createCategory(createCategoryDto);
    return saved;
  }

  @Put()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const saved = await this.cateoriesService.updateCategory(updateCategoryDto);
    return saved;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async deleteCategoryById(@Param('id') id: string): Promise<void> {
    await this.cateoriesService.deleteById(id);
  }
}
