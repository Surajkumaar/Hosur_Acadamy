// EmailJS Configuration
// You will need to replace these values with your actual EmailJS credentials

export const EMAILJS_CONFIG = {
  // Your EmailJS public key (you'll provide this later)
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY_HERE',
  
  // Your EmailJS service ID
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_cq4632k',
  
  // Your EmailJS template ID (you'll provide this later)
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID_HERE',
  
  // Auto-reply template ID for acknowledgment emails
  autoReplyTemplateId: process.env.REACT_APP_EMAILJS_AUTO_REPLY_TEMPLATE_ID || 'YOUR_AUTO_REPLY_TEMPLATE_ID_HERE',
};

// Email template parameters that will be sent to EmailJS
export const createEmailParams = (formData) => {
  return {
    // Template variables that match your EmailJS template
    from_name: formData.name,        // {{from_name}} in template
    from_email: formData.email,      // {{from_email}} in template  
    phone: formData.phone,           // {{phone}} in template
    course: formData.course || 'Not specified',      // {{course}} in template
    grade: formData.grade || 'Not specified',        // {{grade}} in template
    message: formData.message || 'No additional message',  // {{message}} in template
    timestamp: new Date().toLocaleString(),          // {{timestamp}} in template
    source: 'Website Inquiry Form',  // {{source}} in template
    
    // Additional variables for EmailJS (these match your template setup)
    name: formData.name,             // {{name}} - for From Name field
    email: formData.email,           // {{email}} - for Reply To field
    to_email: 'hosurtoppersacademy@gmail.com'  // Your academy email
  };
};

// Auto-reply email parameters for acknowledgment
export const createAutoReplyParams = (formData) => {
  return {
    // Auto-reply template variables
    name: formData.name,             // {{name}} in auto-reply template
    email: formData.email,           // {{email}} in auto-reply template  
    title: formData.course || 'General Inquiry',  // {{title}} in auto-reply template
    
    // Email configuration for auto-reply
    to_email: formData.email,        // Send to the user's email
    from_name: 'Hosur Toppers Academy',
    reply_to: 'hosurtoppersacademy@gmail.com'
  };
};
