import { useMemo, useState } from 'react';
import {
  ArrowDownRight, ArrowRight, Check, ChevronDown, Heart,
  LockKeyhole, PackageCheck, Search, ShieldCheck, ShoppingBag,
  Truck, UserRound, X,
} from 'lucide-react';

const image = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

const products = [
  { id: 1, name: 'Relaxed cotton overshirt', category: 'Men', type: 'Shirts', price: 89, color: 'Stone', image: 'photo-1598033129183-c4f50c736f10', badge: 'BESTSELLER' },
  { id: 2, name: 'Everyday graphic tee', category: 'Men', type: 'T-shirts', price: 39, color: 'Washed blue', image: 'photo-1521572163474-6864f9cf17ab', badge: 'NEW' },
  { id: 3, name: 'The essential black tee', category: 'Men', type: 'T-shirts', price: 35, color: 'Black', image: 'photo-1503342217505-b0a15ec3261c' },
  { id: 4, name: 'Soft ribbed long sleeve', category: 'Women', type: 'Tops', price: 49, color: 'Ivory', image: 'photo-1551163943-3f6a855d1153', badge: 'NEW' },
  { id: 5, name: 'Modern utility jacket', category: 'Men', type: 'Jackets', price: 129, color: 'Olive', image: 'photo-1515886657613-9f3515b0c78f' },
  { id: 6, name: 'The Sunday knit', category: 'Women', type: 'Knitwear', price: 79, color: 'Oatmeal', image: 'photo-1576566588028-4147f3842f27' },
  { id: 7, name: 'Easy wide-leg trousers', category: 'Women', type: 'Trousers', price: 95, color: 'Mushroom', image: 'photo-1483985988355-763728e1935b' },
  { id: 8, name: 'Everyday crew sweatshirt', category: 'Kids', type: 'Sweatshirts', price: 45, color: 'Heather grey', image: 'photo-1519238263530-99bdd11df2ea' },
  { id: 9, name: 'City walk trench coat', category: 'Women', type: 'Jackets', price: 169, color: 'Sand', image: 'photo-1539109136881-3be0616acf4b', badge: 'LIMITED' },
  { id: 10, name: 'Weekend canvas tote', category: 'Accessories', type: 'Accessories', price: 29, color: 'Natural', image: 'photo-1544816155-12df9643f363' },
  { id: 11, name: 'Little explorer jacket', category: 'Kids', type: 'Jackets', price: 69, color: 'Navy', image: 'photo-1503919005314-30d93d07d823' },
  { id: 12, name: 'Clean skin essentials', category: 'Beauty', type: 'Beauty', price: 32, color: 'Daily ritual', image: 'photo-1608248543803-ba4f8c70ae0b' },
];

const categories = ['Men', 'Women', 'Kids', 'Beauty'];

const belongsToCategory = (product, category) => (
  product.category === category || (category === 'Men' && product.category === 'Accessories')
);

