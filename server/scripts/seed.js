/**
 * Database Seeding Script
 * 
 * This script populates the database with:
 * - An admin user (admin@postly.com / admin123)
 * - Sample categories
 * - Sample blog posts
 * 
 * Run with: node scripts/seed.js
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // 1. Create admin user
    console.log('1. Creating admin user...');
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    try {
      await pool.execute(
        `INSERT INTO users (username, email, password, role) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE password = VALUES(password), role = VALUES(role)`,
        ['admin', 'admin@postly.com', hashedPassword, 'admin']
      );
      console.log('   ✅ Admin user created/updated');
      console.log('   📧 Email: admin@postly.com');
      console.log('   🔑 Password: admin123\n');
    } catch (err) {
      if (err.code !== 'ER_DUP_ENTRY') throw err;
      console.log('   ℹ️  Admin user already exists, updating password...');
      await pool.execute(
        'UPDATE users SET password = ?, role = ? WHERE email = ?',
        [hashedPassword, 'admin', 'admin@postly.com']
      );
      console.log('   ✅ Admin password updated\n');
    }

    // 2. Create categories
    console.log('2. Creating categories...');
    const categories = [
      'Technology',
      'Lifestyle',
      'Education',
      'Travel',
      'Food',
      'Health'
    ];

    for (const categoryName of categories) {
      try {
        await pool.execute(
          'INSERT INTO categories (category_name) VALUES (?) ON DUPLICATE KEY UPDATE category_name = category_name',
          [categoryName]
        );
        console.log(`   ✅ Category "${categoryName}" created`);
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') throw err;
      }
    }
    console.log('');

    // 3. Get admin user ID
    const [adminRows] = await pool.execute(
      'SELECT user_id FROM users WHERE email = ?',
      ['admin@postly.com']
    );
    const adminUserId = adminRows[0].user_id;

    // 4. Get category IDs
    const [categoryRows] = await pool.execute('SELECT category_id, category_name FROM categories');
    const categoryMap = {};
    categoryRows.forEach(cat => {
      categoryMap[cat.category_name] = cat.category_id;
    });

    // 5. Create sample posts
    console.log('3. Creating sample blog posts...');
    const samplePosts = [
      {
        title: 'Welcome to Postly - Your New Blogging Platform',
        text: `Welcome to Postly! We're excited to have you here. This is a modern blogging platform built with React.js and Node.js.

Postly allows you to:
- Share your thoughts and ideas
- Connect with a community of writers
- Discover amazing content
- Engage through comments and feedback

Get started by creating your first post or exploring what others have shared. Happy blogging!`,
        category: 'Technology',
        coverUrl: null
      },
      {
        title: 'Getting Started with Modern Web Development',
        text: `Web development has evolved significantly over the years. Today, we have powerful frameworks and libraries that make building web applications easier and more efficient.

**Key Technologies:**
- React.js for building user interfaces
- Node.js for server-side development
- MySQL for data persistence
- Express.js for creating RESTful APIs

Whether you're a beginner or an experienced developer, there's always something new to learn in the world of web development.`,
        category: 'Education',
        coverUrl: null
      },
      {
        title: '10 Tips for a Healthy Lifestyle',
        text: `Maintaining a healthy lifestyle is essential for overall well-being. Here are 10 practical tips:

1. **Stay Hydrated** - Drink plenty of water throughout the day
2. **Eat Balanced Meals** - Include fruits, vegetables, and whole grains
3. **Exercise Regularly** - Aim for at least 30 minutes of physical activity
4. **Get Enough Sleep** - 7-9 hours of quality sleep is recommended
5. **Manage Stress** - Practice meditation or deep breathing exercises
6. **Limit Processed Foods** - Choose whole, natural foods when possible
7. **Stay Social** - Maintain connections with friends and family
8. **Take Breaks** - Rest is important for productivity
9. **Practice Mindfulness** - Be present in the moment
10. **Set Realistic Goals** - Break down big goals into smaller steps

Remember, small changes can lead to big improvements over time!`,
        category: 'Health',
        coverUrl: null
      },
      {
        title: 'The Art of Travel: Exploring New Destinations',
        text: `Traveling opens our minds to new cultures, experiences, and perspectives. Whether you're planning a weekend getaway or a month-long adventure, here's how to make the most of your travels:

**Planning Your Trip:**
- Research your destination thoroughly
- Create a flexible itinerary
- Pack light and smart
- Learn basic phrases in the local language

**During Your Trip:**
- Immerse yourself in local culture
- Try local cuisine
- Meet new people
- Take lots of photos (but also enjoy the moment)

**After Your Trip:**
- Reflect on your experiences
- Share your stories
- Plan your next adventure

Travel is not just about the destination, but the journey itself.`,
        category: 'Travel',
        coverUrl: null
      },
      {
        title: 'Delicious Recipes for Home Cooking',
        text: `Cooking at home is not only healthier but also more economical. Here are some simple yet delicious recipes to try:

**Easy Pasta Recipe:**
- Cook your favorite pasta according to package directions
- Sauté garlic and olive oil in a pan
- Add fresh tomatoes and basil
- Toss with pasta and top with parmesan cheese

**Simple Salad:**
- Mix fresh greens (lettuce, spinach, arugula)
- Add your favorite vegetables
- Drizzle with olive oil and lemon juice
- Season with salt and pepper

**Quick Smoothie:**
- Blend your favorite fruits
- Add yogurt or milk
- Sweeten with honey if needed
- Enjoy immediately

Cooking doesn't have to be complicated. Start with simple recipes and gradually try more complex dishes!`,
        category: 'Food',
        coverUrl: null
      }
    ];

    // Clear existing posts (optional - comment out if you want to keep existing posts)
    // await pool.execute('DELETE FROM posts WHERE user_id = ?', [adminUserId]);

    for (const post of samplePosts) {
      try {
        await pool.execute(
          `INSERT INTO posts (user_id, category_id, post_title, post_text, cover_url) 
           VALUES (?, ?, ?, ?, ?)`,
          [
            adminUserId,
            categoryMap[post.category],
            post.title,
            post.text,
            post.coverUrl
          ]
        );
        console.log(`   ✅ Post "${post.title}" created`);
      } catch (err) {
        console.log(`   ⚠️  Error creating post "${post.title}": ${err.message}`);
      }
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - Admin user: admin@postly.com / admin123');
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Sample posts: ${samplePosts.length}`);
    console.log('\n🚀 You can now login and start using Postly!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the seeding script
seedDatabase();


