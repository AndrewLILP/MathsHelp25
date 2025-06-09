// File: 01backend/utils/migrateUserRoles.js
// Migration script to fix existing user roles

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function migrateUserRoles() {
  try {
    console.log('🔄 Starting user role migration...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get current user statistics
    const totalUsers = await User.countDocuments();
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    console.log('📊 Current user statistics:');
    console.log(`   Total users: ${totalUsers}`);
    usersByRole.forEach(roleGroup => {
      console.log(`   ${roleGroup._id || 'undefined'}: ${roleGroup.count}`);
    });

    // Find users that need migration
    const usersToMigrate = await User.find({
      $or: [
        { role: { $exists: false } },
        { role: null },
        { role: '' },
        { role: { $nin: ['student', 'teacher', 'admin'] } }
      ]
    });

    console.log(`\n🔍 Found ${usersToMigrate.length} users that need migration`);

    if (usersToMigrate.length === 0) {
      console.log('✅ No users need migration!');
      return;
    }

    // Migrate each user
    let migratedCount = 0;
    for (const user of usersToMigrate) {
      const oldRole = user.role;
      let newRole = 'student'; // Default role
      
      // Smart role assignment based on user activity
      if (user.contributedActivities > 0) {
        newRole = 'teacher'; // Has created content
      } else if (user.email && (
        user.email.includes('teacher') || 
        user.email.includes('educator') ||
        user.email.includes('admin')
      )) {
        // Email suggests they're an educator
        newRole = user.email.includes('admin') ? 'admin' : 'teacher';
      } else if (user.mathsSpecialties && user.mathsSpecialties.length > 0) {
        newRole = 'teacher'; // Has teaching specialties
      } else if (user.yearGroups && user.yearGroups.length > 0) {
        newRole = 'teacher'; // Assigned to year groups
      }

      // Special case: preserve admin roles if they exist
      if (oldRole === 'admin' || user.email?.includes('admin')) {
        newRole = 'admin';
      }

      user.role = newRole;
      await user.save();
      
      console.log(`✅ Migrated user: ${user.email}`);
      console.log(`   ${oldRole || 'undefined'} → ${newRole}`);
      migratedCount++;
    }

    // Update statistics after migration
    const newUsersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    console.log('\n📊 Updated user statistics:');
    newUsersByRole.forEach(roleGroup => {
      console.log(`   ${roleGroup._id}: ${roleGroup.count}`);
    });

    console.log(`\n🎉 Migration complete! Migrated ${migratedCount} users.`);

    // Validate migration
    const invalidUsers = await User.find({
      role: { $nin: ['student', 'teacher', 'admin'] }
    });

    if (invalidUsers.length > 0) {
      console.log(`⚠️ Warning: ${invalidUsers.length} users still have invalid roles:`);
      invalidUsers.forEach(user => {
        console.log(`   ${user.email}: ${user.role}`);
      });
    } else {
      console.log('✅ All users now have valid roles!');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('Full error:', error.message);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('📝 Database connection closed');
    }
  }
}

// Dry run function to preview changes without applying them
async function dryRunMigration() {
  try {
    console.log('🔍 DRY RUN: Previewing user role migration...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const usersToMigrate = await User.find({
      $or: [
        { role: { $exists: false } },
        { role: null },
        { role: '' },
        { role: { $nin: ['student', 'teacher', 'admin'] } }
      ]
    });

    console.log(`\n📋 Would migrate ${usersToMigrate.length} users:`);

    for (const user of usersToMigrate) {
      const oldRole = user.role;
      let newRole = 'student';
      
      if (user.contributedActivities > 0) {
        newRole = 'teacher';
      } else if (user.email && (
        user.email.includes('teacher') || 
        user.email.includes('educator') ||
        user.email.includes('admin')
      )) {
        newRole = user.email.includes('admin') ? 'admin' : 'teacher';
      } else if (user.mathsSpecialties && user.mathsSpecialties.length > 0) {
        newRole = 'teacher';
      } else if (user.yearGroups && user.yearGroups.length > 0) {
        newRole = 'teacher';
      }

      if (oldRole === 'admin' || user.email?.includes('admin')) {
        newRole = 'admin';
      }

      console.log(`   ${user.email}: ${oldRole || 'undefined'} → ${newRole}`);
    }

    console.log('\n📝 This was a dry run - no changes were made.');
    console.log('Run "node utils/migrateUserRoles.js" to apply changes.');

  } catch (error) {
    console.error('❌ Dry run failed:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--dry-run') || args.includes('-d')) {
    dryRunMigration();
  } else {
    migrateUserRoles();
  }
}

module.exports = { migrateUserRoles, dryRunMigration };