function App() {
  const [page, setPage] = useState('home');
  const [category, setCategory] = useState('Men');
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState(null);
  const [searchOriginPage, setSearchOriginPage] = useState('home');
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sort, setSort] = useState('Featured');
  const [toast, setToast] = useState('');

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };
  const goTo = (nextPage) => {
    setPage(nextPage);
    setSearchOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openCategory = (item) => {
    setCategory(item);
    setSearchTerm('');
    setSearchCategory(item);
    goTo('category');
  };
  const toggleSearch = () => {
    if (searchOpen) {
      setSearchOpen(false);
      setPage(searchOriginPage);
      return;
    }
    setSearchOriginPage(page);
    setSearchCategory(page === 'category' ? category : null);
    setSearchOpen(true);
    setPage('search');
  };
  const closeSearch = () => {
    setSearchOpen(false);
    setPage(searchOriginPage);
  };
  const openProduct = (product) => {
    setSelectedProduct(product);
    goTo('product');
  };
  const toggleWishlist = (product) => {
    const saved = wishlist.some((item) => item.id === product.id);
    setWishlist(saved ? wishlist.filter((item) => item.id !== product.id) : [...wishlist, product]);
    showToast(saved ? 'Removed from wishlist' : 'Added to wishlist');
  };
  const addToCart = (product, size = 'M') => {
    setCart((items) => [...items, { ...product, size, cartId: `${product.id}-${Date.now()}` }]);
    showToast('Added to your bag');
  };
  const visibleProducts = useMemo(() => {
    let result = page === 'category'
      ? products.filter((item) => belongsToCategory(item, category))
      : page === 'wishlist'
        ? wishlist
        : products;
    if (page === 'search') {
      result = products.filter((item) => (
        (!searchCategory || belongsToCategory(item, searchCategory))
        && (!searchTerm.trim() || `${item.name} ${item.category} ${item.type}`.toLowerCase().includes(searchTerm.trim().toLowerCase()))
      ));
    }
    if (sort === 'Price: low to high') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'Price: high to low') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [category, page, searchTerm, sort, wishlist]);

  const renderProducts = (items, options = {}) => (
    <div className={`product-grid ${options.compact ? 'product-grid--compact' : ''}`}>
      {items.map((product) => (
        <ProductCard key={product.id} product={product} isSaved={wishlist.some((item) => item.id === product.id)}
          onOpen={openProduct} onSave={toggleWishlist} />
      ))}
    </div>
  );

  return (
    <div className="site-shell">
      <div className="announcement">
        <span>FREE DELIVERY ON ORDERS ABOVE $99</span>
        <div><button onClick={() => showToast('The NOVA app is coming soon')}>DOWNLOAD APP</button><i /> <button onClick={() => setAccountOpen(true)}>TRACK ORDER</button><i /> <button onClick={() => showToast('Need a hand? hello@nova.store')}>HELP</button></div>
      </div>
      <header className="header">
        <button className={`icon-button mobile-menu-button ${mobileMenuOpen ? 'mobile-menu-button--open' : ''}`} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen} aria-controls="main-navigation" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><span className="menu-icon" aria-hidden="true"><span /><span /><span /></span></button>
        <nav id="main-navigation" className={`main-nav ${mobileMenuOpen ? 'main-nav--open' : ''}`} aria-label="Main navigation">
          {categories.map((item) => <button key={item} className={page === 'category' && category === item ? 'nav-active' : ''} onClick={() => openCategory(item)}>{item}</button>)}
        </nav>
        <button className="wordmark" onClick={() => goTo('home')} aria-label="NOVA home">NOVA</button>
        <div className="header-actions">
          <button className="header-action" aria-expanded={searchOpen} onClick={toggleSearch}><Search /><span>SEARCH</span></button>
          <button className="header-action" onClick={() => setAccountOpen(true)}><UserRound /><span>LOGIN</span></button>
          <button className="header-action" onClick={() => goTo('wishlist')}><Heart /><span>WISHLIST</span>{wishlist.length > 0 && <b>{wishlist.length}</b>}</button>
          <button className="header-action" onClick={() => goTo('cart')}><ShoppingBag /><span>BAG ({cart.length})</span></button>
        </div>
      </header>

      {searchOpen && (
        <div className="search-panel">
          <Search size={20} /><input autoFocus aria-label={searchCategory ? `Search in ${searchCategory}` : 'Search products'} value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value); setPage('search'); }} placeholder={searchCategory ? `Search in ${searchCategory}...` : 'Search for something you love...'} />
          <button className="icon-button" aria-label="Close search" onClick={closeSearch}><X /></button>
          {searchTerm && <button className="search-submit" onClick={() => { setPage('search'); setSearchOpen(false); }}>VIEW RESULTS <ArrowRight size={14} /></button>}
        </div>
      )}

      {page === 'home' && <HomePage renderProducts={renderProducts} openCategory={openCategory} goTo={goTo} openProduct={openProduct} />}
      {page === 'category' && <CategoryPage category={category} products={visibleProducts} sort={sort} setSort={setSort} renderProducts={renderProducts} />}
      {page === 'search' && <ListingPage title={searchTerm ? `Results for “${searchTerm}”` : 'Find your new favorite'} products={visibleProducts} sort={sort} setSort={setSort} renderProducts={renderProducts} empty="Try another search — your next favorite is out there." />}
      {page === 'wishlist' && <ListingPage title="Your wishlist" subtitle="The pieces you love, all in one place." products={visibleProducts} sort={sort} setSort={setSort} renderProducts={renderProducts} empty="Your wishlist is waiting for a little love." />}
      {page === 'product' && <ProductPage product={selectedProduct} isSaved={wishlist.some((item) => item.id === selectedProduct.id)} onSave={toggleWishlist} onAdd={addToCart} />}
      {page === 'cart' && <CartPage cart={cart} setCart={setCart} goTo={goTo} />}
      {page === 'checkout' && <CheckoutPage cart={cart} onComplete={() => { setCart([]); goTo('confirmation'); }} />}
      {page === 'confirmation' && <ConfirmationPage goTo={goTo} />}

      <Footer openCategory={openCategory} goTo={goTo} />
      {accountOpen && <AccountModal onClose={() => setAccountOpen(false)} />}
      {toast && <div className="toast"><Check size={16} />{toast}</div>}
    </div>
  );
}

