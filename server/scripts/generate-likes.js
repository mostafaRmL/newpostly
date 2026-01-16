/**
 * Generate Random Likes Script
 * 
 * This script generates random likes for all existing posts.
 * Run with: node scripts/generate-likes.js
 */

require('dotenv').config();
const { pool } = require('../config/database');

async function generateRandomLikes() {
  try {
    console.log('🎲 Starting to generate random likes...\n');

    // Get all posts
    const [posts] = await pool.execute('SELECT post_id FROM posts');
    console.log(`Found ${posts.length} posts\n`);

    // Get all users
    const [users] = await pool.execute('SELECT user_id FROM users');
    console.log(`Found ${users.length} users\n`);

    if (posts.length === 0) {
      console.log('❌ No posts found. Please create some posts first.');
      return;
    }

    if (users.length === 0) {
      console.log('❌ No users found. Please create some users first.');
      return;
    }

    let totalLikes = 0;

    for (const post of posts) {
      // Generate random number of likes (between 0 and 50% of users)
      const maxLikes = Math.floor(users.length * 0.5);
      const numLikes = Math.floor(Math.random() * (maxLikes + 1));

      // Randomly select users to like this post
      const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
      const usersToLike = shuffledUsers.slice(0, numLikes);

      let likesAdded = 0;
      for (const user of usersToLike) {
        try {
          // Insert like
          await pool.execute(
            'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)',
            [post.post_id, user.user_id]
          );
          likesAdded++;
        } catch (error) {
          // Ignore duplicate likes
          if (error.code !== 'ER_DUP_ENTRY') {
            console.error(`Error adding like for post ${post.post_id}:`, error.message);
          }
        }
      }

      // Update likes_count in posts table
      await pool.execute(
        'UPDATE posts SET likes_count = ? WHERE post_id = ?',
        [likesAdded, post.post_id]
      );

      totalLikes += likesAdded;
      console.log(`✅ Post ${post.post_id}: ${likesAdded} likes`);
    }

    console.log(`\n✅ Successfully generated ${totalLikes} total likes across ${posts.length} posts!`);
    console.log(`📊 Average: ${(totalLikes / posts.length).toFixed(1)} likes per post`);

  } catch (error) {
    console.error('❌ Error generating likes:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
generateRandomLikes();

