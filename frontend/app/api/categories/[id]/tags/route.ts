import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/category.model';
import Tag from '@/models/tag.model';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    console.log(id)

    const { searchParams } = new URL(req.url);
    const lang = (searchParams.get('lang') || 'en') as 'en' | 'hi' | 'mr';

    const category = await Category.findById(id).populate('tags');

    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found', data: null }, { status: 404 });
    }


    const transformedTags = category?.tags?.map((tag: any) => ({
      _id: tag._id,
      title: tag.title[lang] || tag.title['en'],
      isActive: tag.isActive
    })).filter((tag: any) => tag.isActive);

    return NextResponse.json({
      success: true,
      message: 'Tags fetched successfully',
      data: transformedTags
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error fetching tags', data: null }, { status: 500 });
  }
}
