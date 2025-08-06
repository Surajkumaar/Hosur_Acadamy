import { db } from './firebase';
import { collection, query, where, orderBy, getDocs, addDoc, Timestamp } from 'firebase/firestore';

/**
 * Service for managing exam results in Firebase
 */

// Test function to validate data before sending to Firebase
export const validateDataForFirebase = (data) => {
  const errors = [];
  
  const checkValue = (value, path) => {
    if (value === undefined) {
      errors.push(`Undefined value found at: ${path}`);
    } else if (value === null) {
      console.warn(`Null value found at: ${path}`);
    } else if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          checkValue(item, `${path}[${index}]`);
        });
      } else {
        Object.keys(value).forEach(key => {
          checkValue(value[key], `${path}.${key}`);
        });
      }
    }
  };
  
  checkValue(data, 'root');
  return errors;
};

// Test function for your CSV format
export const testCSVProcessing = () => {
  const sampleCSVData = [
    { 
      'Student Name': 'test1', 
      'Email': 'test1@gmail.com', 
      'Maths': '63', 
      'Physics': '64', 
      'Chemistry': '65', 
      'Total Marks': '192' 
    },
    { 
      'Student Name': 'test2', 
      'Email': 'test2@gmail.com', 
      'Maths': '66', 
      'Physics': '67', 
      'Chemistry': '68', 
      'Total Marks': '201' 
    }
  ];
  
  console.log('Testing CSV processing with your format...');
  console.log('Sample input:', sampleCSVData);
  
  // This is how your data will be processed
  const processed = sampleCSVData.map((row, i) => {
    const rollNumber = row['Email'] || `STU${i + 1}`;
    const studentName = row['Student Name'];
    const totalMarks = parseInt(row['Total Marks'] || '0');
    const physics = parseInt(row['Physics'] || '0');
    const chemistry = parseInt(row['Chemistry'] || '0');
    const mathematics = parseInt(row['Maths'] || '0');
    const percentage = ((totalMarks / 300) * 100).toFixed(2);
    
    return {
      rollNumber,
      studentName,
      totalMarks,
      percentage: parseFloat(percentage),
      rank: 0, // Will be calculated during sorting
      physics,
      chemistry,
      mathematics
    };
  });
  
  console.log('Processed output:', processed);
  return processed;
};

// Helper function to validate and clean data before Firebase operations
const validateAndCleanData = (data) => {
  if (data === undefined || data === null) {
    return null;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => validateAndCleanData(item)).filter(item => item !== null);
  }
  
  if (typeof data === 'object' && !(data instanceof Date) && !(data instanceof Timestamp)) {
    const cleaned = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      const cleanedValue = validateAndCleanData(value);
      
      // Only include non-null values
      if (cleanedValue !== null && cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    });
    return cleaned;
  }
  
  // For primitive values, return as-is unless undefined
  return data === undefined ? null : data;
};

// Helper function to ensure no undefined values in Firebase data
const deepRemoveUndefined = (obj) => {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(deepRemoveUndefined).filter(item => item !== null && item !== undefined);
  }
  
  if (typeof obj === 'object' && !(obj instanceof Date) && !(obj instanceof Timestamp)) {
    const result = {};
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (value !== undefined && value !== null) {
        const cleanValue = deepRemoveUndefined(value);
        if (cleanValue !== undefined && cleanValue !== null) {
          result[key] = cleanValue;
        }
      }
    });
    return result;
  }
  
  return obj;
};

