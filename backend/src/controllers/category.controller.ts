import type { Request, Response } from 'express';
import * as categoryService from '../services/category.service';
import { localize } from '../utils/localization';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as string) || 'en';
    const categories = await categoryService.getCategories();
    
    const localizedCategories = categories.map(cat => localize(cat.toObject(), lang));

    res.status(200).json({
      message: 'Categories fetched successfully',
      data: localizedCategories
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching categories', data: null });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as string) || 'en';
    const category = await categoryService.getCategoryById(req.params.id as string);
    if (!category) {
      return res.status(404).json({ message: 'Category not found', data: null });
    }

    const responseData = localize(category.toObject(), lang);

    res.status(200).json({
      message: 'Category fetched successfully',
      data: responseData
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching category', data: null });
  }
};
