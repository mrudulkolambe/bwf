import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as categoryService from '@/services/backend/category.service';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || undefined;

    const categories = await categoryService.getCategories(lang);
    return NextResponse.json({
      success: true,
      message: 'Categories fetched successfully',
      data: categories
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error fetching categories', data: null }, { status: 500 });
  }
}
