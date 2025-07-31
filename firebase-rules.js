/**
 * Firestore Security Rules
 * 
 * Copy and paste these rules into your Firebase Console > Firestore Database > Rules
 */

/**
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if user is an admin
    function isAdmin() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Check if user is accessing their own data
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read and update their own profiles
      // Admins can read all profiles and create new ones
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isAdmin();
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Students collection
    match /students/{studentId} {
      // Students can read their own data
      // Admins can perform all operations
      allow read: if isAuthenticated() && (
        isAdmin() || 
        isOwner(resource.data.userId)
      );
      allow create, update, delete: if isAdmin();
    }
    
    // Courses collection
    match /courses/{courseId} {
      // All authenticated users can read courses
      // Only admins can modify courses
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Results collection
    match /results/{resultId} {
      // Students can read their own results
      // Admins can perform all operations
      allow read: if isAuthenticated() && (
        isAdmin() || 
        isOwner(resource.data.userId) || 
        resource.data.isPublic == true
      );
      allow create, update, delete: if isAdmin();
    }
    
    // Inquiries collection
    match /inquiries/{inquiryId} {
      // Anyone can submit an inquiry
      // Only admins can read all inquiries
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
    
    // Toppers collection
    match /toppers/{topperId} {
      // All authenticated users can read toppers
      // Only admins can modify toppers
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Gallery collection
    match /gallery/{itemId} {
      // All authenticated users can read gallery
      // Only admins can modify gallery
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
*/

/**
 * Storage Rules
 * 
 * Copy and paste these rules into your Firebase Console > Storage > Rules
 */

/**
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Function to check if user is an admin
    function isAdmin() {
      return isAuthenticated() && 
        firestore.exists(/databases/(default)/documents/users/$(request.auth.uid)) &&
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Profile images - users can upload their own, admins can upload any
    match /profiles/{userId}/{fileName} {
      allow read: if true;
      allow write: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
    }
    
    // Gallery images - only admins can upload, anyone can view
    match /gallery/{fileName} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Course materials - admins can upload, authenticated users can view
    match /courses/{courseId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Results documents - admins can upload, authenticated users can view their own
    match /results/{resultId}/{fileName} {
      allow read: if isAuthenticated() && (
        isAdmin() || 
        resultId.matches(request.auth.uid + '.*') || 
        firestore.get(/databases/(default)/documents/results/$(resultId)).data.isPublic == true
      );
      allow write: if isAdmin();
    }
  }
}
*/
