"use client";
import { useState } from 'react';

// --- PRODUCTION COMPREHENSIVE CATEGORY SORT ---
const CATEGORIES = [
  'Value Combos', 'Burgers', 'Sandwiches', 'Starters', 'Noodles', 'Pasta', 
  'Maggi', 'Bowls', 'South Indian', 'Main Course', 'Rice', 'Paratha', 
  'Roti', 'Pizza', 'Momos', 'Salad', 'Summer Special Drinks', 'Accompaniments'
];

// --- COMPLETE DISH DIRECTORY MANIFEST ---
const MENU = [
  { "id": 779493071, "category": "Summer Special Drinks", "name": "Mocha Madness Shake", "desc": "Creamy mocha shake bringing chocolate and coffee together.", "image": "https://b.zmtcdn.com/data/dish_photos/20c/53e5efc0b874c009988a5d74665bc20c.png", "isVeg": true, "isBestseller": true, "variants": [{ "name": "Without Ice Cream", "price": 149 }, { "name": "1 Scoop", "price": 169 }, { "name": "2 Scoop", "price": 179 }] },
  { "id": 779493072, "category": "Burgers", "name": "Cheese Whopper Burger", "desc": "Thick premium cheese layer with house spices.", "image": "https://b.zmtcdn.com/data/dish_photos/011/4a87c10b74955b2520bbdc29ea791011.jpeg", "isVeg": true, "isBestseller": true, "price": 119 },
  { "id": 787477084, "category": "Starters", "name": "Schezwan Vada Pav", "desc": "Relocated variant featuring hot Schezwan drizzle and red chutney paste.", "image": "https://b.zmtcdn.com/data/dish_photos/195/c01dbf63bc0fa511fa9a27e0259b3195.png", "isVeg": true, "isBestseller": true, "price": 69 },
  { "id": 999100001, "category": "Starters", "name": "Garlic Bread", "desc": "Baked fresh with premium herbs.", "image": "https://via.placeholder.com/150/e2e8f0?text=Garlic+Bread", "isVeg": true, "isBestseller": false, "price": 99 },
  { "id": 999100002, "category": "Starters", "name": "Cheesy Bites", "desc": "Crispy golden shells bursting with melted mozzarella.", "image": "https://via.placeholder.com/150/e2e8f0?text=Cheesy+Bites", "isVeg": true, "isBestseller": false, "price": 149 },
  { "id": 999100003, "category": "Burgers", "name": "Regular Vada Pav", "desc": "Classic Mumbai style spiced potato batata vada inside soft pav bun.", "image": "https://via.placeholder.com/150/e2e8f0?text=Regular+Vada+Pav", "isVeg": true, "isBestseller": false, "price": 59 },
  { "id": 999100004, "category": "Burgers", "name": "Bombay Vada Pav", "desc": "Authentic street style vada pav served with fried green chilies and ghati masala.", "image": "https://via.placeholder.com/150/e2e8f0?text=Bombay+Vada+Pav", "isVeg": true, "isBestseller": false, "price": 59 },
  { "id": 772501641, "category": "Main Course", "name": "Kadhai Paneer Combo", "desc": "Rich spiced gravy matching block paneer cuts.", "image": "https://via.placeholder.com/150/e2e8f0?text=Kadhai+Paneer", "isVeg": true, "isBestseller": true, "price": 249 },
  { "id": 772501651, "category": "Paratha", "name": "Aloo Pyaz Paratha", "desc": "Tandoor baked flatbread stuffed with spiced potatoes and minced onion.", "image": "https://via.placeholder.com/150/e2e8f0?text=Aloo+Paratha", "isVeg": true, "isBestseller": false, "price": 89 },
  { "id": 772501663, "category": "Roti", "name": "Butter Tawa Roti", "desc": "Fresh whole wheat flatbread made on traditional iron griddle layered with Amul butter.", "image": "https://via.placeholder.com/150/e2e8f0?text=Butter+Roti", "isVeg": true, "isBestseller": false, "price": 22 },
  { "id": 787477097, "category": "Momos", "name": "Veg Momos", "desc": "Classic street style loaded mixed vegetable dumplings.", "image": "https://b.zmtcdn.com/data/dish_photos/984/d03ee9af9232d29239be8f8637442984.jpeg", "isVeg": true, "isBestseller": true, "variants": [{ "name": "Steamed", "price": 119 }, { "name": "Fried", "price": 129 }, { "name": "Pan Fried", "price": 139 }] }
];