function HomePage({ renderProducts, openCategory, goTo, openProduct }) {
  return (
    <main>
      <section className="hero">
        <img className="hero-image" src={image('photo-1539109136881-3be0616acf4b', 2000)} alt="Model in a modern neutral outfit" />
        <div className="hero-wash" />
        <div className="hero-kicker">FASHION<br />THAT MOVES<br />WITH YOU<span /></div>
        <div className="hero-word">NOVA</div>
        <div className="hero-copy"><p>THE EVERYDAY<br />STARTS HERE.</p><button className="button button--dark" onClick={() => openCategory('Men')}>SHOP THE COLLECTION <ArrowRight size={15} /></button></div>
        <div className="hero-edition">NEW<br />COLLECTION<br /><strong>2025</strong><span /></div>
        <div className="hero-scroll"><ArrowDownRight size={15} /> SCROLL TO EXPLORE</div>
      </section>

      <section className="category-strip">
        {[
          { title: 'MEN', text: 'Elevated everyday essentials.', image: 'photo-1516826957135-700dedea698c', alt: 'Men collection' },
          { title: 'WOMEN', text: 'Effortless style for every you.', image: 'photo-1529139574466-a303027c1d8b', alt: 'Women collection' },
          { title: 'KIDS', text: 'Comfort meets cool everyday.', image: 'photo-1519238263530-99bdd11df2ea', alt: 'Kids collection' },
        ].map((item) => (
          <button className="category-tile" key={item.title} onClick={() => openCategory(item.title[0] + item.title.slice(1).toLowerCase())}>
            <img src={image(item.image, 340)} alt={item.alt} /><span className="category-tile-copy"><strong>{item.title}</strong><small>{item.text}</small><b>SHOP {item.title} <ArrowRight size={13} /></b></span>
          </button>
        ))}
      </section>

      <section className="season-banner">
        <img src={image('photo-1529139574466-a303027c1d8b', 1800)} alt="Model wearing the new season collection" />
        <div className="season-copy"><span>NEW SEASON</span><h2>NEW<br />VIBES</h2><p>Discover everything<br />new and now.</p><button className="button button--dark" onClick={() => openCategory('Women')}>EXPLORE COLLECTION <ArrowRight size={15} /></button></div>
      </section>

      <section className="benefits" aria-label="Shopping benefits">
        <Benefit icon={<Truck />} title="FAST DELIVERY" text="Quick & safe delivery" />
        <Benefit icon={<PackageCheck />} title="EASY RETURNS" text="Within 15 days" />
        <Benefit icon={<ShieldCheck />} title="QUALITY ASSURED" text="Best fashion, best quality" />
        <Benefit icon={<LockKeyhole />} title="SECURE PAYMENT" text="100% secure checkout" />
      </section>

      <section className="best-section">
        <div className="section-heading"><div><span className="eyebrow">MADE FOR YOUR EVERYDAY</span><h2>BEST OF NOVA</h2></div><button className="text-link" onClick={() => openCategory('Men')}>VIEW ALL <ArrowRight size={14} /></button></div>
        {renderProducts(products.slice(0, 4), { compact: true })}
      </section>

      <section className="story-section">
        <div className="story-photo"><img src={image('photo-1525507119028-ed4c629a60a3', 1100)} alt="Timeless wardrobe essentials" /></div>
        <div className="story-copy"><span className="eyebrow">A LITTLE LESS, A LOT BETTER</span><h2>Made to be<br /><em>worn on repeat.</em></h2><p>Thoughtful fits, feel-good fabrics and pieces that make getting dressed the easiest part of your day.</p><button className="text-link" onClick={() => openCategory('Women')}>GET TO KNOW NOVA <ArrowRight size={14} /></button></div>
      </section>

      <section className="newsletter"><span className="eyebrow">GOOD THINGS, OCCASIONALLY</span><h2>A little NOVA in your inbox.</h2><p>First dibs on new drops, considered edits and 10% off your first order.</p><Newsletter /></section>
    </main>
  );
}

