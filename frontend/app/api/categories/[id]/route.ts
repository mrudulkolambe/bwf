import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as categoryService from '@/services/backend/category.service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || undefined;

    const category = await categoryService.getCategoryById(id, lang);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found', data: null }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: 'Category fetched successfully',
      data: category
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error fetching category', data: null }, { status: 500 });
  }
}
