import { db } from './index';
import { categories } from './schema';

/**
 * Default categories to seed
 */
const defaultCategories = [
  { name: 'Food & Dining', icon: '🍔', color: '#FF6B6B', isDefault: true },
  { name: 'Transport', icon: '🚗', color: '#4ECDC4', isDefault: true },
  { name: 'Entertainment', icon: '🎬', color: '#45B7D1', isDefault: true },
  { name: 'Bills & Utilities', icon: '💡', color: '#96CEB4', isDefault: true },
  { name: 'Shopping', icon: '🛍️', color: '#FFEAA7', isDefault: true },
  { name: 'Health & Medical', icon: '🏥', color: '#DDA0DD', isDefault: true },
  { name: 'Education', icon: '📚', color: '#98D8C8', isDefault: true },
  { name: 'Travel', icon: '✈️', color: '#F7DC6F', isDefault: true },
  { name: 'Personal Care', icon: '💅', color: '#BB8FCE', isDefault: true },
  { name: 'Other', icon: '📦', color: '#AEB6BF', isDefault: true },
];

/**
 * Main seed function
 */
async function main() {
  console.log('Starting database seed...');

  // Create default categories (system categories with userId = null)
  for (const category of defaultCategories) {
    try {
      await db.insert(categories).values({
        name: category.name,
        icon: category.icon,
        color: category.color,
        isDefault: category.isDefault,
        userId: null, // System category
      });
      console.log(`✓ Created category: ${category.name}`);
    } catch (error) {
      // Category already exists, skip
      console.log(`⊘ Category might already exist: ${category.name}`);
    }
  }

  console.log('\n✅ Database seeding completed successfully!');
  console.log(`   Created ${defaultCategories.length} default categories`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
