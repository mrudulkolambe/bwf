import Category from '../../models/category.model';

export const getCategories = async (lang: string = 'en'): Promise<any[]> => {
  const categories = await Category.find({ isActive: true }).populate('tags');

  return categories.map(cat => {
    const obj = cat.toObject();
    obj.title = obj.title[lang as keyof typeof obj.title] || obj.title.en;
    obj.description = obj.description[lang as keyof typeof obj.description] || obj.description.en;

    if (obj.tags && Array.isArray(obj.tags)) {
      obj.tags = obj.tags.map((tag: any) => {
        if (tag.title && typeof tag.title === 'object') {
          tag.title = tag.title[lang as keyof typeof tag.title] || tag.title.en;
        }
        return tag;
      });
    }
    return obj;
  });
};

export const getCategoryById = async (id: string, lang: string = 'en'): Promise<any | null> => {
  const category = await Category.findById(id).populate('tags');
  if (!category) return null;

  const obj = category.toObject();
  obj.title = obj.title[lang as keyof typeof obj.title] || obj.title.en;
  obj.description = obj.description[lang as keyof typeof obj.description] || obj.description.en;

  if (obj.tags && Array.isArray(obj.tags)) {
    obj.tags = obj.tags.map((tag: any) => {
      if (tag.title && typeof tag.title === 'object') {
        tag.title = tag.title[lang as keyof typeof tag.title] || tag.title.en;
      }
      return tag;
    });
  }
  return obj;
};
