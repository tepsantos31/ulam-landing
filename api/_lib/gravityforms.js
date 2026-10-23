// Shared helper for submitting to Gravity Forms' REST API v2 from a
// serverless function — keeps the Consumer Key/Secret server-side only,
// since this is a static site and those credentials can never be shipped
// to the browser. Config comes from Vercel environment variables, not
// committed anywhere.
const SITE_URL = process.env.GF_SITE_URL;
const CONSUMER_KEY = process.env.GF_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.GF_CONSUMER_SECRET;

/** Posts a single entry to the given Gravity Forms form ID. `inputValues`
 * maps Gravity Forms field IDs (e.g. "input_1") to their submitted value. */
async function submitToGravityForms(formId, inputValues) {
  if (!SITE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error('Gravity Forms is not configured on the server (missing GF_SITE_URL/GF_CONSUMER_KEY/GF_CONSUMER_SECRET).');
  }
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  const res = await fetch(`${SITE_URL}/wp-json/gf/v2/forms/${formId}/submissions`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inputValues),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || (data && data.is_valid === false)) {
    const message = data && data.validation_messages
      ? Object.values(data.validation_messages).join(', ')
      : 'Gravity Forms rejected the submission.';
    throw new Error(message);
  }
  return data;
}

module.exports = { submitToGravityForms };