function Benefit({ icon, title, text }) {
  return <div className="benefit">{icon}<span><strong>{title}</strong><small>{text}</small></span></div>;
}

function ProductCard({ product, isSaved, onOpen, onSave }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap" onClick={() => onOpen(product)} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && onOpen(product)}>
        <img src={image(product.image, 700)} alt={product.name} loading="lazy" />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button className={`save-button ${isSaved ? 'is-saved' : ''}`} aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'} onClick={(event) => { event.stopPropagation(); onSave(product); }}><Heart size={17} fill={isSaved ? 'currentColor' : 'none'} /></button>
        <button className="quick-add" onClick={(event) => { event.stopPropagation(); onOpen(product); }}>QUICK VIEW <ArrowRight size={13} /></button>
      </div>
      <div className="product-info"><div><h3>{product.name}</h3><span>{product.color}</span></div><strong>${product.price}</strong></div>
    </article>
  );
}

function CategoryPage({ category, products: items, sort, setSort, renderProducts }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const types = ['All', ...new Set(items.map((item) => item.type))];
  const filtered = activeFilter === 'All' ? items : items.filter((item) => item.type === activeFilter);
  return (
    <main className="listing-page">
      <div className="breadcrumb">HOME <span>/</span> {category.toUpperCase()}</div>
      <div className="listing-title"><div><span className="eyebrow">THE NOVA EDIT</span><h1>{category}</h1><p>Good things to wear, every day.</p></div><span className="item-count">{filtered.length} PIECES</span></div>
      <div className="listing-controls"><div className="filter-list">{types.map((type) => <button key={type} onClick={() => setActiveFilter(type)} className={activeFilter === type ? 'filter-active' : ''}>{type}</button>)}</div><SortSelect sort={sort} setSort={setSort} /></div>
      {filtered.length ? renderProducts(filtered) : <EmptyState text="We're refreshing this edit. Check back soon." />}
    </main>
  );
}

function ListingPage({ title, subtitle, products: items, sort, setSort, renderProducts, empty }) {
  return (
    <main className="listing-page listing-page--simple">
      <div className="breadcrumb"><button>HOME</button> <span>/</span> {title.toUpperCase()}</div>
      <div className="listing-title"><div><span className="eyebrow">SAVED FOR A GOOD DAY</span><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{items.length > 0 && <span className="item-count">{items.length} PIECES</span>}</div>
      {items.length > 0 ? <><div className="listing-controls"><span className="muted">{items.length} items</span><SortSelect sort={sort} setSort={setSort} /></div>{renderProducts(items)}</> : <EmptyState text={empty} />}
    </main>
  );
}

function SortSelect({ sort, setSort }) {
  return <label className="sort-select">SORT BY <select value={sort} onChange={(event) => setSort(event.target.value)}><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option></select><ChevronDown size={14} /></label>;
}

function EmptyState({ text }) {
  return <div className="empty-state"><Heart size={26} /><p>{text}</p><a href="#shop" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>KEEP EXPLORING <ArrowRight size={14} /></a></div>;
}

