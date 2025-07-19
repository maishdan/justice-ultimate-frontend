// reCAPTCHA verification endpoint
const axios = require('axios');

function setupRecaptchaEndpoint(app) {
  app.post('/api/verify-recaptcha', async (req, res) => {
    try {
      const token = req.body['g-recaptcha-response'];
      const secretKey = '6Lf2HYgrAAAAAHvpe272LhCc6SfwXK_ak39tLBZl';

      if (!token) {
        return res.status(400).json({ 
          success: false, 
          message: 'reCAPTCHA token is missing' 
        });
      }

      // Verify with Google reCAPTCHA API
      const googleResponse = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
      );

      if (googleResponse.data.success) {
        // Log successful verification
        console.log('reCAPTCHA verification successful for IP:', req.ip);
        
        return res.status(200).json({ 
          success: true, 
          message: 'reCAPTCHA verification passed',
          score: googleResponse.data.score || 1.0,
          action: googleResponse.data.action || 'submit'
        });
      } else {
        // Log failed verification
        console.log('reCAPTCHA verification failed for IP:', req.ip, 'Errors:', googleResponse.data['error-codes']);
        
        return res.status(400).json({ 
          success: false, 
          message: 'reCAPTCHA verification failed',
          errors: googleResponse.data['error-codes'] || []
        });
      }
    } catch (err) {
      console.error('reCAPTCHA verification error:', err.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Server error during reCAPTCHA verification' 
      });
    }
  });
}

module.exports = { setupRecaptchaEndpoint }; 