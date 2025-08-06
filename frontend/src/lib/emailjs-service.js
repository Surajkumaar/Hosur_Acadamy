import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, createEmailParams, createAutoReplyParams } from './emailjs-config';

// Initialize EmailJS with public key
export const initEmailJS = () => {
  console.log('EmailJS Config Check:', {
    publicKey: EMAILJS_CONFIG.publicKey,
    serviceId: EMAILJS_CONFIG.serviceId,
    templateId: EMAILJS_CONFIG.templateId,
    envPublicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
    envServiceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
    envTemplateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID
  });
  
  if (EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY_HERE') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log('EmailJS initialized successfully with public key:', EMAILJS_CONFIG.publicKey);
    return true;
  }
  console.warn('EmailJS public key not configured. Current value:', EMAILJS_CONFIG.publicKey);
  return false;
};

// Send inquiry email using EmailJS
export const sendInquiryEmail = async (formData) => {
  try {
    // Check if EmailJS is properly configured
    if (!initEmailJS()) {
      throw new Error('EmailJS is not properly configured. Please check your API keys.');
    }

    // Validate required configuration
    if (EMAILJS_CONFIG.serviceId === 'YOUR_SERVICE_ID_HERE' || 
        EMAILJS_CONFIG.templateId === 'YOUR_TEMPLATE_ID_HERE') {
      throw new Error('EmailJS service ID or template ID not configured');
    }

    // Create email parameters
    const emailParams = createEmailParams(formData);

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      emailParams
    );

    console.log('Email sent successfully:', response);
    return {
      success: true,
      message: 'Email sent successfully',
      data: response
    };

  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      message: error.message || 'Failed to send email',
      error: error
    };
  }
};

// Send auto-reply email to the user (acknowledgment)
export const sendAutoReplyEmail = async (formData) => {
  try {
    // Check if auto-reply template is configured
    if (EMAILJS_CONFIG.autoReplyTemplateId === 'YOUR_AUTO_REPLY_TEMPLATE_ID_HERE') {
      console.log('Auto-reply template not configured, skipping auto-reply');
      return {
        success: true,
        message: 'Auto-reply template not configured'
      };
    }

    // Check if EmailJS is properly initialized
    if (!initEmailJS()) {
      throw new Error('EmailJS is not properly configured for auto-reply');
    }

    // Create auto-reply email parameters
    const autoReplyParams = createAutoReplyParams(formData);

    console.log('Sending auto-reply email with params:', autoReplyParams);

    // Send auto-reply email using EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.autoReplyTemplateId,
      autoReplyParams
    );

    console.log('Auto-reply email sent successfully:', response);
    return {
      success: true,
      message: 'Auto-reply email sent successfully',
      data: response
    };

  } catch (error) {
    console.error('Failed to send auto-reply:', error);
    return {
      success: false,
      message: 'Failed to send auto-reply',
      error: error
    };
  }
};