function ProductPage({ product, isSaved, onSave, onAdd }) {
  const [size, setSize] = useState('');
  const [added, setAdded] = useState(false);
  return (
    <main className="product-page">
      <div className="breadcrumb">HOME <span>/</span> {product.category.toUpperCase()} <span>/</span> {product.name.toUpperCase()}</div>
      <div className="product-detail">
        <div className="product-gallery"><img className="product-main-image" src={image(product.image, 1300)} alt={product.name} /><img src={image(product.image, 450)} alt={`${product.name} detail`} /></div>
        <div className="product-detail-info"><span className="eyebrow">{product.category} / {product.type}</span><h1>{product.name}</h1><div className="detail-price">${product.price}.00</div><p className="detail-description">An easy, considered essential made for wherever the day takes you. Crafted with comfort in mind and designed to wear on repeat.</p><div className="detail-color">COLOR <strong>{product.color}</strong></div><div className="size-title">SELECT SIZE <button onClick={() => setAdded(true)}>SIZE GUIDE</button></div><div className="size-picker">{['XS', 'S', 'M', 'L', 'XL'].map((item) => <button key={item} className={size === item ? 'size-selected' : ''} onClick={() => setSize(item)}>{item}</button>)}</div><button className="button button--dark add-to-bag" onClick={() => { if (!size) { setAdded(true); return; } onAdd(product, size); setAdded(false); }}>{size ? 'ADD TO BAG' : 'SELECT A SIZE'} <ShoppingBag size={16} /></button>{added && !size && <span className="size-hint">Please choose a size to continue.</span>}<button className={`detail-wishlist ${isSaved ? 'is-saved' : ''}`} onClick={() => onSave(product)}><Heart size={16} fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'SAVED TO WISHLIST' : 'ADD TO WISHLIST'}</button><div className="detail-perks"><Benefit icon={<Truck />} title="FREE DELIVERY" text="On orders over $99" /><Benefit icon={<PackageCheck />} title="EASY RETURNS" text="Within 15 days" /></div></div>
      </div>
    </main>
  );
}

function CartPage({ cart, setCart, goTo }) {
  const subtotal = cart.reduce((total, item) => total + item.price, 0);
  return (
    <main className="listing-page cart-page"><div className="breadcrumb">HOME <span>/</span> YOUR BAG</div><div className="listing-title"><div><span className="eyebrow">GOOD CHOICE</span><h1>Your bag</h1></div><span className="item-count">{cart.length} ITEMS</span></div>
      {!cart.length ? <EmptyState text="Your bag is looking a little light." /> : <div className="cart-layout"><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.cartId}><img src={image(item.image, 300)} alt={item.name} /><div className="cart-item-copy"><span className="eyebrow">{item.category}</span><h3>{item.name}</h3><span>Size: {item.size} · {item.color}</span><button onClick={() => setCart((items) => items.filter((cartItem) => cartItem.cartId !== item.cartId))}>REMOVE</button></div><strong>${item.price}.00</strong></div>)}</div><aside className="order-summary"><h2>ORDER SUMMARY</h2><div><span>Subtotal</span><strong>${subtotal}.00</strong></div><div><span>Shipping</span><span>{subtotal >= 99 ? 'FREE' : '$8.00'}</span></div><p>{subtotal >= 99 ? 'You unlocked free delivery.' : `You're $${99 - subtotal} away from free delivery.`}</p><div className="summary-total"><strong>Total</strong><strong>${subtotal + (subtotal >= 99 ? 0 : 8)}.00</strong></div><button className="button button--dark" onClick={() => goTo('checkout')}>CHECKOUT <ArrowRight size={15} /></button><small>Secure checkout · Easy 15-day returns</small></aside></div>}
    </main>
  );
}

