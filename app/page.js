"use client";
import { useState } from 'react';

// --- MENU DATA (Including Variants) ---
const CATEGORIES = ['Best Sellers', 'Burgers', 'Starters', 'Momos', 'Drinks'];

const MENU = [
  { id: 1, category: 'Best Sellers', name: "Cheese Whopper Burger", price: 119, isVeg: true, isBestseller: true, desc: "A massive, cheesy delight.", image: "https://via.placeholder.com/150/e2e8f0?text=Burger" },
  { id: 2, category: 'Burgers', name: "Schezwan Vada Pav", price: 69, isVeg: true, isBestseller: true, desc: "Spicy Mumbai street food.", image: "https://via.placeholder.com/150/e2e8f0?text=Vada+Pav" },
  { id: 3, category: 'Starters', name: "Garlic Bread", price: 99, isVeg: true, isBestseller: false, desc: "Toasted to perfection.", image: "https://via.placeholder.com/150/e2e8f0?text=Bread" },
  { id: 4, category: 'Starters', name: "Achari Paneer Tikka", price: 249, isVeg: true, isBestseller: false, desc: "Tangy and smoky paneer cubes.", image: "https://via.placeholder.com/150/e2e8f0?text=Tikka" },
  { id: 5, category: 'Momos', name: "Veg Momos", basePrice: 119, isVeg: true, isBestseller: true, desc: "Classic street style momos [5 Pcs].", image: "https://via.placeholder.com/150/e2e8f0?text=Momos", 
    variants: [{name: 'Steamed', price: 119}, {name: 'Fried', price: 129}, {name: 'Pan Fried', price: 139}] },
  { id: 6, category: 'Momos', name: "Paneer Momos", basePrice: 149, isVeg: true, isBestseller: false, desc: "Stuffed with fresh paneer [5 Pcs].", image: "https://via.placeholder.com/150/e2e8f0?text=Paneer+Momos", 
    variants: [{name: 'Steamed', price: 149}, {name: 'Fried', price: 159}] },
  { id: 7, category: 'Drinks', name: "Mocha Madness Shake", basePrice: 149, isVeg: true, isBestseller: true, desc: "Coffee meets chocolate.", image: "https://via.placeholder.com/150/e2e8f0?text=Shake", 
    variants: [{name: 'Without Ice Cream', price: 149}, {name: '1 Scoop', price: 169}, {name: '2 Scoop', price: 179}] },
];