export const publishResults = async (examDetails, results) => {
  try {
    console.log('=== PUBLISHING RESULTS TO FIREBASE ===');
    console.log('Raw examDetails:', examDetails);
    console.log('Raw results:', results);
    console.log('Type of results:', typeof results, 'Is Array:', Array.isArray(results));
    
    // Validate input data first
    if (!examDetails || typeof examDetails !== 'object') {
      throw new Error('Invalid examDetails: must be an object');
    }
    
    if (!results || !Array.isArray(results) || results.length === 0) {
      throw new Error('Invalid results: must be a non-empty array');
    }
    
    // Helper function to completely sanitize any value for Firebase
    const sanitizeForFirebase = (value, expectedType = 'string') => {
      console.log(`Sanitizing: "${value}" (type: ${typeof value}) -> ${expectedType}`);
      
      // Handle null, undefined, empty values
      if (value === undefined || value === null || value === '') {
        const defaultValue = expectedType === 'number' ? 0 : '';
        console.log(`Converted undefined/null/empty to: ${defaultValue}`);
        return defaultValue;
      }
      
      // Handle numbers
      if (expectedType === 'number') {
        const num = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
        const result = isNaN(num) ? 0 : num;
        console.log(`Number conversion: "${value}" -> ${result}`);
        return result;
      }
      
      // Handle strings
      const result = String(value).trim();
      console.log(`String conversion: "${value}" -> "${result}"`);
      return result;
    };
    
    // Create the simplest possible data structure
    const firebaseData = {
      examName: sanitizeForFirebase(examDetails.examName, 'string') || 'Test Exam',
      examDate: sanitizeForFirebase(examDetails.examDate, 'string') || '2025-08-03',
      course: sanitizeForFirebase(examDetails.course, 'string') || 'General',
      batch: sanitizeForFirebase(examDetails.batch, 'string') || '2025',
      publishedAt: new Date().toISOString(), // Use ISO string instead of Timestamp
      publishedBy: 'admin',
      totalStudents: results.length,
      results: []
    };
    
    console.log('Base Firebase data created:', firebaseData);
    
    // Process each student with extreme care
    for (let i = 0; i < results.length; i++) {
      const student = results[i];
      console.log(`\n--- Processing Student ${i + 1} ---`);
      console.log('Raw student data:', student);
      
      if (!student || typeof student !== 'object') {
        console.warn(`Skipping invalid student data at index ${i}`);
        continue;
      }
      
      // Create the simplest possible student record
      const studentRecord = {
        id: i + 1,
        rollNumber: '',
        studentName: '',
        totalMarks: 0,
        percentage: 0,
        rank: 0,
        physics: 0,
        chemistry: 0,
        mathematics: 0
      };
      
      // Extract and sanitize each field individually
      try {
        // Roll Number - try multiple possibilities
        const rollOptions = [
          student['Roll Number'],
          student['Roll No'], 
          student.rollNumber,
          student.Email,
          student.email,
          `STU${i + 1}`
        ];
        for (const option of rollOptions) {
          if (option && option !== undefined && option !== null) {
            studentRecord.rollNumber = sanitizeForFirebase(option, 'string');
            break;
          }
        }
        
        // Student Name
        const nameOptions = [
          student['Student Name'],
          student.Name,
          student.studentName,
          student.name,
          `Student ${i + 1}`
        ];
        for (const option of nameOptions) {
          if (option && option !== undefined && option !== null) {
            studentRecord.studentName = sanitizeForFirebase(option, 'string');
            break;
          }
        }
        
        // Total Marks
        const totalOptions = [
          student['Total Marks'],
          student.Total,
          student.totalMarks,
          student['Total Score']
        ];
        for (const option of totalOptions) {
          if (option && option !== undefined && option !== null) {
            studentRecord.totalMarks = sanitizeForFirebase(option, 'number');
            break;
          }
        }
        
        // Individual subjects
        studentRecord.physics = sanitizeForFirebase(
          student.Physics || student.physics || student.PHY || 0, 'number'
        );
        studentRecord.chemistry = sanitizeForFirebase(
          student.Chemistry || student.chemistry || student.CHEM || 0, 'number'
        );
        studentRecord.mathematics = sanitizeForFirebase(
          student.Maths || student.Mathematics || student.mathematics || student.MATH || 0, 'number'
        );
        
        // Calculate totals if missing
        if (studentRecord.totalMarks === 0) {
          studentRecord.totalMarks = studentRecord.physics + studentRecord.chemistry + studentRecord.mathematics;
        }
        
        // Calculate percentage
        if (studentRecord.totalMarks > 0) {
          studentRecord.percentage = sanitizeForFirebase(((studentRecord.totalMarks / 300) * 100).toFixed(2), 'number');
        }
        
        // Set rank (will be recalculated after sorting)
        studentRecord.rank = sanitizeForFirebase(student.Rank || student.rank || (i + 1), 'number');
        
        console.log('Processed student record:', studentRecord);
        
        // Validate required fields
        if (!studentRecord.rollNumber || !studentRecord.studentName) {
          throw new Error(`Student ${i + 1} missing required data - Roll: "${studentRecord.rollNumber}", Name: "${studentRecord.studentName}"`);
        }
        
        // Final check for undefined values in this record
        Object.keys(studentRecord).forEach(key => {
          if (studentRecord[key] === undefined) {
            console.error(`FIXING: Found undefined value in ${key} for student ${i + 1}`);
            studentRecord[key] = typeof studentRecord[key] === 'number' ? 0 : '';
          }
        });
        
        firebaseData.results.push(studentRecord);
        
      } catch (error) {
        console.error(`Error processing student ${i + 1}:`, error);
        throw new Error(`Failed to process student ${i + 1}: ${error.message}`);
      }
    }
    
    // Sort by total marks and update ranks
    firebaseData.results.sort((a, b) => b.totalMarks - a.totalMarks);
    firebaseData.results.forEach((student, index) => {
      student.rank = index + 1;
    });
    
    console.log('\n=== FINAL FIREBASE DATA ===');
    console.log('Complete data structure:');
    console.log(JSON.stringify(firebaseData, null, 2));
    
    // Ultra-safe undefined check
    const checkForUndefined = (obj, path = '') => {
      if (obj === undefined) {
        throw new Error(`Found undefined at path: ${path}`);
      }
      if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach(key => {
          checkForUndefined(obj[key], path ? `${path}.${key}` : key);
        });
      }
    };
    
    try {
      checkForUndefined(firebaseData);
      console.log('✅ No undefined values found in final data');
    } catch (error) {
      console.error('❌ Undefined check failed:', error);
      throw error;
    }
    
    // Save to Firebase with the simplest possible approach
    console.log('Attempting Firebase save...');
    const docRef = await addDoc(collection(db, 'examResults'), firebaseData);
    console.log('✅ SUCCESS! Document saved with ID:', docRef.id);
    
    return { success: true, id: docRef.id };
    
  } catch (error) {
    console.error('❌ COMPLETE ERROR DETAILS:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error cause:', error.cause);
    throw new Error(`Failed to publish results: ${error.message}`);
  }
};

