import { useEffect, useState } from 'react';
import { handlePaypalSubscription, getSubscriptionInformation } from '../utils/apis/subscription';

declare global {
  interface Window {
    paypal?: any;
  }
}

type Membership = {
  name: string;
  price: string;
};

const PaypalSubscribeButton = ({ membership } : {membership : Membership}) => {
  useEffect(() => {
    const PAYPAL_SDK_URL =
      'https://www.paypal.com/sdk/js?client-id=ARepWSXuzUJxR8lBUsrVd6wJj19lR1sbnv9vP_8_zkPww03VELRNxLp6LECRkpHhc6W_zFQMAe9DWH-_&vault=true&intent=subscription';

    const containerId = 'paypal-button-container';

    const renderPayPalButton = () => {

      if (!window.paypal) return;

      try {
        window.paypal.Buttons({
          style: {
            shape: 'pill',
            color: 'blue',
            layout: 'horizontal',
            label: 'subscribe',
            height: 45,
          },
          createSubscription: (data: any, actions: any) => {
            return actions.subscription.create({
              plan_id: 'P-5D568368E5514134BNA23P2Y',
            });
          },
          onApprove: (data: any) => {
            handlePaypalSubscription();
            alert(`Subscription successful! ID: ${data.subscriptionID}`);
          },
        }).render(`#${containerId}`);
      } catch (err) {
        console.error('PayPal Buttons render error:', err);
      }
    };

    // Load SDK only if not already loaded
    if (!document.querySelector(`script[src^="${PAYPAL_SDK_URL}"]`)) {
      const script = document.createElement('script');
      script.src = PAYPAL_SDK_URL;
      script.setAttribute('data-sdk-integration-source', 'button-factory');
      script.onload = renderPayPalButton;
      document.body.appendChild(script);
    } else {
      renderPayPalButton();
    }

    // Cleanup: allow PayPal to teardown instead of manually clearing innerHTML
    return () => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = ''; // Prevent memory leaks
      }
    };
  }, []);
  return membership.name.includes('Pro') ? (<div className="border-none pointer-events-none" id="paypal-button-container"></div>) :
      (<div className="border-none" id="paypal-button-container"></div>);
};



const plans = [
  {
    name: 'Free',
    price: 'Free',
    description: 'Perfect for individuals getting started. Enjoy essential features at no cost.',
    features: [
      'Basic account management',
      'Limited support',
      'Access to community forum',
      'Secure cloud storage',
    ],
    cta: 'Free Plan',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$30/mo',
    description: 'Unlock all features, premium support, and advanced analytics. Ideal for professionals and businesses who want to grow.',
    features: [
      'All Free plan features',
      'Priority customer support',
      'Advanced analytics dashboard',
      'Unlimited integrations',
      'Early access to new features',
      'Custom branding',
    ],
    cta: 'Upgrade with PayPal',
    highlight: true,
  },
];



const MembershipPage = () => {
  const [membership, setMembership] = useState({
    name: 'Free Plan',
    price: '0',
  });

  useEffect(() => {
  const fetchSubscriptionInfo = async () => {
    try {
      const subscriptionInfo = await getSubscriptionInformation();
      if (subscriptionInfo && subscriptionInfo.name && subscriptionInfo.price) {
        setMembership({
          name: subscriptionInfo.name,
          price: subscriptionInfo.price,
        });
      }
      console.log('Subscription Information:', subscriptionInfo);
    } catch (error) {
      console.error('Error fetching subscription information:', error);
    }
  };

  fetchSubscriptionInfo();
}, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-16 px-4">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-4 drop-shadow-lg">Membership Plans</h1>
      <p className="text-lg text-gray-600 mb-10">
        {membership.name.includes('Pro') ? ('Find the perfect plan for your needs and unlock your potential, You have chosen pro plan') : ('Find the perfect plan for your needs and unlock your potential, You have chosen free plan')}
      </p>
      <div className="flex flex-col md:flex-row gap-10 w-full max-w-5xl justify-center">
        {/* Free Plan Card */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center border-2 border-gray-200 transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-3xl font-bold mb-2 text-blue-700">{plans[0].name}</h2>
          <div className="text-4xl font-extrabold text-blue-500 mb-2">{plans[0].price}</div>
          <p className="text-gray-500 mb-6 text-center">{plans[0].description}</p>
          <ul className="mb-8 space-y-3 text-gray-700 w-full max-w-xs">
            {plans[0].features.map((feature, idx) => (
              <li key={idx} className="flex items-center">
                <span className="text-green-500 mr-3 text-lg">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button
            className="bg-gray-200 text-gray-500 font-semibold px-8 py-3 rounded-full cursor-not-allowed text-lg shadow-inner"
            disabled
          >
            {plans[0].cta}
          </button>
        </div>
        {/* Pro Plan Card */}
        <div className="flex-1 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-3xl shadow-2xl p-10 flex flex-col items-center border-2 border-indigo-700 transition-transform duration-300 hover:scale-110 hover:shadow-3xl relative z-10">
          <div className="absolute -top-6 right-6 bg-yellow-400 text-indigo-900 font-bold px-4 py-1 rounded-full shadow-md text-sm uppercase tracking-wider">
            Most Popular
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{plans[1].name}</h2>
          <div className="text-4xl font-extrabold text-yellow-300 mb-2">{plans[1].price}</div>
          <p className="text-indigo-100 mb-6 text-center">{plans[1].description}</p>
          <ul className="mb-8 space-y-3 text-white w-full max-w-xs">
            {plans[1].features.map((feature, idx) => (
              <li key={idx} className="flex items-center">
                <span className="text-yellow-300 mr-3 text-lg">★</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <PaypalSubscribeButton membership={membership}/>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