export default function Home() {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', lat: null, lng: null });
  
  // Modal State
  const [activeItemModal, setActiveItemModal] = useState(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // --- CART LOGIC ---
  const handleAddClick = (item) => {
    if (item.variants) {
      setActiveItemModal(item);
      setSelectedVariantIndex(0); // Reset to first variant
    } else {
      addToCart(item);
    }
  };

  const addToCart = (item, variant = null) => {
    const cartItemId = variant ? `${item.id}-${variant.name}` : item.id;
    const price = variant ? variant.price : item.price;
    const name = variant ? `${item.name} (${variant.name})` : item.name;

    setCart((prev) => {
      const existing = prev.find(i => i.cartItemId === cartItemId);
      if (existing) return prev.map(i => i.cartItemId === cartItemId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { cartItemId, id: item.id, name, price, qty: 1 }];
    });
    setActiveItemModal(null); // Close modal if open
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.map(i => i.cartItemId === cartItemId ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0));
  };

  // --- MATH ---
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const isEligibleForOffer = subtotal >= 349;
  const discount = isEligibleForOffer ? subtotal * 0.10 : 0;
  const deliveryFee = (isEligibleForOffer || subtotal === 0) ? 0 : 49;
  const finalTotal = subtotal - discount + deliveryFee;

  // --- SCROLL NAV ---
  const scrollToCategory = (cat) => {
    document.getElementById(cat)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // --- GPS ---
  const fetchLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setFormData({ ...formData, lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => alert("Please allow location access for accurate delivery.")
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // --- SUBMISSION ---
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!formData.lat || !formData.lng) return alert("Please fetch your GPS location for delivery.");
    setIsSubmitting(true);

    const orderPayload = { ...formData, items: cart, subtotal, discount, deliveryFee, finalTotal };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      
      if (!res.ok) throw new Error("Database save failed");

      // Build WA Text
      let waText = `*New Order from ${formData.name}* 🚀\n`;
      waText += `📞 Phone: ${formData.phone}\n`;
      waText += `📍 Map: https://maps.google.com/?q=$${formData.lat},${formData.lng}\n`;
      waText += `🏠 Address: ${formData.address}\n\n*Items:*\n`;
      cart.forEach(i => { waText += `- ${i.qty}x ${i.name} (₹${i.price})\n`; });
      waText += `\nSubtotal: ₹${subtotal}\n`;
      if (discount > 0) waText += `Discount (10%): -₹${discount.toFixed(2)}\n`;
      waText += `Delivery: ₹${deliveryFee}\n`;
      waText += `*Total: ₹${finalTotal.toFixed(2)}*`;

      window.location.href = `https://wa.me/918938909876?text=${encodeURIComponent(waText)}`;
    } catch (error) {
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  // --- VIEWS ---
  if (showCheckout) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center p-4 md:p-10 text-slate-800">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden h-fit">
          <div className="bg-red-800 p-4 text-white flex items-center">
            <button onClick={() => setShowCheckout(false)} className="mr-4 font-bold text-xl">←</button>
            <h2 className="text-xl font-bold">Checkout</h2>
          </div>
          <form onSubmit={handleCheckout} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-600">Full Name</label>
              <input required type="text" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-800 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-600">WhatsApp Number</label>
              <input required type="tel" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-800 outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-600">Complete Address (Train/Home)</label>
              <textarea required rows="3" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-800 outline-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <button type="button" onClick={fetchLocation} className={`w-full p-3 rounded-lg font-bold flex justify-center items-center gap-2 transition ${formData.lat ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'}`}>
              {formData.lat ? '✅ Exact Location Captured' : '📍 Auto-Fetch My GPS Location'}
            </button>
            <div className="border-t border-slate-200 pt-4 mt-6">
              <div className="flex justify-between items-center text-xl font-black text-slate-800 mb-4">
                <span>To Pay</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full bg-red-800 text-white p-4 rounded-xl font-bold text-lg hover:bg-red-900 transition flex justify-center items-center shadow-lg">
                {isSubmitting ? 'Processing...' : 'Place Order via WhatsApp'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 md:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-800 rounded-full flex items-center justify-center text-white font-black text-xl border-2 border-amber-400 shadow-md">TT</div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Tadka Theory</h1>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Science of Deliciousness</p>
            </div>
          </div>
        </div>
        
        {/* Sticky Category Nav */}
        <div className="border-t border-slate-100 overflow-x-auto hide-scrollbar bg-white">
          <div className="flex px-4 py-3 gap-6 max-w-6xl mx-auto min-w-max">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => scrollToCategory(cat)} className="text-sm font-bold text-slate-500 hover:text-red-800 whitespace-nowrap transition">
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Menu Items (Left 2/3) */}
        <div className="lg:col-span-2 space-y-10">
          {CATEGORIES.map(category => {
            const categoryItems = MENU.filter(item => item.category === category);
            if (categoryItems.length === 0) return null;
            
            return (
              <div key={category} id={category} className="scroll-mt-36">
                <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                  {category}
                  <div className="h-px bg-slate-200 flex-grow ml-4 mt-2"></div>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryItems.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 hover:shadow-md transition group relative overflow-hidden">
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {item.isVeg && <div className="w-4 h-4 border border-green-600 flex items-center justify-center rounded-sm"><div className="w-2 h-2 bg-green-600 rounded-full"></div></div>}
                            {item.isBestseller && <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Bestseller</span>}
                          </div>
                          <h3 className="font-bold text-slate-800 text-lg leading-tight">{item.name}</h3>
                          <p className="text-slate-500 text-sm mt-1 mb-2 line-clamp-2">{item.desc}</p>
                        </div>
                        <div className="font-black text-slate-800">₹{item.price || item.basePrice}</div>
                      </div>
                      
                      <div className="w-32 flex flex-col items-center justify-between">
                        <img src={item.image} alt={item.name} className="w-28 h-28 object-cover rounded-xl shadow-sm" />
                        <button onClick={() => handleAddClick(item)} className="bg-red-50 text-red-800 border border-red-200 font-bold px-6 py-1.5 rounded-lg text-sm uppercase -mt-4 shadow-sm hover:bg-red-100 transition relative z-10">
                          ADD {item.variants && <span className="absolute -top-2 -right-2 text-[10px] bg-amber-400 text-white w-4 h-4 rounded-full flex items-center justify-center">+</span>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart (Right 1/3) */}
        <div className="hidden lg:block relative">
          <div className="sticky top-36 bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-xl font-black text-slate-800 mb-6">Your Cart</h2>
            
            {cart.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <div className="text-4xl mb-3">🛒</div>
                <p>Your cart is empty</p>
                <p className="text-sm mt-1">Add items to get started</p>
              </div>
            ) : (
              <div className="flex flex-col h-full max-h-[60vh]">
                <div className="overflow-y-auto pr-2 space-y-4 mb-4 flex-grow hide-scrollbar">
                  {cart.map(item => (
                    <div key={item.cartItemId} className="flex justify-between items-start">
                      <div className="flex-grow pr-4">
                        <div className="text-sm font-semibold text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-500">₹{item.price}</div>
                      </div>
                      <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-lg px-2 py-1">
                        <button onClick={() => removeFromCart(item.cartItemId)} className="text-red-800 font-bold px-1">−</button>
                        <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                        <button onClick={() => addToCart({id: item.id, name: item.name.split(' (')[0]}, {name: item.name.split('(')[1]?.replace(')',''), price: item.price})} className="text-red-800 font-bold px-1">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-slate-200 pt-4 space-y-2 text-sm text-slate-600 mb-6">
                  <div className="flex justify-between"><span>Item Total</span><span className="font-semibold text-slate-800">₹{subtotal}</span></div>
                  <div className="flex justify-between text-green-600"><span>Discount (10%)</span><span className="font-semibold">-₹{discount.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Delivery Fee</span><span className="font-semibold">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
                </div>

                {!isEligibleForOffer && subtotal > 0 && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold p-3 rounded-xl mb-4 text-center">
                    Add ₹{349 - subtotal} more for 10% OFF + Free Delivery!
                  </div>
                )}

                <div className="flex justify-between items-center text-xl font-black text-slate-800 mb-4 border-t border-slate-200 pt-4">
                  <span>To Pay</span><span>₹{finalTotal.toFixed(2)}</span>
                </div>

                <button onClick={() => setShowCheckout(true)} className="w-full bg-red-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-900 transition shadow-md">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Floating Cart Button */}
      {cart.length > 0 && !showCheckout && (
        <div className="fixed bottom-0 left-0 w-full p-4 lg:hidden bg-white border-t border-slate-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50">
          <button onClick={() => setShowCheckout(true)} className="w-full bg-red-800 text-white p-4 rounded-xl flex justify-between items-center shadow-lg">
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-red-200">{cart.reduce((a,b)=>a+b.qty,0)} ITEMS</span>
              <span className="font-black text-lg">₹{finalTotal.toFixed(2)}</span>
            </div>
            <div className="font-bold flex items-center gap-2">
              Checkout <span className="text-xl">→</span>
            </div>
          </button>
        </div>
      )}

      {/* Variant Selection Modal */}
      {activeItemModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-slate-800">{activeItemModal.name}</h3>
                <p className="text-sm text-slate-500 mt-1">Customize your item</p>
              </div>
              <button onClick={() => setActiveItemModal(null)} className="bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center text-slate-500 font-bold transition">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="space-y-3">
                {activeItemModal.variants.map((variant, idx) => (
                  <label key={variant.name} className={`flex justify-between items-center p-4 rounded-xl border-2 cursor-pointer transition ${selectedVariantIndex === idx ? 'border-red-800 bg-red-50' : 'border-slate-100 hover:border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedVariantIndex === idx ? 'border-red-800' : 'border-slate-300'}`}>
                        {selectedVariantIndex === idx && <div className="w-2.5 h-2.5 bg-red-800 rounded-full"></div>}
                      </div>
                      <span className={`font-semibold ${selectedVariantIndex === idx ? 'text-red-800' : 'text-slate-700'}`}>{variant.name}</span>
                    </div>
                    <span className="font-bold text-slate-800">₹{variant.price}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
              <button 
                onClick={() => addToCart(activeItemModal, activeItemModal.variants[selectedVariantIndex])}
                className="w-full bg-red-800 text-white p-4 rounded-xl font-bold text-lg hover:bg-red-900 transition flex justify-between items-center shadow-md">
                <span>Add to Cart</span>
                <span>₹{activeItemModal.variants[selectedVariantIndex].price}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}