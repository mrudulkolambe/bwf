import { Category } from '../models/index';
import { ICategory } from '../models/category.model';

export const getCategories = async (): Promise<ICategory[]> => {
  return await Category.find({ isActive: true }).populate('tags');
};

export const getCategoryById = async (id: string): Promise<ICategory | null> => {
  return await Category.findById(id).populate('tags');
};
