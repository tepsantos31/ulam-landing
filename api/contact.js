const { submitToGravityForms } = require('./_lib/gravityforms');

// Gravity Forms field IDs for the "Contact" form (Form ID 1):
// input_1 = Name, input_3 = Email, input_4 = Message
const CONTACT_FORM_ID = 1;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ errors: [{ message: 'Method not allowed.' }] });
    return;
  }

  const { name, email, message, _gotcha } = req.body || {};

  // Formspree-style honeypot — real visitors never see or fill this field.
  // Pretend success so bots don't learn the field is being checked.
  if (_gotcha) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!name || !email || !message) {
    res.status(422).json({ errors: [{ message: 'Please fill in your name, email, and message.' }] });
    return;
  }

  try {
    await submitToGravityForms(CONTACT_FORM_ID, {
      input_1: name,
      input_3: email,
      input_4: message,
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(502).json({ errors: [{ message: err.message || 'Something went wrong — please try again.' }] });
  }
};
