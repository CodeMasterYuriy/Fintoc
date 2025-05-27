const qs = require('qs');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { User, Role, Membership } = require('../models');

const PAYPAL_API = 'https://api.sandbox.paypal.com';

const getPaypalAccessToken = async () => {
  const clientID = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET_KEY;

  try {
    const auth = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
    const tokenResponse = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return tokenResponse.data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error.message);
    throw new Error('Unable to obtain PayPal access token');
  }
};


exports.authPaypal = async (req, res) => {
  try {
    const redirectUri = process.env.PAYPAL_REDIRECT_URI;
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const PAYPAL_AUTH_URL = "https://www.sandbox.paypal.com/signin/authorize";
    const token = req.query.token;
    const price = req.query.price;

    if (!redirectUri || !clientId) {
      return res.status(400).json({ error: "Invalid redirect URI or client ID" });
    }

    if (!token) {
      return res.status(401).json({ message: 'Missing token' });
    }

    let user;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findByPk(decoded.id, {
        include: { model: Role, as: 'role' }
      });

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
    } catch (err) {
      console.error('JWT verification error:', err); // Add this line for debugging
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const statePayload = {
      userId: user.id,
      price: price || null
    };
    const encodedState = encodeURIComponent(JSON.stringify(statePayload));

    const scopes = [
      "openid",
      "profile",
      "email",
      "https://uri.paypal.com/services/paypalattributes"
    ].join(" ");

    const authURL = `${PAYPAL_AUTH_URL}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes)}&state=${encodedState}`;

    return res.redirect(authURL);
  } catch (err) {
    console.error("PayPal auth redirect error:", err);
    return res.status(500).json({ error: "Failed to initiate PayPal authentication" });
  }
};

exports.paypalCallback = async (req, res) => {
  const { code, state } = req.query;
  if (!code || state === undefined) {
    return res.status(400).json({ error: 'No authorization code provided.' });
  }

  let userId, price;
  try {
    const parsed = JSON.parse(decodeURIComponent(state));
    userId = parsed.userId;
    price = parsed.price;
  } catch (err) {
    return res.status(400).json({ error: 'Invalid state format.' });
  }

  const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  const CLIENT_SECRET = process.env.PAYPAL_SECRET_KEY;
  const PAYPAL_API_URL = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

  // Membership details
  const membershipName = 'Pro Membership';
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1); // 1 month membership

  try {
    let membership = await Membership.findOne({ where: { userId } });

    if (membership && membership.is_paypal_connected && membership.refresh_token) {
      // Use refresh token to get new access token
      const refreshTokenData = qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: membership.refresh_token,
      });

      const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
      const refreshResponse = await axios.post(
        `${PAYPAL_API_URL}/v1/identity/openidconnect/tokenservice`,
        refreshTokenData,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );

      const { access_token, refresh_token, expires_in } = refreshResponse.data;

      // Update all membership fields with new data
      await membership.update({
        name: membershipName,
        price: price,
        start_date: now,
        current_period_end: periodEnd,
        refresh_token: refresh_token || membership.refresh_token, // update if new one provided
        is_paypal_connected: true,
      });

      return res.status(200).json({
        message: 'Membership updated and access token refreshed successfully',
        accessToken: access_token,
        refreshToken: refresh_token || membership.refresh_token,
        expiresIn: expires_in,
      });
    } else {
      // Exchange code for tokens and create membership
      const tokenData = qs.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.PAYPAL_REDIRECT_URI,
      });

      const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
      const response = await axios.post(
        `${PAYPAL_API_URL}/v1/identity/openidconnect/tokenservice`,
        tokenData,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );

      const { access_token, refresh_token, expires_in, id_token } = response.data;

      await Membership.create({
        userId,
        name: membershipName,
        price: price,
        start_date: now,
        current_period_end: periodEnd,
        refresh_token: refresh_token,
        is_paypal_connected: true,
      });

      return res.status(200).json({
        message: 'Membership created and tokens obtained successfully',
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
        idToken: id_token || null,
      });
    }
  } catch (error) {
    console.error('PayPal callback error:', errMsg);
    return res.status(500).json({ error: 'PayPal callback failed: ' + errMsg });
  }
};

exports.sendPaypalPayment = async (req, res) => {
  const amount = req.body.amount;
  const access_token = await getPaypalAccessToken();

  try {
    const orderRes = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount
          }
        }
      ],
      application_context: {
        return_url: 'http://localhost:5000/api/paypal/success',
        cancel_url: 'http://localhost:5000/api/paypal/cancel',
        user_action: 'PAY_NOW',
      }
    },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const approvalLink = orderRes.data.links.find(link => link.rel === 'approve').href;
    return res.status(200).json({
      message: 'Order created successfully',
      orderId: orderRes.data.id,
      approvalLink: approvalLink
    });
  } catch (err) {
    console.error('Order Creation Error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'PayPal callback failed: ' + err.message });
  }
};

exports.capturePayment = async (req) => {
  try {
    console.log('Hit SUCCESS route!');
    const { token } = req.query;

    if (!token) throw new Error('Missing token from PayPal redirect');

    // Get the access token
    const accessToken = await getPaypalAccessToken();

    const PAYPAL_API = 'https://api.sandbox.paypal.com';

    const captureRes = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use the access token here
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Payment Captured:', captureRes.data);
    return captureRes.data;
  } catch (err) {
    console.error('Capture Error:', err.message);
    throw new Error(err.message);
  }
};

exports.cancelPayment = async (req, res) => {
  try {
    // Optionally, you can log or handle any cleanup here
    console.info('User cancelled the PayPal payment.', {
      query: req.query,
      user: req.user ? req.user.id : null
    });
    // You can also redirect to a cancellation page or send a message
    return res.status(200).json({ message: 'Payment was cancelled by the user.' });
  } catch (err) {
    console.error('Error handling payment cancellation:', err.message);
    return res.status(500).json({ error: 'Failed to handle payment cancellation.' });
  }
};