export const getStudentResults = async (rollNumber) => {
  try {
    console.log('Fetching results for roll number:', rollNumber);
    
    // Query all exam results ordered by published date (newest first)
    const resultsQuery = query(
      collection(db, 'examResults'),
      orderBy('publishedAt', 'desc')
    );
    
    const snapshot = await getDocs(resultsQuery);
    console.log(`Found ${snapshot.size} published exam(s) in database`);
    
    const studentResults = [];
    let studentInfo = null;
    const allAvailableRollNumbers = new Set();
    
    snapshot.forEach((doc) => {
      const examData = doc.data();
      console.log(`Checking exam: ${examData.examName || 'Untitled'} with ${examData.results?.length || 0} students`);
      
      // Ensure examData has results array
      if (!examData.results || !Array.isArray(examData.results)) {
        console.warn('Exam data missing results array:', doc.id);
        return;
      }
      
      // Collect all available roll numbers for debugging
      examData.results.forEach(result => {
        if (result.rollNumber) {
          allAvailableRollNumbers.add(result.rollNumber);
        }
      });
      
      // Find this student's result in each exam
      const studentResult = examData.results.find(
        result => {
          if (!result || !result.rollNumber) return false;
          const studentRoll = result.rollNumber.toString().toLowerCase().trim();
          const searchRoll = rollNumber.toString().toLowerCase().trim();
          return studentRoll === searchRoll;
        }
      );
      
      if (studentResult) {
        console.log(`✅ Found result for ${rollNumber} in exam: ${examData.examName}`);
        
        // Set student info from first found result
        if (!studentInfo) {
          studentInfo = {
            name: studentResult.studentName || 'Unknown Student',
            rollNumber: rollNumber,
            course: examData.course || 'Unknown Course',
            batch: examData.batch || 'Unknown Batch'
          };
        }
        
        studentResults.push({
          id: doc.id,
          examName: examData.examName || 'Untitled Exam',
          examDate: examData.examDate || new Date().toISOString().split('T')[0],
          course: examData.course || 'Unknown Course',
          batch: examData.batch || 'Unknown Batch',
          publishedAt: examData.publishedAt,
          subjects: {
            Physics: studentResult.physics || 0,
            Chemistry: studentResult.chemistry || 0,
            Mathematics: studentResult.mathematics || 0
          },
          totalMarks: studentResult.totalMarks || 0,
          percentage: studentResult.percentage || 0,
          rank: studentResult.rank || 'N/A',
          totalStudents: examData.results.length || 0
        });
      }
    });
    
    // Show debugging info about available roll numbers
    const availableRolls = Array.from(allAvailableRollNumbers);
    console.log(`Available roll numbers in database (${availableRolls.length}):`, availableRolls);
    console.log(`Searched for: "${rollNumber}"`);
    console.log(`Found ${studentResults.length} results for this student`);
    
    if (studentResults.length === 0 && availableRolls.length > 0) {
      console.log('💡 Suggestion: Try searching with one of the available roll numbers above');
    }
    
    return {
      studentInfo,
      results: studentResults
    };
    
  } catch (error) {
    console.error('Error fetching student results:', error);
    throw new Error(`Failed to fetch results: ${error.message}`);
  }
};

