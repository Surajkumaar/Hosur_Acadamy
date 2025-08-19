// Updated mock data for Hosur Toppers Academy based on questionnaire responses
export const mockData = {
  institute: {
    name: "Hosur Toppers Academy",
    tagline: "Source of knowledge",
    phone: "+91-8248637277",
    whatsapp: "+91-8248637277",
    email: "hosurtoppersacademy@gmail.com", // Kept from mock data as it wasn't in the questionnaire
    address: "4/717, 5th Cross Rd, opp. Sivaranjani Hotel, Maruthi Nagar, Hosur, Tamil Nadu 635126" // Kept from mock data as it's more complete
  },
  
courses: [
  {
    id: 1,
    title: "Foundation Courses (Classes 9 & 10)",
    description: "We focus on coaching basic concepts clearly to build a strong base in Physics, Chemistry, and Math for our students.",
    grade: "9th-10th",
    subject: "Physics, Chemistry, Mathematics",
    duration: "1 Year",
    image: "https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=400&h=300&fit=crop",
    features: ["Activity-Based Teaching", "Regular Worksheets & Quizzes", "Personalized Attention", "Parent Meetings"]
  },
  {
    id: 2,
    title: "Senior Secondary (Classes 11 & 12)",
    description: "Specialized coaching in Physics, Chemistry, and Math covering the complete syllabus for both CBSE and ICSE boards.",
    grade: "11th-12th",
    subject: "Physics, Chemistry, Mathematics",
    duration: "1-2 Years",
    image: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&h=300&fit=crop",
    features: ["Live Classes", "Regular Tests", "One-to-one Doubt Sessions", "Printed Notes"]
  },
  {
    id: 3,
    title: "NEET & JEE Preparation",
    description: "Launching our new program for medical and engineering aspirants, built upon our 23 years of foundation course excellence.",
    grade: "11th-12th",
    subject: "Physics, Chemistry, Math & Biology",
    duration: "1-2 Years",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    features: ["Expert Faculty", "Comprehensive Mock Tests", "Doubt Clearing Sessions", "Updated Study Material"]
  }
],
  
  testimonials: [
    {
      id: 1,
      name: "Dr. Yamanth",
      course: "Class 10 Foundation",
      rating: 5,
      text: "The academy's focus on building a strong conceptual base was key. Their guidance helped me achieve a perfect 10 CGPA and paved my way into the medical field.",
    },
    {
      id: 2,
      name: "Mrithun Dharsha",
      course: "Class 10 Board Preparation",
      rating: 5,
      text: "Thanks to the constant practice with worksheets and regular tests, I felt completely prepared and confident. Scoring 480/500 was a dream come true!",
    },
    {
      id: 3,
      name: "A Proud Parent",
      course: "Alumni",
      rating: 5,
      text: "As a teacher, I was recently invited to a student's doctorate ceremony. Seeing our alumni like Dr. Sri Raksha, Dr. Merlin, and so many others succeed is the biggest reward. This academy truly builds futures.",
    }
  ],
  
  toppers: [
    {
      id: 1,
      name: "Mrithun Dharsha",
      exam: "Class 10 Board Exam",
      rank: "Top Scorer",
      score: "480/500",
      course: "Class 10 Board Preparation",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      testimonial: "The teachers create a great competitive environment with leaderboards and provide amazing, easy-to-understand printed notes."
      
    },
    {
      id: 2,
      name: "Dr. Yamanth",
      exam: "Class 10 Board Exam (2018)",
      rank: "Top Scorer",
      score: "10 CGPA",
      course: "Class 10 Foundation",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      testimonial: "The one-to-one doubt sessions made all the difference. I never felt left behind and could always get my questions answered."
    },
    {
      id: 3,
      name: "Dr. Sri Raksha",
      exam: "Alumna",
      rank: "Successful Doctor",
      score: "",
      course: "Alumni - Medical Field",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      testimonial: "The foundation I received at Hosur Toppers Academy was instrumental in my journey through medical school and beyond."
    }
  ],
  
  gallery: [ // Kept from mock data as no new images were provided
    {
      id: 1,
      title: "Interactive Classroom Session",
      category: "classroom",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=300&fit=crop",
      description: "Students actively participating in a physics demonstration"
    },
    {
      id: 2,
      title: "Well-Equipped Facilities",
      category: "facility",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
      description: "Well-furnished classrooms with AV support and CCTV for a safe learning environment."
    },
    {
      id: 3,
      title: "Annual Achievement Ceremony",
      category: "events",
      image: "https://images.unsplash.com/photo-1511376777868-611b54f68947?w=400&h=300&fit=crop",
      description: "Celebrating our students' outstanding achievements"
    }
  ],
  
  stats: {
    studentsEnrolled: "25-30 per batch",
    successRate: "100%",
    experienceYears: "23+", // Calculated from establishment year 2002
    facultyCount: "3 Core Experts"
  },
  
  about: {
    vision: "To be a premier institution for transforming aspiring students into top achievers. We envision a future of excellence for our kids.",
    mission: "To empower students with excellence in education.",
    methodology: [
      {
        title: "Activity-Based Learning",
        description: "We use hands-on activities, visual aids, and animated videos to make learning interactive and fun."
      },
      {
        title: "Advanced Tools",
        description: "Our teaching incorporates interactive simulation tools, virtual labs, and animated quizzes to explain complex topics."
      },
      {
        title: "Continuous Assessment",
        description: "Through regular tests, worksheets, and quizzes, we track student progress and ensure concepts are mastered."
      },
      {
        title: "Holistic Development",
        description: "We encourage critical thinking through group activities, debates, and puzzles, preparing students for all challenges."
      }
    ]
  }
};
