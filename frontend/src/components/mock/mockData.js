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
      exam: "Alumni",
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
      title: "Alumni Success",
      category: "Alumni",
      image: "/classroom5.jpg",
      description: "Inspiring Journeys Beyond the Campus"
    },
    {
      id: 2,
      title: "Alumni Success",
      category: "Alumni",
      image: "/classroom6.jpg",
      description: "Inspiring Journeys Beyond the Campus"
    },
    {
      id: 3,
      title: "Interactive Learning Space",
      category: "classroom",
      image: "/classroom7.jpg",
      description: "Technology-enhanced classroom for interactive sessions"
    },
    {
      id: 4,
      title: "Interactive Learning Space",
      category: "classroom",
      image: "/classroom8.jpg",
      description: "Technology-enhanced classroom for interactive sessions"
    },
    {
      id: 5,
      title: "Mathematics Center",
      category: "classroom",
      image: "/classroom9.jpg",
      description: "Dedicated space for mathematics and problem-solving"
    },
    {
      id: 6,
      title: "Interactive Learning Space",
      category: "classroom",
      image: "/classroom10.jpg",
      description: "Technology-enhanced classroom for interactive sessions"
    },
    {
      id: 7,
      title: "Interactive Learning Space",
      category: "classroom",
      image: "/classroom11.jpg",
      description: "Technology-enhanced classroom for interactive sessions"
    },
    {
      id: 8,
      title: "Student Activity Center",
      category: "classroom",
      image: "/classroom12.jpg",
      description: "Multi-purpose hall for student activities and events"
    },
    {
      id: 9,
      title: "Library & Reading Room",
      category: "classroom",
      image: "/classroom13.jpg",
      description: "Quiet study environment with extensive resources"
    },
    {
      id: 10,
      title: "Computer Lab",
      category: "classroom",
      image: "/classroom14.jpg",
      description: "Modern computer laboratory for digital learning"
    },
    {
      id: 11,
      title: "Conference Hall",
      category: "classroom",
      image: "/classroom15.jpg",
      description: "Professional meeting space for academic discussions"
    },
    {
      id: 12,
      title: "Innovation Hub",
      category: "classroom",
      image: "/classroom16.jpg",
      description: "Creative workspace for projects and innovations"
    }
  ],
  
  stats: {
    studentsEnrolled: "23+ Years",
    successRate: "100%",
    experienceYears: "23+", // Calculated from establishment year 2002
    facultyCount: "3 Core Experts"
  },
  
  about: {
    vision: "To be a pioneering educational institution that is nationally recognized for academic excellence and for nurturing the next generation of leaders, innovators, and thinkers. We envision a future where our students are empowered to not only achieve their highest potential but also to make a meaningful impact on a global stage.",
    mission: "Our mission is to provide a transformative learning experience by building a robust conceptual foundation through personalized mentorship and innovative pedagogy. We are committed to fostering a dynamic and intellectually stimulating environment that utilizes activity-based learning, STEM integration, and a holistic approach to education, thereby equipping every student with the skills, confidence, and knowledge to excel in competitive examinations and beyond.",
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
