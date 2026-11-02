const { submitToGravityForms } = require('./_lib/gravityforms');

// Gravity Forms field IDs for the "Early Access" form (Form ID 2):
// input_1 = Email, input_2 = Platform (iOS/Android dropdown)
// Confirm input_2 matches the actual field ID Gravity Forms assigns once
// that dropdown is added in WP admin — update here if it differs.
const EARLY_ACCESS_FORM_ID = 2;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ errors: [{ message: 'Method not allowed.' }] });
    return;
  }

  const { email, platform, _gotcha } = req.body || {};

  // Formspree-style honeypot — real visitors never see or fill this field.
  if (_gotcha) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!email) {
    res.status(422).json({ errors: [{ message: 'Please enter your email.' }] });
    return;
  }

  try {
    await submitToGravityForms(EARLY_ACCESS_FORM_ID, {
      input_1: email,
      input_2: platform || '',
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(502).json({ errors: [{ message: err.message || 'Something went wrong — please try again.' }] });
  }
};
