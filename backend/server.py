from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
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

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    yield
    # Shutdown
    client.close()

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
    # In a real application, you would verify the username and password against a database
    # For this example, we'll use a mock implementation
    if form_data.username == "admin@example.com" and form_data.password == "admin":
        return {"access_token": "fake_admin_token", "token_type": "bearer"}
    elif "student" in form_data.username:
        return {"access_token": "fake_student_token", "token_type": "bearer"}
    else:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

@api_router.post("/logout")
async def logout():
    # In a real application, you would invalidate the token
    return {"message": "Successfully logged out"}

@api_router.get("/user", response_model=User)
async def get_user(token: str = Depends(oauth2_scheme)):
    # In a real application, you would decode the token and get the user
    if token == "fake_admin_token":
        return User(email="admin@example.com", role="admin")
    elif token == "fake_student_token":
        return User(email="student@example.com", role="student", roll_number="2025JEE0001")
    else:
        raise HTTPException(status_code=401, detail="Invalid token")

# Students
@api_router.get("/students", response_model=List[Student])
async def get_students():
    students = await db.students.find().to_list(1000)
    return students

@api_router.post("/students", response_model=Student)
async def create_student(student: Student):
    await db.students.insert_one(student.dict())
    return student

@api_router.put("/students/{id}", response_model=Student)
async def update_student(id: str, student: Student):
    await db.students.update_one({"id": id}, {"$set": student.dict()})
    return student

@api_router.delete("/students/{id}")
async def delete_student(id: str):
    await db.students.delete_one({"id": id})
    return {"message": "Student deleted successfully"}

@api_router.get("/students/me", response_model=Student)
async def get_student_me(token: str = Depends(oauth2_scheme)):
    # In a real application, you would get the student from the token
    student = await db.students.find_one({"email": "student@example.com"})
    if student:
        return student
    raise HTTPException(status_code=404, detail="Student not found")

# Courses
@api_router.get("/courses", response_model=List[Course])
async def get_courses():
    courses = await db.courses.find().to_list(1000)
    return courses

@api_router.get("/courses/{id}", response_model=Course)
async def get_course(id: str):
    course = await db.courses.find_one({"id": id})
    if course:
        return course
    raise HTTPException(status_code=404, detail="Course not found")

# Results
@api_router.post("/results", response_model=Result)
async def publish_results(result: Result):
    await db.results.insert_one(result.dict())
    return result

@api_router.get("/results", response_model=List[Result])
async def get_results():
    results = await db.results.find().to_list(1000)
    return results

@api_router.get("/results/{id}", response_model=Result)
async def get_result(id: str):
    result = await db.results.find_one({"id": id})
    if result:
        return result
    raise HTTPException(status_code=404, detail="Result not found")

# Inquiries
@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(inquiry: Inquiry):
    await db.inquiries.insert_one(inquiry.dict())
    return inquiry

@api_router.get("/inquiries", response_model=List[Inquiry])
async def get_inquiries():
    inquiries = await db.inquiries.find().to_list(1000)
    return inquiries

# Gallery
@api_router.get("/gallery", response_model=List[GalleryItem])
async def get_gallery():
    gallery = await db.gallery.find().to_list(1000)
    return gallery

# Toppers
@api_router.get("/toppers", response_model=List[Topper])
async def get_toppers():
    toppers = await db.toppers.find().to_list(1000)
    return toppers

# Add a root endpoint for the main app
@app.get("/")
async def root():
    return {"message": "Welcome to the Hosur Academy API"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)