function CheckoutPage({ cart, onComplete }) {
  const [payment, setPayment] = useState('Card');
  const subtotal = cart.reduce((total, item) => total + item.price, 0);
  const shipping = subtotal >= 99 ? 0 : 8;
  if (!cart.length) return <main className="listing-page"><EmptyState text="Your bag is empty. Add something lovely before checkout." /></main>;
  return (
    <main className="listing-page checkout-page">
      <div className="breadcrumb">HOME <span>/</span> YOUR BAG <span>/</span> CHECKOUT</div>
      <div className="listing-title"><div><span className="eyebrow">ALMOST YOURS</span><h1>Checkout</h1></div></div>
      <form className="checkout-layout" onSubmit={(event) => { event.preventDefault(); onComplete(); }}>
        <div className="checkout-form">
          <section className="checkout-section"><h2>CONTACT</h2><input aria-label="Email address" type="email" placeholder="Email address" required /><label className="checkbox-row"><input type="checkbox" /> Email me with news and offers</label></section>
          <section className="checkout-section"><h2>DELIVERY ADDRESS</h2><div className="input-grid"><input aria-label="First name" placeholder="First name" required /><input aria-label="Last name" placeholder="Last name" required /></div><input aria-label="Address" placeholder="Address" required /><div className="input-grid"><input aria-label="City" placeholder="City" required /><input aria-label="Postal code" placeholder="Postal code" required /></div><input aria-label="Country" placeholder="Country / Region" required /><input aria-label="Phone number" type="tel" placeholder="Phone number" required /></section>
          <section className="checkout-section"><h2>PAYMENT</h2><div className="payment-options">{['Card', 'PayPal'].map((option) => <button type="button" key={option} className={payment === option ? 'payment-active' : ''} onClick={() => setPayment(option)}>{option}</button>)}</div><p className="checkout-note">This is a demo checkout. No payment information is collected.</p></section>
          <button type="submit" className="button button--dark place-order">PLACE ORDER <ArrowRight size={15} /></button>
        </div>
        <aside className="order-summary"><h2>YOUR ORDER</h2>{cart.map((item) => <div className="checkout-item" key={item.cartId}><img src={image(item.image, 160)} alt="" /><span>{item.name}<small>Size {item.size}</small></span><strong>${item.price}.00</strong></div>)}<div><span>Subtotal</span><strong>${subtotal}.00</strong></div><div><span>Shipping</span><span>{shipping ? `$${shipping}.00` : 'FREE'}</span></div><div className="summary-total"><strong>Total</strong><strong>${subtotal + shipping}.00</strong></div><small>Secure checkout · Easy 15-day returns</small></aside>
      </form>
    </main>
  );
}

function ConfirmationPage({ goTo }) {
  return <main className="confirmation-page"><span className="confirmation-check"><Check size={25} /></span><span className="eyebrow">ORDER CONFIRMED</span><h1>That’s a good choice.</h1><p>Your demo order is all set. We’ve sent the details to your inbox.</p><button className="button button--dark" onClick={() => goTo('home')}>BACK TO THE GOOD STUFF <ArrowRight size={15} /></button></main>;
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  return <form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); if (email.includes('@')) setSubscribed(true); }}><input aria-label="Email address" type="email" required placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} /><button type="submit">{subscribed ? 'YOU’RE ON THE LIST' : 'SIGN ME UP'} <ArrowRight size={14} /></button></form>;
}

function AccountModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="account-modal"><button className="icon-button modal-close" aria-label="Close" onClick={onClose}><X /></button><span className="eyebrow">WELCOME TO NOVA</span><h2>{submitted ? 'You’re all set.' : 'Good to have you here.'}</h2><p>{submitted ? 'If there’s an account for this email, we’ll send you a sign-in link.' : 'Sign in or create an account to see your orders and save your favorites.'}</p>{!submitted && <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><input type="email" required placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} /><button className="button button--dark">CONTINUE WITH EMAIL <ArrowRight size={15} /></button></form>}<small>By continuing, you agree to our Terms & Privacy Policy.</small></section></div>;
}

function Footer({ openCategory, goTo }) {
  return <footer className="footer"><div className="footer-main"><div className="footer-brand"><button className="wordmark" onClick={() => goTo('home')}>NOVA</button><p>Good clothes for<br />the way you move.</p><div className="social-links"><a href="#instagram">IG</a><a href="#pinterest">P</a><a href="#tiktok">TK</a></div></div><div className="footer-column"><strong>EXPLORE</strong>{['Men', 'Women', 'Kids', 'Beauty'].map((item) => <button key={item} onClick={() => openCategory(item)}>{item}</button>)}</div><div className="footer-column"><strong>HELP</strong><button>Contact us</button><button>Delivery & returns</button><button>FAQs</button><button>Track your order</button></div><div className="footer-column"><strong>THE SMALL PRINT</strong><button>Our story</button><button>Privacy policy</button><button>Terms & conditions</button><button>Careers</button></div><div className="footer-signup"><strong>STAY IN THE LOOP</strong><p>New things, good things. Straight to your inbox.</p><Newsletter /></div></div><div className="footer-bottom"><span>© 2025 NOVA. MADE FOR EVERY DAY.</span><span>USD $ <ChevronDown size={12} /> <span className="footer-separator">·</span> MADE WITH INTENTION</span></div></footer>;
}

export default App;
