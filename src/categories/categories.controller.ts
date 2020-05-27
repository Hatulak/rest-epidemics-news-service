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
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './category.model';

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
  @UsePipes(ValidationPipe)
  async addCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const saved = await this.cateoriesService.createCategory(createCategoryDto);
    return saved;
  }

  @Put()
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const saved = await this.cateoriesService.updateCategory(updateCategoryDto);
    return saved;
  }

  @Delete(':id')
  async deleteCategoryById(@Param('id') id: string): Promise<void> {
    await this.cateoriesService.deleteById(id);
  }
}