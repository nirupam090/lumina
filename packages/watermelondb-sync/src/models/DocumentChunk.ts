import { Model } from '@nozbe/watermelondb';
import { text, field, date } from '@nozbe/watermelondb/decorators';

export class DocumentChunk extends Model {
  // Bound explicitly into the Sharded SQLite 'lumina_vectors.db'
  static table = 'document_chunks';

  @text('note_id') noteId: string;
  
  @text('text_chunk') textChunk: string;
  @text('embedding_vector') embeddingVector: string; // mathematical arrays converted structurally manually

  @field('token_count') tokenCount: number; // Cap securely enforced natively ~500
  
  @date('created_at') createdAt: number; // Critical for 120-Day sweeping CRON
}
