import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/category.model';
import Tag from '../models/tag.model';

dotenv.config();

const tagsData = [
  {
    title: {
      en: 'online payment',
      hi: 'ऑनलाइन भुगतान',
      mr: 'ऑनलाइन पेमेंट'
    }
  },
  {
    title: {
      en: 'tubeless tyre',
      hi: 'ट्यूबलेस टायर',
      mr: 'ट्युबलेस टायर'
    }
  },
  {
    title: {
      en: 'tube tyre',
      hi: 'ट्यूब टायर',
      mr: 'ट्युब टायर'
    }
  },
  {
    title: {
      en: '24/7 service',
      hi: '24/7 सेवा',
      mr: '24/7 सेवा'
    }
  },
  {
    title: {
      en: 'home visit',
      hi: 'होम विजिट',
      mr: 'होम व्हिजिट'
    }
  }
];

const categoriesData = [
  {
    title: {
      en: 'Tyre Puncture Mechanic [TPM]',
      hi: 'टायर पंचर मैकेनिक [TPM]',
      mr: 'टायर पंचर मेकॅनिक [TPM]'
    },
    description: {
      en: 'Professional tyre repair and puncture services for all vehicle types.',
      hi: 'सभी प्रकार के वाहनों के लिए पेशेवर टायर मरम्मत और पंचर सेवाएं।',
      mr: 'सर्व प्रकारच्या वाहनांसाठी व्यावसायिक टायर दुरुस्ती आणि पंचर सेवा.'
    },
    codePrefix: 'TPM',
    tagNames: ['online payment', 'tubeless tyre', 'tube tyre', '24/7 service', 'home visit'],
    isActive: true
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bwf');
    console.log('Connected to MongoDB for seeding...');

    // 1. Seed Tags
    const tagMap: { [key: string]: any } = {};
    for (const tag of tagsData) {
      const savedTag = await Tag.findOneAndUpdate(
        { 'title.en': tag.title.en },
        tag,
        { upsert: true, new: true }
      );
      tagMap[tag.title.en] = savedTag._id;
    }
    console.log('Tags seeded successfully!');

    // 2. Seed Categories
    for (const cat of categoriesData) {
      const tagIds = cat.tagNames.map(name => tagMap[name]);
      const { tagNames, ...categoryToSave } = cat;
      
      await Category.findOneAndUpdate(
        { 'title.en': cat.title.en },
        { ...categoryToSave, tags: tagIds },
        { upsert: true, new: true }
      );
    }

    console.log('Categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
