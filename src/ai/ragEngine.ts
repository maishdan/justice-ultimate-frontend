import Fuse from 'fuse.js';
import carFAQs from '../data/faqData.json';

const fuse = new Fuse(carFAQs, {
  keys: ['question', 'tags'],
  threshold: 0.3,
});

export const searchKnowledgeBase = (query: string): string | null => {
  const results = fuse.search(query);
  return results.length ? results[0].item.answer : null;
};