export const getAllResultsForRankings = async (course, batch) => {
  try {
    console.log(`Fetching rankings data for course: ${course}, batch: ${batch}`);
    
    // Simplified query - just get all exam results and filter in memory
    // This avoids the need for composite indexes
    const resultsQuery = query(
      collection(db, 'examResults'),
      orderBy('publishedAt', 'desc')
    );
    
    const snapshot = await getDocs(resultsQuery);
    let latestResults = null;
    
    // Filter results in memory to find matching course/batch
    snapshot.forEach((doc) => {
      const examData = doc.data();
      
      // Check if this exam matches the course and batch
      if (examData.course === course && examData.batch === batch) {
        if (!latestResults) {
          latestResults = {
            id: doc.id,
            ...examData
          };
        }
      }
    });
    
    console.log('Found rankings data:', latestResults ? 'Yes' : 'No');
    return latestResults;
    
  } catch (error) {
    console.error('Error fetching rankings:', error);
    
    // If there's still an error, return null instead of throwing
    // This allows the student dashboard to work even without rankings
    console.warn('Rankings fetch failed, continuing without rankings data');
    return null;
  }
};

// Alternative function that doesn't use orderBy at all
export const getSimpleRankingsData = async (course, batch) => {
  try {
    console.log(`Getting simple rankings for course: ${course}, batch: ${batch}`);
    
    // Use the simplest possible query - no orderBy, no where clauses
    const snapshot = await getDocs(collection(db, 'examResults'));
    
    let matchingExam = null;
    let latestDate = null;
    
    snapshot.forEach((doc) => {
      const examData = doc.data();
      
      // Check if this exam matches the course and batch
      if (examData.course === course && examData.batch === batch) {
        const examDate = new Date(examData.publishedAt || examData.examDate || '2025-01-01');
        
        if (!latestDate || examDate > latestDate) {
          latestDate = examDate;
          matchingExam = {
            id: doc.id,
            ...examData
          };
        }
      }
    });
    
    console.log('Simple rankings data found:', matchingExam ? 'Yes' : 'No');
    return matchingExam;
    
  } catch (error) {
    console.error('Error in simple rankings fetch:', error);
    return null;
  }
};

export const getSubjectToppers = (results, subject) => {
  if (!results || !Array.isArray(results)) return [];
  
  const subjectKey = subject.toLowerCase();
  
  return results
    .map(result => ({
      name: result.studentName || 'Unknown Student',
      rollNumber: result.rollNumber || 'Unknown',
      marks: result[subjectKey] || 0
    }))
    .filter(student => student.marks > 0)
    .sort((a, b) => b.marks - a.marks)
    .slice(0, 3);
};

export const calculateOverallToppers = (results) => {
  if (!results || !Array.isArray(results)) return [];
  
  return results
    .filter(result => (result.totalMarks || 0) > 0)
    .sort((a, b) => (b.totalMarks || 0) - (a.totalMarks || 0))
    .slice(0, 3)
    .map(result => ({
      name: result.studentName || 'Unknown Student',
      rollNo: result.rollNumber || 'Unknown',
      totalMarks: result.totalMarks || 0,
      percentage: result.percentage || 0
    }));
};
