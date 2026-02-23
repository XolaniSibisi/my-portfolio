import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import './ContactForm.css';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear errors as user types
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const getStatusMessage = () => {
    switch (submitStatus) {
      case 'success':
        return {
          type: 'success',
          message:
            'Your message has been sent successfully! We will get back to you shortly.',
        };
      case 'timeout':
        return {
          type: 'error',
          message:
            'The request timed out. Please check your internet connection and try again.',
        };
      case 'validation':
        return {
          type: 'error',
          message: 'There was a validation error. Please check your input.',
        };
      case 'error':
        return {
          type: 'error',
          message:
            'An unexpected error occurred while sending your message. Please try again later.',
        };
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSubmitStatus('');

    try {
      // If your EmailJS template variables match formData keys, this is fine.
      // Otherwise, map them (e.g., from_name, reply_to, etc.).
      const result = await emailjs.send(
        process.env.REACT_APP_SERVICE_ID,
        process.env.REACT_APP_TEMPLATE_ID,
        formData,
        { publicKey: process.env.REACT_APP_USER_ID },
      );

      if (result && result.status === 200) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending email:', error);

      if (error && error.code === 'ECONNABORTED') {
        setSubmitStatus('timeout');
      } else if (error && error.response && error.response.status === 400) {
        setSubmitStatus('validation');
      } else {
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const status = getStatusMessage();

  return (
    <div className="contact-form-container">
      <h2>Contact Us</h2>

      {status && (
        <div className={`status-message ${status.type}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">
              Name*
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
                className={errors.name ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.name && (
                <span className="error-text">{errors.name}</span>
              )}
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email*
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className={errors.email ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="subject">
            Subject*
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="What is this message about?"
              className={errors.subject ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.subject && (
              <span className="error-text">{errors.subject}</span>
            )}
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="message">
            Message*
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              required
              placeholder="Tell us more about your inquiry..."
              className={errors.message ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.message && (
              <span className="error-text">{errors.message}</span>
            )}
          </label>
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner" />
              {' '}
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
