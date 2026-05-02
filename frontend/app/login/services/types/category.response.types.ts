export interface CategoryResponse {
  _id: string;
  title: string;
  description: string;
  codePrefix: string;
  icon?: string;
  isActive: boolean;
  tags?: { _id: string, title: string, isActive: boolean }[];
  createdAt: string;
  updatedAt: string;
}
