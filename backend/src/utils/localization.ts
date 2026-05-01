export const localize = (obj: any, lang: string): any => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item: any) => localize(item, lang));
  }

  const keys = Object.keys(obj);
  if (keys.includes('en') && keys.includes('hi') && keys.includes('mr')) {
    return obj[lang] || obj['en'];
  }

  const result: any = {};
  for (const key in obj) {
    const value = obj[key];

    if (value && typeof value === 'object') {
      if (value._bsontype || value.constructor.name === 'ObjectId') {
        result[key] = value;
      } else {
        result[key] = localize(value, lang);
      }
    } else {
      result[key] = value;
    }
  }

  return result;
};
