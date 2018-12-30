import { Category } from './category';
import {User} from "./user";

export class Book {
  id: string;
  userId: number;
  title: string;
  author: string;
  imageBytes: string;
  imageName: string;
  imageUrl: string;
  imageSlug: string;
  approved: boolean;
  categoryId: number;
  freightOption: string;
  category: Category;
  user: User;
  synopsis: string;
  totalInterested: number;
  daysInShowcase: number;

  static freightLabels = {
    City: 'Cidade',
    State: 'Estado',
    Country: 'País',
    World: 'Mundo',
    WithoutFreight: 'Não',
  };
}
