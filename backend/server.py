from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from contextlib import asynccontextmanager

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import firebase_admin
from firebase_admin import credentials, firestore

# Firebase connection
cred = credentials.Certificate("acadamy-a1ba9-firebase-adminsdk-fbsvc-b5e32bdf72.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Application starting up...")
    yield
    # Shutdown
    print("Application shutting down...")
    # Firebase admin doesn't need explicit closing

# Create the main app without a prefix
app = FastAPI(lifespan=lifespan)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Define Models
class User(BaseModel):
    email: str
    role: str
    roll_number: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class Student(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    roll_no: str
    course: str
    batch: str
    email: str
    phone: str
    date_of_birth: str  # Format: YYYY-MM-DD

class Course(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    grade: str
    subject: str
    features: List[str]
    price: str
    duration: str
    image: str

class Result(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    exam_name: str
    exam_date: str
    course: str
    batch: str
    results: List[dict]

class Inquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    course: str
    grade: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class GalleryItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str
    image: str

class Topper(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    rank: str
    exam: str
    score: str
    course: str
    testimonial: str
    image: str

# Authentication
@api_router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Check if it's admin login
    if form_data.username == "admin@example.com" and form_data.password == "admin":
        return {"access_token": "fake_admin_token", "token_type": "bearer"}
    
    # Check if it's student login (email + date of birth as password)
    try:
        # Look for student in students collection
        students_ref = db.collection('students').where('email', '==', form_data.username).limit(1).stream()
        for doc in students_ref:
            student_data = doc.to_dict()
            # Check if password matches date of birth (format: YYYY-MM-DD)
            if student_data.get('date_of_birth') == form_data.password:
                # Create a token with student info
                student_token = f"student_{doc.id}_{student_data.get('email')}"
                return {"access_token": student_token, "token_type": "bearer"}
        
        # Also check in users collection for backward compatibility
        users_ref = db.collection('users').where('email', '==', form_data.username).limit(1).stream()
        for doc in users_ref:
            user_data = doc.to_dict()
            # Check if password matches date of birth
            if user_data.get('date_of_birth') == form_data.password:
                student_token = f"student_{doc.id}_{user_data.get('email')}"
                return {"access_token": student_token, "token_type": "bearer"}
        
        raise HTTPException(status_code=400, detail="Incorrect email or date of birth")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Login failed")

@api_router.post("/logout")
async def logout():
    # In a real application, you would invalidate the token
    return {"message": "Successfully logged out"}

@api_router.get("/user", response_model=User)
async def get_user(token: str = Depends(oauth2_scheme)):
    # Handle admin token
    if token == "fake_admin_token":
        return User(email="admin@example.com", role="admin")
    
    # Handle student tokens (format: student_{id}_{email})
    if token.startswith("student_"):
        try:
            parts = token.split("_", 2)
            if len(parts) >= 3:
                student_id = parts[1]
                student_email = parts[2]
                
                # Get student data from Firestore
                doc_ref = db.collection('students').document(student_id)
                doc = doc_ref.get()
                if doc.exists:
                    student_data = doc.to_dict()
                    return User(
                        email=student_email, 
                        role="student", 
                        roll_number=student_data.get('roll_no', 'N/A')
                    )
                
                # Try users collection as fallback
                doc_ref = db.collection('users').document(student_id)
                doc = doc_ref.get()
                if doc.exists:
                    user_data = doc.to_dict()
                    return User(
                        email=student_email, 
                        role="student", 
                        roll_number=user_data.get('roll_no', 'N/A')
                    )
        except Exception:
            pass
    
    raise HTTPException(status_code=401, detail="Invalid token")

# Students
@api_router.get("/students", response_model=List[Student])
async def get_students():
    students_list = []
    
    # Get students from 'students' collection
    students_ref = db.collection('students').stream()
    for doc in students_ref:
        student_data = doc.to_dict()
        student = {
            "id": doc.id,
            "name": student_data.get("name", "N/A"),
            "roll_no": student_data.get("roll_no", "N/A"),
            "course": student_data.get("course", "N/A"),
            "batch": student_data.get("batch", "N/A"),
            "email": student_data.get("email", "N/A"),
            "phone": student_data.get("phone", "N/A"),
            "date_of_birth": student_data.get("date_of_birth", "N/A")
        }
        students_list.append(student)
    
    # Also get students from 'users' collection (for backward compatibility)
    users_ref = db.collection('users').stream()
    for doc in users_ref:
        user_data = doc.to_dict()
        # Only include users that have student-related data
        if user_data.get("course") or user_data.get("roll_no"):
            student = {
                "id": doc.id,
                "name": user_data.get("displayName", user_data.get("name", "N/A")),
                "roll_no": user_data.get("roll_no", "N/A"),
                "course": user_data.get("course", "N/A"),
                "batch": user_data.get("batch", "N/A"),
                "email": user_data.get("email", "N/A"),
                "phone": user_data.get("phone", "N/A"),
                "date_of_birth": user_data.get("date_of_birth", "N/A")
            }
            # Check if this student is not already in the list (avoid duplicates)
            if not any(s['email'] == student['email'] for s in students_list):
                students_list.append(student)
    
    return students_list

@api_router.post("/students", response_model=Student)
async def create_student(student: Student):
    # Create a unique ID for the student
    student_id = str(uuid.uuid4())
    student_data = student.dict()
    student_data['id'] = student_id
    
    # Add to Firestore students collection
    doc_ref = db.collection('students').document(student_id)
    doc_ref.set(student_data)
    
    # Also add to users collection for authentication compatibility
    user_data = {
        'id': student_id,
        'email': student_data['email'],
        'displayName': student_data['name'],
        'name': student_data['name'],
        'roll_no': student_data['roll_no'],
        'course': student_data['course'],
        'batch': student_data['batch'],
        'phone': student_data['phone'],
        'date_of_birth': student_data['date_of_birth'],
        'role': 'student',
        'createdAt': datetime.now().isoformat()
    }
    
    user_doc_ref = db.collection('users').document(student_id)
    user_doc_ref.set(user_data)
    
    return Student(**student_data)

@api_router.put("/students/{id}", response_model=Student)
async def update_student(id: str, student: Student):
    student_data = student.dict()
    student_data['id'] = id
    
    # Update in Firestore students collection
    doc_ref = db.collection('students').document(id)
    doc_ref.update(student_data)
    
    # Also update in users collection for consistency
    user_data = {
        'email': student_data['email'],
        'displayName': student_data['name'],
        'name': student_data['name'],
        'roll_no': student_data['roll_no'],
        'course': student_data['course'],
        'batch': student_data['batch'],
        'phone': student_data['phone'],
        'date_of_birth': student_data['date_of_birth'],
        'role': 'student',
        'updatedAt': datetime.now().isoformat()
    }
    
    user_doc_ref = db.collection('users').document(id)
    # Check if user exists before updating
    if user_doc_ref.get().exists:
        user_doc_ref.update(user_data)
    else:
        user_data['id'] = id
        user_data['createdAt'] = datetime.now().isoformat()
        user_doc_ref.set(user_data)
    
    return Student(**student_data)

@api_router.delete("/students/{id}")
async def delete_student(id: str):
    # Delete from Firestore students collection
    doc_ref = db.collection('students').document(id)
    doc_ref.delete()
    
    # Also delete from users collection
    user_doc_ref = db.collection('users').document(id)
    if user_doc_ref.get().exists:
        user_doc_ref.delete()
    
    return {"message": "Student deleted successfully"}

@api_router.get("/students/me", response_model=Student)
async def get_student_me(token: str = Depends(oauth2_scheme)):
    # In a real application, you would get the student from the token
    # For now, let's query the students collection
    students_ref = db.collection('students').where('email', '==', 'student@example.com').limit(1).stream()
    for doc in students_ref:
        student_data = doc.to_dict()
        student_data['id'] = doc.id
        return Student(**student_data)
    raise HTTPException(status_code=404, detail="Student not found")

# Courses
@api_router.get("/courses", response_model=List[Course])
async def get_courses():
    courses_list = []
    courses_ref = db.collection('courses').stream()
    for doc in courses_ref:
        course_data = doc.to_dict()
        course_data['id'] = doc.id
        courses_list.append(course_data)
    return courses_list

@api_router.get("/courses/{id}", response_model=Course)
async def get_course(id: str):
    doc_ref = db.collection('courses').document(id)
    doc = doc_ref.get()
    if doc.exists:
        course_data = doc.to_dict()
        course_data['id'] = doc.id
        return Course(**course_data)
    raise HTTPException(status_code=404, detail="Course not found")

# Results
@api_router.post("/results", response_model=Result)
async def publish_results(result: Result):
    result_id = str(uuid.uuid4())
    result_data = result.dict()
    result_data['id'] = result_id
    
    doc_ref = db.collection('results').document(result_id)
    doc_ref.set(result_data)
    
    return Result(**result_data)

@api_router.get("/results", response_model=List[Result])
async def get_results():
    results_list = []
    results_ref = db.collection('results').stream()
    for doc in results_ref:
        result_data = doc.to_dict()
        result_data['id'] = doc.id
        results_list.append(result_data)
    return results_list

@api_router.get("/results/{id}", response_model=Result)
async def get_result(id: str):
    doc_ref = db.collection('results').document(id)
    doc = doc_ref.get()
    if doc.exists:
        result_data = doc.to_dict()
        result_data['id'] = doc.id
        return Result(**result_data)
    raise HTTPException(status_code=404, detail="Result not found")

# Inquiries
@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(inquiry: Inquiry):
    inquiry_id = str(uuid.uuid4())
    inquiry_data = inquiry.dict()
    inquiry_data['id'] = inquiry_id
    
    doc_ref = db.collection('inquiries').document(inquiry_id)
    doc_ref.set(inquiry_data)
    
    return Inquiry(**inquiry_data)

@api_router.get("/inquiries", response_model=List[Inquiry])
async def get_inquiries():
    inquiries_list = []
    inquiries_ref = db.collection('inquiries').stream()
    for doc in inquiries_ref:
        inquiry_data = doc.to_dict()
        inquiry_data['id'] = doc.id
        inquiries_list.append(inquiry_data)
    return inquiries_list

# Gallery
@api_router.get("/gallery", response_model=List[GalleryItem])
async def get_gallery():
    gallery_list = []
    gallery_ref = db.collection('gallery').stream()
    for doc in gallery_ref:
        gallery_data = doc.to_dict()
        gallery_data['id'] = doc.id
        gallery_list.append(gallery_data)
    return gallery_list

# Toppers
@api_router.get("/toppers", response_model=List[Topper])
async def get_toppers():
    toppers_list = []
    toppers_ref = db.collection('toppers').stream()
    for doc in toppers_ref:
        topper_data = doc.to_dict()
        topper_data['id'] = doc.id
        toppers_list.append(topper_data)
    return toppers_list

# Test endpoint to verify student login functionality
@api_router.post("/test-student-login")
async def test_student_login(email: str, date_of_birth: str):
    """Test endpoint to verify if a student can login with email and date of birth"""
    try:
        # Check students collection
        students_ref = db.collection('students').where('email', '==', email).limit(1).stream()
        for doc in students_ref:
            student_data = doc.to_dict()
            if student_data.get('date_of_birth') == date_of_birth:
                return {
                    "success": True, 
                    "message": "Student login credentials are valid",
                    "student": {
                        "id": doc.id,
                        "name": student_data.get('name'),
                        "email": student_data.get('email'),
                        "roll_no": student_data.get('roll_no')
                    }
                }
        
        # Check users collection
        users_ref = db.collection('users').where('email', '==', email).limit(1).stream()
        for doc in users_ref:
            user_data = doc.to_dict()
            if user_data.get('date_of_birth') == date_of_birth:
                return {
                    "success": True, 
                    "message": "Student login credentials are valid (from users collection)",
                    "student": {
                        "id": doc.id,
                        "name": user_data.get('name', user_data.get('displayName')),
                        "email": user_data.get('email'),
                        "roll_no": user_data.get('roll_no')
                    }
                }
        
        return {"success": False, "message": "Invalid email or date of birth"}
    except Exception as e:
        return {"success": False, "message": f"Error: {str(e)}"}

# Add a root endpoint for the main app
@app.get("/")
async def root():
    return {"message": "Welcome to the Hosur Academy API"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)