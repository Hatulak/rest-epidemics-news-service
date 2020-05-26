import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './category.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { v4 as uuid } from 'uuid';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Categories')
    private readonly categoriesModel: Model<Category>,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    const result = await this.categoriesModel.find().exec();
    return result;
  }

  getCategoryById(id: string): Promise<Category> {
    return this.findCategory(id);
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const {name} = createCategoryDto;
    const newCategory = new this.categoriesModel({
      name,
      cconst: uuid(),
    });
    const saved = await newCategory.save();
    return saved;
  }

  async deleteById(categoryId: string) {
    const found = await this.findCategory(categoryId);
    const result = await this.categoriesModel
      .deleteOne({ _id: found._id })
      .exec();
  }

  async updateCategory(
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const { id, name } = updateCategoryDto;
    const updatedCategory = await this.findCategory(id);
    if (name) {
      updatedCategory.name = name;
    }
    const saved = await updatedCategory.save();
    return saved;
  }

  private async findCategory(id: string): Promise<Category> {
    let found;
    try {
      found = await this.categoriesModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find category with id: ' + id);
    }
    if (!found) {
      throw new NotFoundException('Could not find category with id: ' + id);
    }
    return found;
  }
}