export default function Home() {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', lat: null, lng: null });
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [variantIndex, setVariantIndex] = useState(0);

  const handleAddAction = (item) => {
    if (item.variants) {
      setActiveModalItem(item);
      setVariantIndex(0);
    } else {
      executeCartAddition(item);
    }
  };

  const executeCartAddition = (item, selectedVariant = null) => {
    const keyId = selectedVariant ? `${item.id}-${selectedVariant.name}` : item.id;
    const finalPrice = selectedVariant ? selectedVariant.price : item.price;
    const displayName = selectedVariant ? `${item.name} (${selectedVariant.name})` : item.name;

    setCart((prev) => {
      const match = prev.find(i => i.keyId === keyId);
      if (match) return prev.map(i => i.keyId === keyId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { keyId, id: item.id, name: displayName, price: finalPrice, qty: 1 }];
    });
    setActiveModalItem(null);
  };

  const executeCartReduction = (keyId) => {
    setCart((prev) => prev.map(i => i.keyId === keyId ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0));
  };

  // Business logic engines
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const triggerOffer = subtotal >= 349;
  const discount = triggerOffer ? subtotal * 0.10 : 0;
  const deliveryFee = (triggerOffer || subtotal === 0) ? 0 : 49;
  const grandTotal = subtotal - discount + deliveryFee;

  const handleNavScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const processGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setFormData({ ...formData, lat: position.coords.latitude, lng: position.coords.longitude }),
        () => alert("Location permission required to proceed with dispatch routing.")
      );
    }
  };

  const processOrderSubmission = async (e) => {
    e.preventDefault();
    if (!formData.lat || !formData.lng) return alert("Please capture your GPS location telemetry to coordinate railway/doorstep dispatch.");
    setIsSubmitting(true);

    const dataPayload = { 
  name: formData.name,
  phone: formData.phone,
  address: formData.address,
  location: { 
    lat: formData.lat, 
    lng: formData.lng 
  },
  items: cart, 
  subtotal, 
  discount, 
  deliveryFee, 
  finalTotal: grandTotal 
};

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataPayload)
      });

      if (!response.ok) throw new Error();

      // Format production clean multi-line WhatsApp payload
      let stringMsg = `*New Order: Tadka Theory* 🚀\n`;
      stringMsg += `👤 Name: ${formData.name}\n`;
      stringMsg += `📞 Contact: ${formData.phone}\n`;
      stringMsg += `🏠 Address: ${formData.address}\n`;
      stringMsg += `📍 GPS Coordinates: http://googleusercontent.com/maps.google.com/maps?q=${formData.lat},${formData.lng}\n\n`;
      stringMsg += `*Cart Summary:*\n`;
      cart.forEach(i => { stringMsg += `- ${i.qty}x ${i.name} [₹${i.price}]\n`; });
      stringMsg += `\nSubtotal: ₹${subtotal}\n`;
      if (discount > 0) stringMsg += `Direct Deal 10% Off: -₹${discount.toFixed(2)}\n`;
      stringMsg += `Delivery Packaging: ₹${deliveryFee === 0 ? '0 (FREE)' : deliveryFee}\n`;
      stringMsg += `*Total Due: ₹${grandTotal.toFixed(2)}*\n\n`;
      stringMsg += `_Channel: Direct Ordering (Transparent Pricing - NO GST, NO Packaging Charges)_`;

      window.location.href = `https://wa.me/918938909876?text=${encodeURIComponent(stringMsg)}`;
    } catch (err) {
      alert("Order submission error. Please try again or checkout over phone.");
      setIsSubmitting(false);
    }
  };

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-[#FDFAF4] text-[#2B1F1D] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-[#9E2A2B] p-5 text-white flex items-center gap-4">
            <button type="button" onClick={() => setShowCheckout(false)} className="font-bold text-xl">←</button>
            <h2 className="text-xl font-black uppercase tracking-wide">Secure Checkout</h2>
          </div>
          <form onSubmit={processOrderSubmission} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Your Name</label>
              <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#9E2A2B] outline-none transition" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">WhatsApp Mobile Number</label>
              <input required type="tel" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#9E2A2B] outline-none transition" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Delivery Address (Home/Hotel/Train Coach Details)</label>
              <textarea required rows="3" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#9E2A2B] outline-none transition" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
            </div>
            
            <button type="button" onClick={processGeolocation} className={`w-full p-3 rounded-xl font-bold flex justify-center items-center gap-2 border transition ${formData.lat ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
              {formData.lat ? '✅ GPS Satellite Signal Locked' : '📍 Click to Sync My Delivery GPS'}
            </button>

            <div className="border-t border-dashed border-slate-200 pt-4 flex justify-between items-center font-black text-xl text-slate-800">
              <span>Final Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full bg-[#9E2A2B] text-white p-4 rounded-xl font-black text-lg uppercase tracking-wider hover:bg-red-900 shadow-lg transition duration-150">
              {isSubmitting ? 'Verifying Pipeline...' : 'Place Order via WhatsApp'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFAF4] text-[#2B1F1D] pb-24 lg:pb-10">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#9E2A2B] text-white rounded-full flex items-center justify-center font-black border border-amber-400 shadow">TT</div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-[#9E2A2B]">Tadka Theory</h1>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Science of Deliciousness</p>
            </div>
          </div>
          <div className="hidden sm:block text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">Direct Orders: NO GST & NO Packaging Fees</div>
        </div>
        
        {/* Horizontal Category Scroller */}
        <div className="overflow-x-auto hide-scrollbar bg-slate-50 border-t border-slate-100">
          <div className="flex px-4 py-2.5 gap-5 max-w-6xl mx-auto min-w-max">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => handleNavScroll(cat)} className="text-xs font-bold text-slate-500 hover:text-[#9E2A2B] transition uppercase tracking-wider">
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Trust Callout Panel */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="bg-[#F4EBE1] border border-[#D8C2B1] rounded-2xl p-4 text-xs font-semibold text-slate-700 grid grid-cols-1 md:grid-cols-2 gap-2 text-center md:text-left">
          <div>📍 <span className="font-bold text-[#9E2A2B]">Best Cloud Kitchen in Tundla</span> | 🚂 <span className="font-bold text-[#023E8A]">Serving in Trains at Tundla Junction</span> (8am - 11pm, 1hr advance)</div>
          <div>🌱 <span className="font-bold text-emerald-700">Healthy Guarantee:</span> Absolutely NO Refined Oil & NO Margarine Used. 📦 Party pre-orders accepted!</div>
        </div>
      </div>

      {/* Grid Canvas */}
      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {CATEGORIES.map(category => {
            const matches = MENU.filter(i => i.category === category);
            if (matches.length === 0) return null;
            return (
              <div key={category} id={category} className="scroll-mt-28">
                <h2 className="text-lg font-black uppercase tracking-wider text-[#9E2A2B] mb-4 flex items-center gap-3">
                  {category}
                  <div className="h-px bg-slate-200 flex-grow"></div>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matches.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between shadow-sm hover:shadow-md transition">
                      <div className="flex flex-col justify-between pr-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-3.5 h-3.5 border border-green-600 flex items-center justify-center"><div className="w-2 h-2 bg-green-600 rounded-full"></div></div>
                            {item.isBestseller && <span className="bg-amber-100 text-amber-900 font-bold text-[9px] px-1.5 rounded uppercase">Bestseller</span>}
                          </div>
                          <h3 className="font-bold text-slate-800 text-base leading-tight">{item.name}</h3>
                          <p className="text-slate-400 text-xs mt-1 line-clamp-2">{item.desc}</p>
                        </div>
                        <div className="font-black text-[#9E2A2B] mt-2">₹{item.price || item.basePrice}</div>
                      </div>
                      <div className="w-24 flex flex-col items-center">
                        <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-slate-50 shadow-inner" />
                        <button onClick={() => handleAddAction(item)} className="bg-white text-[#9E2A2B] border border-[#9E2A2B] font-black px-4 py-1 rounded shadow-sm text-xs uppercase -mt-3 hover:bg-red-50 transition">
                          Add {item.variants && "+"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Sidebar Sticky Cart Panel */}
        <div className="hidden lg:block">
          <div className="sticky top-32 bg-white border border-slate-100 rounded-2xl p-5 shadow-lg">
            <h2 className="text-lg font-black uppercase tracking-wide border-b border-slate-100 pb-3 mb-4">Shopping Basket</h2>
            {cart.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                Your active basket is empty.<br />Select dishes to generate configuration.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-[50vh] overflow-y-auto space-y-3 hide-scrollbar pr-1">
                  {cart.map(item => (
                    <div key={item.keyId} className="flex justify-between items-center text-xs">
                      <div className="w-2/3 pr-2 font-semibold text-slate-700">{item.name}</div>
                      <div className="flex items-center gap-2.5 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                        <button onClick={() => executeCartReduction(item.keyId)} className="text-[#9E2A2B] font-bold">−</button>
                        <span className="font-bold text-slate-800">{item.qty}</span>
                        <button onClick={() => executeCartAddition({ id: item.id, name: item.name.split(' (')[0] }, item.name.includes('(') ? { name: item.name.split('(')[1].replace(')', ''), price: item.price } : null)} className="text-[#9E2A2B] font-bold">+</button>
                      </div>
                      <div className="font-bold text-slate-800">₹{item.price * item.qty}</div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-dashed border-slate-200 pt-3 space-y-1.5 text-xs text-slate-500">
                  <div className="flex justify-between"><span>Base Basket Subtotal</span><span>₹{subtotal}</span></div>
                  <div className="flex justify-between text-emerald-600"><span>Direct Discount (10%)</span><span>-₹{discount.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Packaging Logistics Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
                </div>

                {!triggerOffer && (
                  <div className="bg-amber-50 border border-amber-200 p-2.5 text-center text-[10px] text-amber-800 font-bold rounded-xl">
                    Add items worth ₹{349 - subtotal} more to claim 10% OFF + FREE Delivery!
                  </div>
                )}

                <div className="border-t border-slate-200 pt-3 flex justify-between items-center font-black text-lg text-slate-800">
                  <span>To Pay</span><span>₹{grandTotal.toFixed(2)}</span>
                </div>
                <button onClick={() => setShowCheckout(true)} className="w-full bg-[#9E2A2B] text-white py-3 rounded-xl font-black uppercase tracking-wider text-sm shadow hover:bg-red-900 transition">Proceed to Order</button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Sticky Floating Bar Panel Hook */}
      {cart.length > 0 && !showCheckout && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-2xl lg:hidden z-50">
          <button onClick={() => setShowCheckout(true)} className="w-full bg-[#9E2A2B] text-white p-4 rounded-xl flex justify-between items-center shadow-lg">
            <div className="text-left">
              <div className="text-[10px] font-bold text-red-200 uppercase">{cart.reduce((a, b) => a + b.qty, 0)} Items Added</div>
              <div className="text-base font-black">₹{grandTotal.toFixed(2)}</div>
            </div>
            <div className="font-bold uppercase tracking-wider text-sm flex items-center gap-1">Verify Order →</div>
          </button>
        </div>
      )}

      {/* Variant Bottom Sheet Selector Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-150">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-black text-slate-800 text-base">{activeModalItem.name}</h3>
                <p className="text-xs text-slate-400">Choose custom configuration size</p>
              </div>
              <button onClick={() => setActiveModalItem(null)} className="text-slate-400 font-bold hover:text-slate-600">✕</button>
            </div>
            <div className="p-5 space-y-2 max-h-[40vh] overflow-y-auto">
              {activeModalItem.variants.map((v, i) => (
                <label key={v.name} className={`flex justify-between items-center p-3 border-2 rounded-xl cursor-pointer transition ${variantIndex === i ? 'border-[#9E2A2B] bg-red-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={variantIndex === i} onChange={() => setVariantIndex(i)} className="accent-[#9E2A2B] w-4 h-4" />
                    <span className="text-sm font-semibold text-slate-700">{v.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">₹{v.price}</span>
                </label>
              ))}
            </div>
            <div className="p-5 border-t border-slate-100">
              <button onClick={() => executeCartAddition(activeModalItem, activeModalItem.variants[variantIndex])} className="w-full bg-[#9E2A2B] text-white p-3 rounded-xl font-black uppercase text-xs tracking-wider shadow">
                Confirm Selection (₹{activeModalItem.variants[variantIndex].price})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}