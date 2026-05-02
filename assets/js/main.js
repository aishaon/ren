const App = {
    data: {
        user: null,
        cart: [],
        isLoggedIn: false
    },

    init() {
        this.checkAuth();
        this.initCart();
        this.bindEvents();
    },

    checkAuth() {
        const userData = localStorage.getItem('ren_user');
        if (userData) {
            this.data.user = JSON.parse(userData);
            this.data.isLoggedIn = true;
        }
    },

    initCart() {
        const cartData = localStorage.getItem('ren_cart');
        if (cartData) {
            this.data.cart = JSON.parse(cartData);
        }
        this.updateCartCount();
    },

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-dropdown]')) {
                const dropdown = e.target.closest('[data-dropdown]');
                this.toggleDropdown(dropdown);
            }
            if (e.target.closest('[data-modal]')) {
                const modal = e.target.closest('[data-modal]');
                this.openModal(modal.dataset.modal);
            }
            if (e.target.closest('[data-close-modal]')) {
                this.closeModal();
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.closest('[data-search]')) {
                this.handleSearch(e.target.closest('[data-search]'));
            }
        });
    },

    toggleDropdown(element) {
        const dropdownId = element.dataset.dropdown;
        const dropdown = document.getElementById(dropdownId);
        
        document.querySelectorAll('.dropdown-content').forEach(d => {
            if (d.id !== dropdownId) d.classList.add('hidden');
        });
        
        dropdown.classList.toggle('hidden');
        event.stopPropagation();
    },

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal() {
        document.querySelectorAll('[id^="modal-"]').forEach(modal => {
            modal.classList.add('hidden');
        });
        document.body.style.overflow = 'auto';
    },

    handleSearch(element) {
        const query = element.value.toLowerCase();
        const targetId = element.dataset.search;
        const items = document.querySelectorAll(`[data-${targetId}]`);
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    },

    addToCart(product) {
        const existingItem = this.data.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.data.cart.push({ ...product, quantity: 1 });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showToast('Product added to cart!', 'success');
    },

    removeFromCart(productId) {
        this.data.cart = this.data.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
    },

    updateQuantity(productId, quantity) {
        const item = this.data.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.saveCart();
        }
    },

    saveCart() {
        localStorage.setItem('ren_cart', JSON.stringify(this.data.cart));
    },

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('[data-cart-count]');
        const totalItems = this.data.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        cartCountElements.forEach(el => {
            el.textContent = totalItems;
        });
    },

    getCartTotal() {
        return this.data.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-y-0 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translate-y-full';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    login(email, password) {
        this.data.user = {
            id: 1,
            name: 'John Doe',
            email: email,
            role: 'user',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=2563eb&color=fff'
        };
        this.data.isLoggedIn = true;
        localStorage.setItem('ren_user', JSON.stringify(this.data.user));
        this.closeModal();
        this.showToast('Welcome back!', 'success');
        window.location.reload();
    },

    logout() {
        this.data.user = null;
        this.data.isLoggedIn = false;
        localStorage.removeItem('ren_user');
        window.location.href = 'index.html';
    },

    formatPrice(price) {
        return '৳' + price.toLocaleString('en-BD');
    },

    formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-BD', options);
    },

    starRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
            } else if (i - 0.5 === rating) {
                stars += '<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
            } else {
                stars += '<svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
            }
        }
        return stars;
    },

    renderCharts() {
        const chartCanvases = document.querySelectorAll('[data-chart]');
        
        chartCanvases.forEach(canvas => {
            const type = canvas.dataset.chart;
            const ctx = canvas.getContext('2d');
            
            if (type === 'line') {
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Sales',
                            data: [12, 19, 3, 5, 2, 3],
                            borderColor: '#2563eb',
                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                });
            } else if (type === 'doughnut') {
                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Pending', 'Completed', 'Cancelled'],
                        datasets: [{
                            data: [12, 19, 3],
                            backgroundColor: ['#f59e0b', '#10b981', '#ef4444']
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'bottom' }
                        }
                    }
                });
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
    
    if (document.querySelectorAll('[data-chart]').length > 0) {
        App.renderCharts();
    }
});

