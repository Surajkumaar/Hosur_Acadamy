import { 
  db,
  doc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from './firebase';

// Collection references
const studentsRef = collection(db, 'students');
const coursesRef = collection(db, 'courses');
const resultsRef = collection(db, 'results');
const inquiriesRef = collection(db, 'inquiries');
const toppersRef = collection(db, 'toppers');
const galleryRef = collection(db, 'gallery');

// Helper to convert Firestore document to object with ID
const docWithId = (doc) => {
  return { id: doc.id, ...doc.data() };
};

// Students
export const getStudents = async () => {
  const snapshot = await getDocs(studentsRef);
  return snapshot.docs.map(docWithId);
};

export const getStudentById = async (id) => {
  const docRef = doc(db, 'students', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docWithId(docSnap);
  } else {
    throw new Error('Student not found');
  }
};

export const addStudent = async (data) => {
  const docRef = await addDoc(studentsRef, {
    ...data,
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...data };
};

export const updateStudent = async (id, data) => {
  const docRef = doc(db, 'students', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
  return { id, ...data };
};

export const deleteStudent = async (id) => {
  const docRef = doc(db, 'students', id);
  await deleteDoc(docRef);
  return { id };
};

// Courses
export const getCourses = async () => {
  const snapshot = await getDocs(coursesRef);
  return snapshot.docs.map(docWithId);
};

export const getCourseById = async (id) => {
  const docRef = doc(db, 'courses', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docWithId(docSnap);
  } else {
    throw new Error('Course not found');
  }
};

export const addCourse = async (data) => {
  const docRef = await addDoc(coursesRef, {
    ...data,
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...data };
};

// Results
export const publishResults = async (resultData) => {
  const docRef = await addDoc(resultsRef, {
    ...resultData,
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...resultData };
};

export const getResults = async () => {
  const snapshot = await getDocs(resultsRef);
  return snapshot.docs.map(docWithId);
};

export const getStudentResults = async (studentId) => {
  const q = query(resultsRef, where("studentId", "==", studentId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docWithId);
};

// Inquiries
export const submitInquiry = async (inquiryData) => {
  const docRef = await addDoc(inquiriesRef, {
    ...inquiryData,
    status: 'pending',
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...inquiryData };
};

export const getInquiries = async () => {
  const snapshot = await getDocs(inquiriesRef);
  return snapshot.docs.map(docWithId);
};

// Toppers
export const getToppers = async () => {
  const q = query(toppersRef, orderBy('score', 'desc'), limit(10));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docWithId);
};

export const addTopper = async (topperData) => {
  const docRef = await addDoc(toppersRef, {
    ...topperData,
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...topperData };
};

// Gallery
export const getGallery = async () => {
  const snapshot = await getDocs(galleryRef);
  return snapshot.docs.map(docWithId);
};

export const addGalleryItem = async (galleryData) => {
  const docRef = await addDoc(galleryRef, {
    ...galleryData,
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...galleryData };
};
