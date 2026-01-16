/**
 * Generate Sample Comments Script
 * 
 * This script generates random comments for all existing posts.
 * Run with: node scripts/generate-comments.js
 */

require('dotenv').config();
const { pool } = require('../config/database');

async function generateComments() {
  try {
    console.log('💬 Starting to generate sample comments...\n');

    // Get all posts
    const [posts] = await pool.execute('SELECT post_id, post_title FROM posts');
    console.log(`Found ${posts.length} posts\n`);

    // Get all users
    const [users] = await pool.execute('SELECT user_id, username FROM users');
    console.log(`Found ${users.length} users\n`);

    if (posts.length === 0) {
      console.log('❌ No posts found. Please create some posts first.');
      return;
    }

    if (users.length === 0) {
      console.log('❌ No users found. Please create some users first.');
      return;
    }

    // Sample comments to randomly assign
    const sampleComments = [
      'Great post! Really enjoyed reading this.',
      'Thanks for sharing this valuable information.',
      'This is exactly what I was looking for!',
      'Very insightful article. Keep up the good work!',
      'I have a different perspective on this topic.',
      'Could you provide more details about this?',
      'This helped me understand the concept better.',
      'Excellent write-up! Looking forward to more posts.',
      'I found this very helpful. Thank you!',
      'Interesting points. I agree with most of them.',
      'Well written and easy to understand.',
      'This is a great resource. Bookmarked!',
      'I learned something new today. Thanks!',
      'Nice article! The examples were very clear.',
      'This is very relevant to my current situation.',
      'I appreciate the time you took to write this.',
      'Good job explaining this complex topic.',
      'This is one of the best posts I\'ve read on this topic.',
      'I have a question about one of the points mentioned.',
      'Looking forward to reading more from you!',
      'This post changed my perspective. Thank you!',
      'Very informative and well-structured.',
      'I shared this with my team. Great content!',
      'This is exactly what I needed to know.',
      'Clear and concise. Well done!'
    ];

    let totalComments = 0;

    for (const post of posts) {
      // Generate random number of comments (between 0 and 8 per post)
      const numComments = Math.floor(Math.random() * 9);

      // Randomly select users to comment
      const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
      const usersToComment = shuffledUsers.slice(0, numComments);

      let commentsAdded = 0;
      for (const user of usersToComment) {
        try {
          // Randomly select a comment from sample comments
          const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
          
          // Insert comment
          await pool.execute(
            'INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)',
            [post.post_id, user.user_id, randomComment]
          );
          commentsAdded++;
        } catch (error) {
          console.error(`Error adding comment for post ${post.post_id}:`, error.message);
        }
      }

      totalComments += commentsAdded;
      if (commentsAdded > 0) {
        console.log(`✅ Post "${post.post_title.substring(0, 40)}...": ${commentsAdded} comments`);
      }
    }

    console.log(`\n✅ Successfully generated ${totalComments} total comments across ${posts.length} posts!`);
    console.log(`📊 Average: ${(totalComments / posts.length).toFixed(1)} comments per post`);

  } catch (error) {
    console.error('❌ Error generating comments:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
generateComments();