const dummyData = {
    entrepreneurs: [
        {
            id: 1,
            name: 'Md. Rahim Islam',
            company: 'Rahim Tech Solutions',
            category: 'Technology',
            location: 'Rangpur',
            avatar: 'https://ui-avatars.com/api/?name=Md+Rahim+Islam&background=2563eb&color=fff',
            cover: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
            rating: 4.8,
            reviews: 156,
            products: 45,
            description: 'Leading IT solutions provider in Rangpur offering web development, mobile apps, and software solutions.',
            phone: '+880 1712 345678',
            email: 'rahim@rahimtech.com',
            address: 'House 45, Road 12, Dhap Road, Rangpur',
            established: 2018,
            verified: true
        },
        {
            id: 2,
            name: 'Fatema Begum',
            company: 'Fashion House Rangpur',
            category: 'Fashion',
            location: 'Rangpur',
            avatar: 'https://ui-avatars.com/api/?name=Fatema+Begum&background=ec4899&color=fff',
            cover: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
            rating: 4.9,
            reviews: 234,
            products: 120,
            description: 'Premium fashion house specializing in traditional and modern Bengali dresses.',
            phone: '+880 1712 345679',
            email: 'fatema@fashionhouse.com',
            address: 'Shop 12, Main Market, Rangpur',
            established: 2015,
            verified: true
        },
        {
            id: 3,
            name: 'Ahmed Khan',
            company: 'Khan Agro Industries',
            category: 'Agriculture',
            location: 'Gangachara',
            avatar: 'https://ui-avatars.com/api/?name=Ahmed+Khan&background=10b981&color=fff',
            cover: 'https://images.unsplash.com/photo-1625246333195-78d9c38adc42?w=800',
            rating: 4.7,
            reviews: 89,
            products: 25,
            description: 'Organic food producer and supplier based in Rangpur region.',
            phone: '+880 1712 345680',
            email: 'ahmed@khanagro.com',
            address: 'Village: Harintana, Gangachara, Rangpur',
            established: 2020,
            verified: false
        },
        {
            id: 4,
            name: 'Sarah Rahman',
            company: 'Sweet Home Bakery',
            category: 'Food & Beverage',
            location: 'Rangpur',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Rahman&background=f59e0b&color=fff',
            cover: 'https://images.unsplash.com/photo-1486427944544-d2c612e6b616?w=800',
            rating: 4.9,
            reviews: 312,
            products: 50,
            description: 'Premium cakes, pastries, and baked goods for all occasions.',
            phone: '+880 1712 345681',
            email: 'sarah@sweethome.com',
            address: 'House 23, Station Road, Rangpur',
            established: 2017,
            verified: true
        },
        {
            id: 5,
            name: 'Mirza Hasan',
            company: 'Hasan Consulting',
            category: 'Business Services',
            location: 'Rangpur',
            avatar: 'https://ui-avatars.com/api/?name=Mirza+Hasan&background=8b5cf6&color=fff',
            cover: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
            rating: 4.6,
            reviews: 67,
            products: 8,
            description: 'Business consulting and financial advisory services.',
            phone: '+880 1712 345682',
            email: 'mirza@hasanconsulting.com',
            address: 'Office 304, Tower Plaza, Rangpur',
            established: 2019,
            verified: true
        },
        {
            id: 6,
            name: 'Nusrat Jahan',
            company: 'Creative Arts Studio',
            category: 'Design & Creative',
            location: 'Rangpur',
            avatar: 'https://ui-avatars.com/api/?name=Nusrat+Jahan&background=ef4444&color=fff',
            cover: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
            rating: 4.8,
            reviews: 145,
            products: 30,
            description: 'Graphic design, branding, and creative marketing services.',
            phone: '+880 1712 345683',
            email: 'nusrat@creativearts.com',
            address: 'House 78, Carmichael College Road, Rangpur',
            established: 2016,
            verified: true
        }
    ],
    
    products: [
        {
            id: 1,
            name: 'Premium Responsive Website',
            price: 15000,
            category: 'Technology',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
            vendor: 'Rahim Tech Solutions',
            vendorId: 1,
            description: 'Professional responsive website with modern design and full functionality.',
            rating: 4.8,
            reviews: 45,
            stock: 10,
            featured: true
        },
        {
            id: 2,
            name: 'Traditional Panjabi Set',
            price: 2500,
            category: 'Fashion',
            image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
            vendor: 'Fashion House Rangpur',
            vendorId: 2,
            description: 'Premium cotton panjabi with classic design. Available in multiple sizes.',
            rating: 4.9,
            reviews: 89,
            stock: 50,
            featured: true
        },
        {
            id: 3,
            name: 'Organic Rice (5kg)',
            price: 450,
            category: 'Agriculture',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001-31ca?w=400',
            vendor: 'Khan Agro Industries',
            vendorId: 3,
            description: 'Premium quality organic rice from local farms.',
            rating: 4.7,
            reviews: 34,
            stock: 100,
            featured: false
        },
        {
            id: 4,
            name: 'Custom Birthday Cake',
            price: 1800,
            category: 'Food & Beverage',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9580?w=400',
            vendor: 'Sweet Home Bakery',
            vendorId: 4,
            description: 'Custom designed birthday cake with premium ingredients.',
            rating: 4.9,
            reviews: 156,
            stock: 20,
            featured: true
        },
        {
            id: 5,
            name: 'Business Plan Consultation',
            price: 5000,
            category: 'Business Services',
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
            vendor: 'Hasan Consulting',
            vendorId: 5,
            description: 'Professional business plan development and consultation.',
            rating: 4.6,
            reviews: 23,
            stock: 5,
            featured: false
        },
        {
            id: 6,
            name: 'Brand Logo Design',
            price: 3000,
            category: 'Design & Creative',
            image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
            vendor: 'Creative Arts Studio',
            vendorId: 6,
            description: 'Professional logo design with unlimited revisions.',
            rating: 4.8,
            reviews: 78,
            stock: 15,
            featured: true
        },
        {
            id: 7,
            name: 'Mobile App Development',
            price: 25000,
            category: 'Technology',
            image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
            vendor: 'Rahim Tech Solutions',
            vendorId: 1,
            description: 'Cross-platform mobile application development.',
            rating: 4.9,
            reviews: 56,
            stock: 8,
            featured: true
        },
        {
            id: 8,
            name: 'Kurti Collection',
            price: 1800,
            category: 'Fashion',
            image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0edd5?w=400',
            vendor: 'Fashion House Rangpur',
            vendorId: 2,
            description: 'Handcrafted kurti collection with traditional motifs.',
            rating: 4.7,
            reviews: 67,
            stock: 40,
            featured: false
        }
    ],
    
    events: [
        {
            id: 1,
            title: 'Entrepreneurship Summit 2026',
            date: '2026-05-15',
            time: '10:00 AM',
            location: 'Rangpur City Hall',
            organizer: 'REN',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
            description: 'Join us for the biggest entrepreneurship event in Rangpur featuring industry leaders and successful entrepreneurs.',
            attendees: 250,
            category: 'Summit'
        },
        {
            id: 2,
            title: 'Digital Marketing Workshop',
            date: '2026-05-22',
            time: '2:00 PM',
            location: 'REN Training Center',
            organizer: 'Creative Arts Studio',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
            description: 'Learn the latest digital marketing strategies from industry experts.',
            attendees: 50,
            category: 'Workshop'
        },
        {
            id: 3,
            title: 'Networking Night',
            date: '2026-06-01',
            time: '6:00 PM',
            location: 'Hotel Grand Kulik',
            organizer: 'REN',
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600',
            description: 'Connect with fellow entrepreneurs and expand your business network.',
            attendees: 100,
            category: 'Networking'
        }
    ],
    
    blogPosts: [
        {
            id: 1,
            title: 'How to Start Your Business in Rangpur',
            author: 'Md. Rahim Islam',
            authorAvatar: 'https://ui-avatars.com/api/?name=Md+Rahim+Islam&background=2563eb&color=fff',
            date: '2026-04-20',
            image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=600',
            excerpt: 'A comprehensive guide for aspiring entrepreneurs looking to start their journey in Rangpur.',
            content: 'Full article content here...',
            category: 'Guide',
            views: 1250
        },
        {
            id: 2,
            title: 'Success Story: From Small Shop to Big Business',
            author: 'Fatema Begum',
            authorAvatar: 'https://ui-avatars.com/api/?name=Fatema+Begum&background=ec4899&color=fff',
            date: '2026-04-15',
            image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600',
            excerpt: 'Discover how Fashion House Rangpur grew from a small shop to a renowned brand.',
            content: 'Full article content here...',
            category: 'Success Story',
            views: 890
        },
        {
            id: 3,
            title: 'Digital Transformation for Small Businesses',
            author: 'Mirza Hasan',
            authorAvatar: 'https://ui-avatars.com/api/?name=Mirza+Hasan&background=8b5cf6&color=fff',
            date: '2026-04-10',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
            excerpt: 'Tips and strategies for small businesses to embrace digital transformation.',
            content: 'Full article content here...',
            category: 'Technology',
            views: 654
        }
    ],
    
    testimonials: [
        {
            id: 1,
            name: 'Md. Rahim Islam',
            company: 'Rahim Tech Solutions',
            avatar: 'https://ui-avatars.com/api/?name=Md+Rahim+Islam&background=2563eb&color=fff',
            content: 'REN has been instrumental in connecting us with clients and providing valuable networking opportunities.',
            rating: 5
        },
        {
            id: 2,
            name: 'Fatema Begum',
            company: 'Fashion House Rangpur',
            avatar: 'https://ui-avatars.com/api/?name=Fatema+Begum&background=ec4899&color=fff',
            content: 'The vendor dashboard has helped us grow our online presence and manage orders efficiently.',
            rating: 5
        },
        {
            id: 3,
            name: 'Ahmed Khan',
            company: 'Khan Agro Industries',
            avatar: 'https://ui-avatars.com/api/?name=Ahmed+Khan&background=10b981&color=fff',
            content: 'As a new entrepreneur, REN has provided all the support and resources I needed to succeed.',
            rating: 4
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, dummyData };
}