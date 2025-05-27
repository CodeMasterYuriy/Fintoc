const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {
    getProfile,
    updateProfile,
    registerLinkAndRetrieveAccounts,
    getSubscriptionInformation,
    getSubscriptionInformationByGmail,
    getMonthSubscriptionInformationByTransaction,
    getRecentSubscriptionInformationByTransaction,
    verifyUserBankConnection,
    getBudgetByCategoryThisMonth,
} = require('../controllers/user.controller');

const {
    authPaypal,
    paypalCallback,
    sendPaypalPayment,
    capturePayment,
    cancelPayment
} = require('../controllers/membership.controller');

router.get('/users/me', authMiddleware, getProfile);
router.put('/users/me', authMiddleware, updateProfile);
router.get('/belvo/link', authMiddleware, registerLinkAndRetrieveAccounts);
router.get('/account/verify', authMiddleware, verifyUserBankConnection);
router.get('/recurring-expenses/information', authMiddleware, getSubscriptionInformation);
router.get('/recurring-expenses/information/everymonth', authMiddleware, getMonthSubscriptionInformationByTransaction);
router.get('/recurring-expenses/information/recent', authMiddleware, getRecentSubscriptionInformationByTransaction);
router.get('/budget/information', authMiddleware, getBudgetByCategoryThisMonth);
router.get('/gmail/recurring-information', authMiddleware, getSubscriptionInformationByGmail);

router.get('/paypal/subscription/authorize', authPaypal);
router.get('/paypal/subscription/callback', paypalCallback);
router.post('/paypal/subscription/releaseMembership', authMiddleware, sendPaypalPayment);
router.get('/paypal/success',  capturePayment);
router.get('/paypal/cancel', cancelPayment);
module.exports = router;
