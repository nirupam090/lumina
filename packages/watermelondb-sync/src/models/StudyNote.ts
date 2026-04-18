import { Model } from '@nozbe/watermelondb';
import { text, field, date } from '@nozbe/watermelondb/decorators';

export class StudyNote extends Model {
  static table = 'study_notes';

  // Defines explicit preservation of OCR Markdown tokens offline securely
  @text('title') title: string;
  @text('markdown_content') markdownContent: string;
  @text('original_image_path') originalImagePath: string;
  
  @date('created_at') createdAt: number;
}
