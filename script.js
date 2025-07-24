class UserSessionApp {
  constructor() {
    this.user = null
    this.location = null
    this.isLoading = true
    this.locationLoading = false

    this.init()
  }

  init() {
    this.bindEvents()
    this.checkExistingSession()

    // Initialize Lucide icons
    window.lucide = window.lucide || {} // Declare lucide variable
    if (typeof window.lucide.createIcons !== "undefined") {
      window.lucide.createIcons()
    }
  }

  bindEvents() {
    // Login form
    const loginForm = document.getElementById("login-form")
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e))
    }

    // Logout button
    const logoutBtn = document.getElementById("logout-btn")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.handleLogout())
    }

    // Location buttons
    const refreshLocationBtn = document.getElementById("refresh-location")
    const detectLocationBtn = document.getElementById("detect-location")

    if (refreshLocationBtn) {
      refreshLocationBtn.addEventListener("click", () => this.autoDetectLocation())
    }

    if (detectLocationBtn) {
      detectLocationBtn.addEventListener("click", () => this.autoDetectLocation())
    }
  }

  checkExistingSession() {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        this.user = parsedUser
        this.showDashboard()
        this.autoDetectLocation()
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("user")
        this.showLogin()
      }
    } else {
      this.showLogin()
    }
    this.hideLoading()
  }

  handleLogin(e) {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const errorElement = document.getElementById("error-message")

    // Clear previous errors
    this.hideError()

    // Simple validation
    if (!email || !password) {
      this.showError("Please fill in all fields")
      return
    }

    // Simulate login (in real app, this would be an API call)
    const userData = {
      id: Date.now().toString(),
      email: email,
      name: email.split("@")[0],
    }

    // Save user to localStorage for persistence
    localStorage.setItem("user", JSON.stringify(userData))
    this.user = userData

    // Show dashboard and auto-detect location
    this.showDashboard()
    this.autoDetectLocation()

    // Clear form
    document.getElementById("email").value = ""
    document.getElementById("password").value = ""
  }

  handleLogout() {
    localStorage.removeItem("user")
    localStorage.removeItem("location")
    this.user = null
    this.location = null
    this.showLogin()
  }

  autoDetectLocation() {
    this.locationLoading = true
    this.showLocationLoading()

    if (!navigator.geolocation) {
      this.showLocationError("Geolocation is not supported by this browser")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Try to get city/country from reverse geocoding
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          )
          const data = await response.json()

          const locationData = {
            latitude,
            longitude,
            city: data.city || "Unknown",
            country: data.countryName || "Unknown",
          }

          this.location = locationData
          localStorage.setItem("location", JSON.stringify(locationData))
          this.displayLocation()
        } catch (error) {
          // If reverse geocoding fails, just store coordinates
          const locationData = { latitude, longitude }
          this.location = locationData
          localStorage.setItem("location", JSON.stringify(locationData))
          this.displayLocation()
        }

        this.locationLoading = false
      },
      (error) => {
        console.error("Error getting location:", error)
        this.showLocationError("Unable to retrieve your location")
        this.locationLoading = false
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  showLogin() {
    document.getElementById("loading-screen").classList.add("hidden")
    document.getElementById("login-container").classList.remove("hidden")
    document.getElementById("dashboard").classList.add("hidden")
  }

  showDashboard() {
    document.getElementById("loading-screen").classList.add("hidden")
    document.getElementById("login-container").classList.add("hidden")
    document.getElementById("dashboard").classList.remove("hidden")

    // Update user info
    if (this.user) {
      document.getElementById("welcome-text").textContent = `Welcome, ${this.user.name}`
      document.getElementById("user-email").textContent = this.user.email
      document.getElementById("user-name").textContent = this.user.name
      document.getElementById("user-id").textContent = this.user.id
    }

    // Check for saved location
    const savedLocation = localStorage.getItem("location")
    if (savedLocation) {
      try {
        this.location = JSON.parse(savedLocation)
        this.displayLocation()
      } catch (error) {
        console.error("Error parsing saved location:", error)
        localStorage.removeItem("location")
      }
    }

    // Re-initialize Lucide icons for dashboard
    window.lucide = window.lucide || {} // Declare lucide variable
    if (typeof window.lucide.createIcons !== "undefined") {
      window.lucide.createIcons()
    }
  }

  hideLoading() {
    this.isLoading = false
    document.getElementById("loading-screen").classList.add("hidden")
  }

  showError(message) {
    const errorElement = document.getElementById("error-message")
    errorElement.textContent = message
    errorElement.classList.remove("hidden")
  }

  hideError() {
    const errorElement = document.getElementById("error-message")
    errorElement.classList.add("hidden")
  }

  showLocationLoading() {
    document.getElementById("location-loading").classList.remove("hidden")
    document.getElementById("location-content").classList.add("hidden")
    document.getElementById("location-error").classList.add("hidden")
  }

  showLocationError(message) {
    document.getElementById("location-loading").classList.add("hidden")
    document.getElementById("location-content").classList.add("hidden")
    document.getElementById("location-error").classList.remove("hidden")
  }

  displayLocation() {
    if (!this.location) return

    document.getElementById("location-loading").classList.add("hidden")
    document.getElementById("location-error").classList.add("hidden")
    document.getElementById("location-content").classList.remove("hidden")

    // Update coordinates
    document.getElementById("coordinates").textContent =
      `${this.location.latitude.toFixed(6)}, ${this.location.longitude.toFixed(6)}`

    // Update city if available
    if (this.location.city) {
      document.getElementById("city").textContent = this.location.city
      document.getElementById("city-info").classList.remove("hidden")
    }

    // Update country if available
    if (this.location.country) {
      document.getElementById("country").textContent = this.location.country
      document.getElementById("country-info").classList.remove("hidden")
    }

    // Re-initialize Lucide icons
    window.lucide = window.lucide || {} // Declare lucide variable
    if (typeof window.lucide.createIcons !== "undefined") {
      window.lucide.createIcons()
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.userApp = new UserSessionApp()
})

// Handle page visibility change to maintain session
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    // Page became visible, check session is still valid
    const savedUser = localStorage.getItem("user")
    if (savedUser && !window.userApp?.user) {
      // Reinitialize if needed
      window.userApp = new UserSessionApp()
    }
  }
})

// ========== GLOBAL VARIABLES ==========
let cart = []
let cartTotal = 0
let currentUser = JSON.parse(localStorage.getItem("joyfulSessionUser")) || null
const users = JSON.parse(localStorage.getItem("joyfulUsers")) || []
const orders = JSON.parse(localStorage.getItem("joyfulOrders")) || []
const messages = JSON.parse(localStorage.getItem("joyfulMessages")) || []

// Enhanced session persistence - check for existing session on page load
window.addEventListener("beforeunload", () => {
  // Save current session state before page unload
  if (currentUser) {
    localStorage.setItem("joyfulSessionUser", JSON.stringify(currentUser))
    localStorage.setItem("joyfulSessionExpiry", Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    localStorage.setItem("joyfulLastActivity", Date.now())
  }
})

// Enhanced session validity check
function checkSessionValidity() {
  const sessionExpiry = localStorage.getItem("joyfulSessionExpiry")
  const lastActivity = localStorage.getItem("joyfulLastActivity")

  if (sessionExpiry && Date.now() > Number.parseInt(sessionExpiry)) {
    // Session expired
    currentUser = null
    localStorage.removeItem("joyfulSessionUser")
    localStorage.removeItem("joyfulSessionExpiry")
    localStorage.removeItem("joyfulLastActivity")
    localStorage.removeItem("joyfulUserLocation")
    showNotification("Session expired. Please login again.", "info")
    return false
  }

  // Update last activity
  if (currentUser) {
    localStorage.setItem("joyfulLastActivity", Date.now())
  }

  return true
}

// Auto-detect location on page load for logged-in users
function autoDetectLocationOnLoad() {
  if (currentUser && !localStorage.getItem("joyfulUserLocation")) {
    setTimeout(() => {
      detectUserLocation(true) // Silent detection
    }, 2000)
  }
}

// Default products
const products = JSON.parse(localStorage.getItem("joyfulProducts")) || [
  {
    id: "date-bites",
    name: "Date Bites",
    category: "bites",
    price: 1200,
    description: "48 pieces - Rs 1200/kg",
    image: "/placeholder.svg?height=200&width=200",
    status: "active",
  },
  {
    id: "anjeer-bites",
    name: "Anjeer Bites",
    category: "bites",
    price: 1400,
    description: "48 pieces - Rs 1400/kg",
    image: "/placeholder.svg?height=200&width=200",
    status: "active",
  },
  {
    id: "date-paan-bites",
    name: "Date Paan Bites",
    category: "bites",
    price: 1500,
    description: "50 pieces - Rs 1500/kg",
    image: "/placeholder.svg?height=200&width=200",
    status: "active",
  },
  {
    id: "chocolate-anjeer-bites",
    name: "Chocolate Anjeer Bites",
    category: "bites",
    price: 1700,
    description: "50 pieces - Rs 1700/kg",
    image: "/placeholder.svg?height=200&width=200",
    status: "active",
  },
  {
    id: "chocolate-biscoff-bites",
    name: "Chocolate Biscoff Bites",
    category: "bites",
    price: 1800,
    description: "50 pieces - Rs 1800/kg",
    image: "/placeholder.svg?height=200&width=200",
    status: "active",
  },
  {
    id: "chocolate-date-paan-bites",
    name: "Chocolate Date Paan Bites",
    category: "bites",
    price: 1700,
    description: "50 pieces - Rs 1700/kg",
    image: "/placeholder.svg?height=200&width=200",
    status: "active",
  },
  {
    id: "coconut-kesar-bites",
    name: "Coconut Kesar Bites",
    category: "bites",
    price: 2000,
    description: "50 pieces - Rs 2000/kg",
    image: "/placeholder.svg?height=200&width=200",
    status: "active",
  },
  {
    id: "pistachio-date-bites",
    name: "Pistachio Date Bites",
    category: "bites",
    price: 2000,
    description: "50 pieces - Rs 2000/kg",
    image: "/placeholder.svg?height=200&width=200",
    status: "active",
  },
  {
    id: "tea-masala",
    name: "Tea Masala",
    category: "teamix",
    price: 150,
    description: "20g - Rs 150",
    image: "/placeholder.svg?height=200&width=200",
    status: "active",
  },
  {
    id: "oatmeal-cookies",
    name: "Oatmeal Cookies",
    category: "cookies",
    price: 2200,
    description: "80 pieces - Rs 2200/kg",
    image: "/placeholder.svg?height=200&width=200",
    status: "active",
  },
]

const categories = JSON.parse(localStorage.getItem("joyfulCategories")) || [
  { id: "bites", name: "Bites", description: "Delicious bite-sized treats", order: 1 },
  { id: "teamix", name: "Tea Spice Mix", description: "Authentic tea spice blends", order: 2 },
  { id: "cookies", name: "Cookies", description: "Freshly baked cookies", order: 3 },
]

// Map and geolocation variables
let addressMap = null
let selectedLocation = null
let userLocation = JSON.parse(localStorage.getItem("joyfulUserLocation")) || null

// ========== INITIALIZATION ==========
document.addEventListener("DOMContentLoaded", () => {
  if (checkSessionValidity()) {
    updateAuthUI()
    autoDetectLocationOnLoad() // Auto-detect location for logged-in users
  }
  updateCartDisplay()
  initializeProductDisplay()

  if (currentUser && currentUser.role === "admin") {
    updateAdminPanel()
  }
  initializeNavigation()

  // Update user location display if available
  if (currentUser && userLocation) {
    updateLocationDisplay()
  }
})

// Enhanced location detection function
function detectUserLocation(silent = false) {
  if (!navigator.geolocation) {
    if (!silent) {
      showNotification("Geolocation is not supported by this browser.", "error")
    }
    return
  }

  const locationBtn = document.querySelector(".location-btn")
  if (locationBtn && !silent) {
    locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting Location...'
    locationBtn.disabled = true
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude

      try {
        // Try to get address from coordinates using reverse geocoding
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
        )
        const data = await response.json()

        const locationData = {
          latitude: lat,
          longitude: lng,
          city: data.city || data.locality || "Unknown",
          state: data.principalSubdivision || "Unknown",
          country: data.countryName || "Unknown",
          address: data.locality || data.city || "Unknown location",
          timestamp: new Date().toISOString(),
        }

        // Save location data
        userLocation = locationData
        localStorage.setItem("joyfulUserLocation", JSON.stringify(locationData))

        // Update display
        updateLocationDisplay()

        if (!silent) {
          showNotification("Location detected successfully!", "success")
        }
      } catch (error) {
        // If reverse geocoding fails, just store coordinates
        const locationData = {
          latitude: lat,
          longitude: lng,
          city: "Unknown",
          state: "Unknown",
          country: "Unknown",
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          timestamp: new Date().toISOString(),
        }

        userLocation = locationData
        localStorage.setItem("joyfulUserLocation", JSON.stringify(locationData))
        updateLocationDisplay()

        if (!silent) {
          showNotification("Location coordinates detected!", "success")
        }
      }

      if (locationBtn && !silent) {
        locationBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Detect My Location'
        locationBtn.disabled = false
      }
    },
    (error) => {
      if (locationBtn && !silent) {
        locationBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Detect My Location'
        locationBtn.disabled = false
      }

      if (!silent) {
        let errorMessage = "Unable to get your location."
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again."
            break
        }
        showNotification(errorMessage, "error")
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 300000, // 5 minutes
    },
  )
}

// Update location display in profile
function updateLocationDisplay() {
  const locationDisplay = document.getElementById("locationDisplay")
  if (!locationDisplay || !currentUser) return

  if (userLocation) {
    const timeSince = getTimeSince(userLocation.timestamp)
    locationDisplay.innerHTML = `
      <div class="location-details">
        <div class="location-address">
          <strong>${userLocation.address}</strong>
        </div>
        <div class="location-coordinates">
          ${userLocation.city}, ${userLocation.state}, ${userLocation.country}
        </div>
        <div class="location-coordinates">
          Coordinates: ${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}
        </div>
        <div class="location-coordinates">
          Last updated: ${timeSince}
        </div>
      </div>
      <button class="location-btn" onclick="detectUserLocation()">
        <i class="fas fa-sync-alt"></i> Update Location
      </button>
    `
  } else {
    locationDisplay.innerHTML = `
      <p class="location-status">Location not detected</p>
      <button class="location-btn" onclick="detectUserLocation()">
        <i class="fas fa-crosshairs"></i> Detect My Location
      </button>
    `
  }
}

// Helper function to get time since last update
function getTimeSince(timestamp) {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now - then
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
  } else {
    return "Just now"
  }
}

// ========== NAVIGATION FUNCTIONS ==========
function initializeNavigation() {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })
  }

  // Handle navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.getAttribute("href").startsWith("#")) {
        e.preventDefault()
        const sectionId = link.getAttribute("href").substring(1)
        showSection(sectionId)

        // Close mobile menu
        if (navMenu) navMenu.classList.remove("active")

        // Update active link
        document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"))
        link.classList.add("active")
      }
    })
  })
}

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active")
  })

  // Show target section
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    targetSection.classList.add("active")
  }

  // Special handling for admin section
  if (sectionId === "admin" && currentUser && currentUser.role === "admin") {
    updateAdminPanel()
  }
}

function showCategory(categoryId) {
  // Hide all category contents
  document.querySelectorAll(".category-content").forEach((content) => {
    content.classList.remove("active")
  })

  // Show target category
  const targetCategory = document.getElementById(categoryId)
  if (targetCategory) {
    targetCategory.classList.add("active")
  }

  // Update active tab
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active")
  })

  // Find and activate the corresponding tab
  const categoryName = categories.find((c) => c.id === categoryId)?.name
  if (categoryName) {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      if (btn.textContent === categoryName) {
        btn.classList.add("active")
      }
    })
  }
}

// ========== CART FUNCTIONS ==========
function addToCart(productName, price) {
  const existingItem = cart.find((item) => item.name === productName)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      name: productName,
      price: price,
      quantity: 1,
    })
  }

  updateCartDisplay()
  showNotification(`${productName} added to cart!`, "success")
}

function removeFromCart(productName) {
  cart = cart.filter((item) => item.name !== productName)
  updateCartDisplay()
  showNotification(`${productName} removed from cart!`, "info")
}

function updateQuantity(productName, change) {
  const item = cart.find((item) => item.name === productName)
  if (item) {
    item.quantity += change
    if (item.quantity <= 0) {
      removeFromCart(productName)
    } else {
      updateCartDisplay()
    }
  }
}

function updateCartDisplay() {
  const cartItems = document.getElementById("cartItems")
  const cartCount = document.querySelector(".cart-count")
  const cartTotalElement = document.getElementById("cartTotal")

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>'
    cartCount.textContent = "0"
    cartTotal = 0
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item-card">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart('${item.name}')">Remove</button>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems
    cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  if (cartTotalElement) {
    cartTotalElement.textContent = cartTotal.toFixed(2)
  }
}

function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar")
  if (cartSidebar) {
    cartSidebar.classList.toggle("open")
  }
}

function proceedToCheckout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!", "error")
    return
  }

  if (!currentUser) {
    showNotification("Please login to proceed with checkout", "error")
    showSection("login")
    return
  }

  // Close cart and show payment modal
  toggleCart()
  showPaymentModal()
}

// ========== PAYMENT FUNCTIONS ==========
function showPaymentModal() {
  const modal = document.getElementById("paymentModal")
  const orderSummary = document.getElementById("paymentOrderSummary")
  const paymentTotal = document.getElementById("paymentTotal")
  const payButtonAmount = document.getElementById("payButtonAmount")

  // Populate order summary
  orderSummary.innerHTML = cart
    .map(
      (item) => `
        <div class="checkout-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `,
    )
    .join("")

  paymentTotal.textContent = cartTotal.toFixed(2)
  payButtonAmount.textContent = cartTotal.toFixed(2)

  // Pre-fill user information if available
  if (currentUser) {
    const shippingName = document.getElementById("shippingName")
    const shippingEmail = document.getElementById("shippingEmail")

    if (shippingName) shippingName.value = currentUser.fullName || currentUser.username
    if (shippingEmail) shippingEmail.value = currentUser.email || ""
  }

  // Initialize map
  setTimeout(() => {
    initializeAddressMap()
  }, 500)

  modal.classList.add("show")
}

function closePaymentModal() {
  const modal = document.getElementById("paymentModal")
  if (modal) {
    modal.classList.remove("show")
    // Reset payment form
    document.getElementById("paymentMethodSection").style.display = "none"
  }
}

function initializeAddressMap() {
  if (typeof L === "undefined") return

  const mapContainer = document.getElementById("addressMap")
  if (!mapContainer) return

  // Clear existing map
  if (addressMap) {
    addressMap.remove()
  }

  // Use user's location if available, otherwise default to Delhi
  const defaultLat = userLocation ? userLocation.latitude : 28.6139
  const defaultLng = userLocation ? userLocation.longitude : 77.209
  const defaultZoom = userLocation ? 15 : 10

  // Initialize map
  addressMap = L.map("addressMap").setView([defaultLat, defaultLng], defaultZoom)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(addressMap)

  // Add marker at user's location if available
  if (userLocation) {
    selectedLocation = { lat: userLocation.latitude, lng: userLocation.longitude }
    L.marker([userLocation.latitude, userLocation.longitude])
      .addTo(addressMap)
      .bindPopup("Your Current Location")
      .openPopup()
  }

  // Add click handler
  addressMap.on("click", (e) => {
    selectedLocation = e.latlng

    // Clear existing markers
    addressMap.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        addressMap.removeLayer(layer)
      }
    })

    // Add new marker
    L.marker([e.latlng.lat, e.latlng.lng]).addTo(addressMap).bindPopup("Delivery Location").openPopup()

    showNotification("Delivery location set!", "success")
  })
}

function getCurrentLocation() {
  if (!navigator.geolocation) {
    showNotification("Geolocation is not supported by this browser.", "error")
    return
  }

  const locationBtn = document.getElementById("getCurrentLocation")
  locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Location...'
  locationBtn.disabled = true

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude

      selectedLocation = { lat, lng }

      if (addressMap) {
        addressMap.setView([lat, lng], 15)

        // Clear existing markers
        addressMap.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            addressMap.removeLayer(layer)
          }
        })

        // Add marker at current location
        L.marker([lat, lng]).addTo(addressMap).bindPopup("Your Current Location").openPopup()
      }

      // Try to get address from coordinates using reverse geocoding
      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.locality) {
            const city = data.city || data.locality || ""
            const state = data.principalSubdivision || ""
            const postcode = data.postcode || ""

            // Auto-fill address fields if available
            if (city) document.getElementById("shippingCity").value = city
            if (state) document.getElementById("shippingState").value = state
            if (postcode) document.getElementById("shippingZip").value = postcode

            showNotification("Current location detected and address auto-filled!", "success")
          } else {
            showNotification("Current location detected!", "success")
          }
        })
        .catch(() => {
          showNotification("Current location detected!", "success")
        })

      locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use Current Location'
      locationBtn.disabled = false
    },
    (error) => {
      locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use Current Location'
      locationBtn.disabled = false

      let errorMessage = "Unable to get your location. Please select manually on the map."
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location access denied. Please enable location permissions and try again."
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable. Please select manually on the map."
          break
        case error.TIMEOUT:
          errorMessage = "Location request timed out. Please try again or select manually on the map."
          break
      }
      showNotification(errorMessage, "error")
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    },
  )
}

function proceedToPayment() {
  // Validate shipping form
  const requiredFields = [
    "shippingName",
    "shippingEmail",
    "shippingPhone",
    "shippingAddress",
    "shippingCity",
    "shippingState",
    "shippingZip",
  ]

  for (const fieldId of requiredFields) {
    const field = document.getElementById(fieldId)
    if (!field || !field.value.trim()) {
      showNotification("Please fill in all shipping information fields", "error")
      return
    }
  }

  if (!selectedLocation) {
    showNotification("Please select your delivery location on the map", "error")
    return
  }

  // Show payment method section
  document.getElementById("paymentMethodSection").style.display = "block"

  // Scroll to payment section
  document.getElementById("paymentMethodSection").scrollIntoView({ behavior: "smooth" })

  showNotification("Please complete the payment process", "info")
}

function handleScreenshotUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
  if (!allowedTypes.includes(file.type)) {
    showNotification("Please upload a valid image file (JPG, PNG, GIF)", "error")
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showNotification("File size too large. Please upload an image smaller than 5MB", "error")
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const preview = document.getElementById("screenshotPreview")
    const previewImg = document.getElementById("previewImage")
    const placeholder = document.querySelector(".upload-placeholder")

    previewImg.src = e.target.result
    preview.style.display = "block"
    placeholder.style.display = "none"
  }
  reader.readAsDataURL(file)
}

function removeScreenshot() {
  const preview = document.getElementById("screenshotPreview")
  const placeholder = document.querySelector(".upload-placeholder")
  const fileInput = document.getElementById("paymentScreenshot")

  preview.style.display = "none"
  placeholder.style.display = "block"
  fileInput.value = ""
}

function processPayment() {
  // Validate payment screenshot
  const screenshotFile = document.getElementById("paymentScreenshot").files[0]
  if (!screenshotFile) {
    showNotification("Please upload payment screenshot", "error")
    return
  }

  // Create order
  const orderId = "ORD" + Date.now()
  const transactionId = document.getElementById("transactionId").value || "TXN" + Date.now()
  const paymentNotes = document.getElementById("paymentNotes").value || ""

  // Convert screenshot to base64
  const reader = new FileReader()
  reader.onload = (e) => {
    const order = {
      id: orderId,
      customerUsername: currentUser.username,
      customerName: document.getElementById("shippingName").value,
      customerEmail: document.getElementById("shippingEmail").value,
      customerPhone: document.getElementById("shippingPhone").value,
      items: [...cart],
      total: cartTotal,
      date: new Date().toISOString(),
      status: "pending",
      paymentMethod: "QR Code Payment",
      paymentId: "PAY" + Date.now(),
      transactionId: transactionId,
      paymentNotes: paymentNotes,
      paymentScreenshot: e.target.result,
      shippingAddress: {
        name: document.getElementById("shippingName").value,
        email: document.getElementById("shippingEmail").value,
        phone: document.getElementById("shippingPhone").value,
        address: document.getElementById("shippingAddress").value,
        city: document.getElementById("shippingCity").value,
        state: document.getElementById("shippingState").value,
        zip: document.getElementById("shippingZip").value,
      },
      deliveryLocation: selectedLocation,
    }

    // Save order
    orders.push(order)
    localStorage.setItem("joyfulOrders", JSON.stringify(orders))

    // Clear cart
    cart = []
    updateCartDisplay()

    // Close modal
    closePaymentModal()

    // Show success message
    showNotification(`Order placed successfully! Order ID: ${orderId}`, "success")

    // Update user profile if logged in
    if (currentUser) {
      updateUserOrderHistory()
    }
  }
  reader.readAsDataURL(screenshotFile)
}

// ========== AUTHENTICATION FUNCTIONS ==========
function showLoginForm() {
  const loginContainer = document.getElementById("loginContainer")
  const signupContainer = document.getElementById("signupContainer")
  const profileContainer = document.getElementById("profileContainer")

  if (loginContainer) loginContainer.classList.remove("hidden")
  if (signupContainer) signupContainer.classList.add("hidden")
  if (profileContainer) profileContainer.classList.add("hidden")
}

function showSignupForm() {
  const loginContainer = document.getElementById("loginContainer")
  const signupContainer = document.getElementById("signupContainer")
  const profileContainer = document.getElementById("profileContainer")

  if (loginContainer) loginContainer.classList.add("hidden")
  if (signupContainer) signupContainer.classList.remove("hidden")
  if (profileContainer) profileContainer.classList.add("hidden")
}

function showProfile() {
  const loginContainer = document.getElementById("loginContainer")
  const signupContainer = document.getElementById("signupContainer")
  const profileContainer = document.getElementById("profileContainer")

  if (loginContainer) loginContainer.classList.add("hidden")
  if (signupContainer) signupContainer.classList.add("hidden")
  if (profileContainer) profileContainer.classList.remove("hidden")

  if (currentUser) {
    // Update profile information
    const userDisplayName = document.getElementById("userDisplayName")
    const profileUsername = document.getElementById("profileUsername")
    const profileEmail = document.getElementById("profileEmail")
    const profileFullName = document.getElementById("profileFullName")

    if (userDisplayName) userDisplayName.textContent = currentUser.fullName || currentUser.username
    if (profileUsername) profileUsername.textContent = currentUser.username
    if (profileEmail) profileEmail.textContent = currentUser.email
    if (profileFullName) profileFullName.textContent = currentUser.fullName || "Not provided"

    // Update order history, notifications, and location
    updateUserOrderHistory()
    updateUserNotifications()
    updateLocationDisplay()
  }
}

function handleLogin(event) {
  event.preventDefault()

  const username = document.getElementById("loginUsername").value
  const password = document.getElementById("loginPassword").value

  // Check for admin credentials
  if (username === "admin" && password === "hetalpanchal") {
    currentUser = { username: "admin", role: "admin", fullName: "Administrator" }
    localStorage.setItem("joyfulSessionUser", JSON.stringify(currentUser))
    localStorage.setItem("joyfulSessionExpiry", Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    localStorage.setItem("joyfulLastActivity", Date.now())
    updateAuthUI()
    showSection("admin")
    updateAdminPanel()
    showNotification("Welcome, Administrator!", "success")
    return
  }

  // Check for regular user credentials
  const user = users.find((u) => u.username === username && u.password === password)
  if (user) {
    currentUser = user
    localStorage.setItem("joyfulSessionUser", JSON.stringify(user))
    localStorage.setItem("joyfulSessionExpiry", Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    localStorage.setItem("joyfulLastActivity", Date.now())
    updateAuthUI()
    showProfile()

    // Auto-detect location after login
    setTimeout(() => {
      detectUserLocation(true) // Silent detection
    }, 1000)

    // Show unread notifications count
    const notifications = getCustomerNotifications(user.username)
    const unreadCount = notifications.filter((n) => !n.read).length
    if (unreadCount > 0) {
      showNotification(`Welcome back! You have ${unreadCount} new notification${unreadCount > 1 ? "s" : ""}.`, "info")
    } else {
      showNotification(`Welcome back, ${user.fullName || user.username}!`, "success")
    }
    return
  }

  showNotification("Invalid username or password!", "error")
}

function handleSignup(event) {
  event.preventDefault()

  const username = document.getElementById("signupUsername").value
  const email = document.getElementById("signupEmail").value
  const fullName = document.getElementById("signupFullName").value
  const password = document.getElementById("signupPassword").value
  const confirmPassword = document.getElementById("signupConfirmPassword").value

  if (password !== confirmPassword) {
    showNotification("Passwords don't match!", "error")
    return
  }

  // Check if username already exists
  if (users.find((u) => u.username === username)) {
    showNotification("Username already exists!", "error")
    return
  }

  // Check if email already exists
  if (users.find((u) => u.email === email)) {
    showNotification("Email already registered!", "error")
    return
  }

  // Add new user
  const newUser = {
    username,
    email,
    fullName,
    password,
    registrationDate: new Date().toISOString(),
    role: "customer",
  }

  users.push(newUser)
  localStorage.setItem("joyfulUsers", JSON.stringify(users))

  currentUser = newUser
  localStorage.setItem("joyfulSessionUser", JSON.stringify(newUser))
  localStorage.setItem("joyfulSessionExpiry", Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  localStorage.setItem("joyfulLastActivity", Date.now())
  updateAuthUI()
  showProfile()

  // Auto-detect location after signup
  setTimeout(() => {
    detectUserLocation(true) // Silent detection
  }, 1000)

  showNotification("Account created successfully!", "success")
}

function logout() {
  currentUser = null
  userLocation = null
  localStorage.removeItem("joyfulSessionUser")
  localStorage.removeItem("joyfulSessionExpiry")
  localStorage.removeItem("joyfulLastActivity")
  localStorage.removeItem("joyfulUserLocation")
  updateAuthUI()
  showSection("home")
  showLoginForm()
  showNotification("Logged out successfully!", "success")
}

function updateAuthUI() {
  const authNavItem = document.getElementById("authNavItem")
  const authNavLink = document.getElementById("authNavLink")

  if (authNavLink) {
    if (currentUser) {
      if (currentUser.role === "admin") {
        authNavLink.textContent = "Admin Panel"
        authNavLink.setAttribute("href", "#admin")
      } else {
        authNavLink.textContent = "Profile"
        authNavLink.setAttribute("href", "#login")
      }
    } else {
      authNavLink.textContent = "Login"
      authNavLink.setAttribute("href", "#login")
    }
  }
}

// ========== ADDRESS MANAGEMENT ==========
function getUserAddresses() {
  if (!currentUser) return []
  const userAddresses = JSON.parse(localStorage.getItem(`addresses_${currentUser.username}`)) || []
  return userAddresses
}

function saveUserAddress(addressData) {
  if (!currentUser) return
  const addresses = getUserAddresses()
  const addressId = "ADDR" + Date.now()
  const newAddress = {
    id: addressId,
    ...addressData,
    isDefault: addresses.length === 0,
    createdAt: new Date().toISOString(),
  }
  addresses.push(newAddress)
  localStorage.setItem(`addresses_${currentUser.username}`, JSON.stringify(addresses))
  return newAddress
}

function setDefaultAddress(addressId) {
  if (!currentUser) return
  const addresses = getUserAddresses()
  addresses.forEach((addr) => {
    addr.isDefault = addr.id === addressId
  })
  localStorage.setItem(`addresses_${currentUser.username}`, JSON.stringify(addresses))
}

function deleteUserAddress(addressId) {
  if (!currentUser) return
  let addresses = getUserAddresses()
  addresses = addresses.filter((addr) => addr.id !== addressId)
  localStorage.setItem(`addresses_${currentUser.username}`, JSON.stringify(addresses))
}

function showAddressModal() {
  const modal = document.getElementById("addressModal")
  const addressList = document.getElementById("savedAddressList")

  if (!modal || !addressList) return

  const addresses = getUserAddresses()
  if (addresses.length === 0) {
    addressList.innerHTML = '<p class="no-addresses">No saved addresses found.</p>'
  } else {
    addressList.innerHTML = addresses
      .map(
        (addr) => `
        <div class="address-item ${addr.isDefault ? "default-address" : ""}">
          <div class="address-content">
            <div class="address-label">${addr.label || "Address"} ${addr.isDefault ? "(Default)" : ""}</div>
            <div class="address-text">${addr.name}</div>
            <div class="address-text">${addr.address}, ${addr.city}, ${addr.state} - ${addr.zip}</div>
            <div class="address-text">Phone: ${addr.phone}</div>
          </div>
          <div class="address-actions">
            <button class="action-btn" onclick="selectSavedAddress('${addr.id}')">Select</button>
            <button class="action-btn" onclick="setDefaultAddress('${addr.id}'); showAddressModal()">Set Default</button>
            <button class="action-btn delete-btn" onclick="deleteUserAddress('${addr.id}'); showAddressModal()">Delete</button>
          </div>
        </div>
      `,
      )
      .join("")
  }
  modal.classList.add("show")
}

function closeAddressModal() {
  const modal = document.getElementById("addressModal")
  if (modal) modal.classList.remove("show")
}

function setLocationOnMap(lat, lng) {
  if (addressMap) {
    addressMap.setView([lat, lng], 15)

    // Clear existing markers
    addressMap.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        addressMap.removeLayer(layer)
      }
    })

    // Add marker at the selected location
    L.marker([lat, lng]).addTo(addressMap).bindPopup("Selected Location").openPopup()
  }
}

function selectSavedAddress(addressId) {
  const addresses = getUserAddresses()
  const address = addresses.find((addr) => addr.id === addressId)
  if (address) {
    const fields = {
      shippingName: address.name,
      shippingEmail: address.email,
      shippingPhone: address.phone,
      shippingAddress: address.address,
      shippingCity: address.city,
      shippingState: address.state,
      shippingZip: address.zip,
    }

    Object.entries(fields).forEach(([id, value]) => {
      const element = document.getElementById(id)
      if (element) element.value = value
    })

    if (address.location) {
      selectedLocation = address.location
      if (addressMap) {
        setLocationOnMap(address.location.lat, address.location.lng)
      }
    }
  }
  closeAddressModal()
}

function saveCurrentAddress() {
  const addressData = {
    name: document.getElementById("shippingName")?.value || "",
    email: document.getElementById("shippingEmail")?.value || "",
    phone: document.getElementById("shippingPhone")?.value || "",
    address: document.getElementById("shippingAddress")?.value || "",
    city: document.getElementById("shippingCity")?.value || "",
    state: document.getElementById("shippingState")?.value || "",
    zip: document.getElementById("shippingZip")?.value || "",
    location: selectedLocation,
    label: prompt("Enter a label for this address (e.g., Home, Office):") || "Address",
  }

  // Validate required fields
  if (
    !addressData.name ||
    !addressData.phone ||
    !addressData.address ||
    !addressData.city ||
    !addressData.state ||
    !addressData.zip
  ) {
    showNotification("Please fill in all required fields before saving", "error")
    return
  }

  saveUserAddress(addressData)
  showNotification("Address saved successfully!", "success")
}

// ========== NOTIFICATION SYSTEM ==========
function updateUserNotifications() {
  if (!currentUser) return

  const notifications = getCustomerNotifications(currentUser.username)
  const notificationsContainer = document.getElementById("userNotifications")

  if (!notificationsContainer) return

  if (notifications.length === 0) {
    notificationsContainer.innerHTML = '<p class="no-notifications">No notifications yet.</p>'
  } else {
    notificationsContainer.innerHTML = notifications
      .slice(0, 5)
      .map(
        (notif) => `
        <div class="notification-item ${notif.read ? "read" : "unread"}" onclick="markNotificationAsRead('${notif.id}'); this.classList.add('read')">
          <div class="notification-content">
            <div class="notification-message">${notif.message}</div>
            <div class="notification-time">${new Date(notif.timestamp).toLocaleString()}</div>
            ${notif.orderId ? `<div class="notification-order">Order #${notif.orderId}</div>` : ""}
          </div>
          ${!notif.read ? '<div class="notification-badge"></div>' : ""}
        </div>
      `,
      )
      .join("")
  }
}

function getCustomerNotifications(username) {
  const notifications = JSON.parse(localStorage.getItem("customerNotifications")) || []
  return notifications
    .filter((notif) => notif.customerUsername === username)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

function markNotificationAsRead(notificationId) {
  const notifications = JSON.parse(localStorage.getItem("customerNotifications")) || []
  const notification = notifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.read = true
    localStorage.setItem("customerNotifications", JSON.stringify(notifications))
  }
}

function sendOrderStatusNotification(order, oldStatus, newStatus) {
  const statusMessages = {
    accepted: "Great news! Your order has been accepted and is being prepared.",
    packed: "Your order has been carefully packed and is ready for shipment.",
    shipped: "Your order is on its way! You should receive it soon.",
    delivered: "Your order has been delivered successfully. Thank you for shopping with us!",
  }

  const message = statusMessages[newStatus] || `Your order status has been updated to ${newStatus}.`

  // Create a system notification for the customer
  const notification = {
    id: "NOTIF" + Date.now(),
    orderId: order.id,
    customerUsername: order.customerUsername,
    message: message,
    status: newStatus,
    timestamp: new Date().toISOString(),
    read: false,
    type: "order_status",
  }

  // Store notification
  const notifications = JSON.parse(localStorage.getItem("customerNotifications")) || []
  notifications.push(notification)
  localStorage.setItem("customerNotifications", JSON.stringify(notifications))

  // If customer is currently logged in, show real-time notification
  if (currentUser && currentUser.username === order.customerUsername) {
    showNotification(`Order #${order.id}: ${message}`, "success")
  }
}

function showNotification(message, type = "info") {
  const container = document.getElementById("notificationContainer")
  if (!container) return

  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message
  container.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.classList.add("show")
  }, 100)

  // Remove after 4 seconds
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      if (container.contains(notification)) {
        container.removeChild(notification)
      }
    }, 300)
  }, 4000)
}

function showAdminNotification(message) {
  // Only show admin notifications if admin is logged in
  if (currentUser && currentUser.role === "admin") {
    showNotification(`[ADMIN] ${message}`, "info")
  }
}

// ========== ORDER MANAGEMENT ==========
function updateUserOrderHistory() {
  if (!currentUser) return

  const userOrders = orders.filter((order) => order.customerUsername === currentUser.username)
  const orderHistoryContainer = document.getElementById("userOrderHistory")

  if (!orderHistoryContainer) return

  if (userOrders.length === 0) {
    orderHistoryContainer.innerHTML = '<p class="no-orders">No orders placed yet.</p>'
  } else {
    orderHistoryContainer.innerHTML = userOrders
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(
        (order) => `
        <div class="order-item">
          <div class="order-header">
            <span class="order-id">Order #${order.id}</span>
            <span class="order-status-badge status-${order.status}">${order.status}</span>
          </div>
          <div class="order-date">Placed on ${new Date(order.date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}</div>
          <div class="order-items">
            <strong>Items:</strong> ${order.items.map((item) => `${item.name} (x${item.quantity})`).join(", ")}
          </div>
          ${
            order.deliveryLocation
              ? `
            <div class="delivery-info">
              <h4><i class="fas fa-map-marker-alt"></i> Delivery Location</h4>
              <div class="delivery-address">${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zip}</div>
              <div class="delivery-coordinates">Coordinates: ${order.deliveryLocation.lat.toFixed(6)}, ${order.deliveryLocation.lng.toFixed(6)}</div>
            </div>
          `
              : ""
          }
          <div class="estimated-delivery">
            <strong>Estimated Delivery:</strong> ${getEstimatedDelivery(order.date, order.status)}
          </div>
          <div class="order-total">Total: ₹${order.total.toFixed(2)}</div>
          <button class="track-order-btn" onclick="showOrderTracking('${order.id}')">
            <i class="fas fa-truck"></i> Track Order
          </button>
        </div>
      `,
      )
      .join("")
  }
}

function getEstimatedDelivery(orderDate, status) {
  const orderTime = new Date(orderDate)
  const deliveryTime = new Date(orderTime)

  switch (status) {
    case "pending":
      deliveryTime.setDate(deliveryTime.getDate() + 5)
      break
    case "accepted":
      deliveryTime.setDate(deliveryTime.getDate() + 4)
      break
    case "packed":
      deliveryTime.setDate(deliveryTime.getDate() + 3)
      break
    case "shipped":
      deliveryTime.setDate(deliveryTime.getDate() + 1)
      break
    case "delivered":
      return "Delivered"
    default:
      deliveryTime.setDate(deliveryTime.getDate() + 5)
  }

  return deliveryTime.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function showOrderTracking(orderId) {
  const order = orders.find((o) => o.id === orderId)
  if (!order) return

  const modal = document.getElementById("orderTrackingModal")
  const content = document.getElementById("trackingContent")

  if (!modal || !content) return

  const statusSteps = [
    { key: "pending", title: "Order Placed", description: "Your order has been received and is being processed" },
    { key: "accepted", title: "Order Accepted", description: "Your order has been accepted and preparation has begun" },
    { key: "packed", title: "Order Packed", description: "Your order has been packed and is ready for shipment" },
    { key: "shipped", title: "Order Shipped", description: "Your order is on its way to you" },
    { key: "delivered", title: "Order Delivered", description: "Your order has been delivered successfully" },
  ]

  const currentStatusIndex = statusSteps.findIndex((step) => step.key === order.status)

  content.innerHTML = `
        <div class="order-tracking-header">
            <h3>Order #${order.id}</h3>
            <div class="order-status-badge status-${order.status}">${order.status}</div>
        </div>
        <div class="order-timeline">
            ${statusSteps
              .map((step, index) => {
                let statusClass = ""
                if (index < currentStatusIndex) statusClass = "completed"
                else if (index === currentStatusIndex) statusClass = "current"

                return `
                    <div class="timeline-item ${statusClass}">
                        <div class="timeline-icon ${statusClass}">
                            <i class="fas ${index <= currentStatusIndex ? "fa-check" : "fa-circle"}"></i>
                        </div>
                        <div class="timeline-content">
                            <div class="timeline-title">${step.title}</div>
                            <div class="timeline-description">${step.description}</div>
                            ${index === currentStatusIndex ? `<div class="timeline-time">Current Status</div>` : ""}
                        </div>
                    </div>
                `
              })
              .join("")}
        </div>
    `

  modal.classList.add("show")
}

function closeOrderTrackingModal() {
  const modal = document.getElementById("orderTrackingModal")
  if (modal) modal.classList.remove("show")
}

// ========== ADMIN PANEL ==========
function updateAdminPanel() {
  if (!currentUser || currentUser.role !== "admin") return

  // Update statistics
  const totalOrdersEl = document.getElementById("totalOrders")
  const totalRevenueEl = document.getElementById("totalRevenue")
  const totalCustomersEl = document.getElementById("totalCustomers")

  if (totalOrdersEl) totalOrdersEl.textContent = orders.length
  if (totalRevenueEl) totalRevenueEl.textContent = "₹" + orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)
  if (totalCustomersEl) totalCustomersEl.textContent = users.filter((u) => u.role === "customer").length

  // Update tables
  updateOrdersTable()
  updateUsersTable()
  updateMessagesTable()
  updateProductsTable()
  updateCategoriesGrid()
}

function updateOrdersTable() {
  const tbody = document.getElementById("ordersTableBody")
  if (!tbody) return

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="no-orders">No orders found.</td></tr>'
  } else {
    tbody.innerHTML = orders
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(
        (order) => `
        <tr>
          <td>#${order.id}</td>
          <td>${order.customerName}</td>
          <td>${new Date(order.date).toLocaleDateString()}</td>
          <td>
            <div class="order-items-detail">
              ${order.items.map((item) => `${item.name} (x${item.quantity})`).join("<br>")}
            </div>
          </td>
          <td>₹${order.total.toFixed(2)}</td>
          <td>
            <select class="status-select" onchange="updateOrderStatus('${order.id}', this.value)">
              <option value="pending" ${order.status === "pending" ? "selected" : ""}>Pending</option>
              <option value="accepted" ${order.status === "accepted" ? "selected" : ""}>Accepted</option>
              <option value="packed" ${order.status === "packed" ? "selected" : ""}>Packed</option>
              <option value="shipped" ${order.status === "shipped" ? "selected" : ""}>Shipped</option>
              <option value="delivered" ${order.status === "delivered" ? "selected" : ""}>Delivered</option>
            </select>
          </td>
          <td>
            <div class="address-preview">
              ${order.shippingAddress.address}, ${order.shippingAddress.city}<br>
              ${order.shippingAddress.state} - ${order.shippingAddress.zip}<br>
              Phone: ${order.customerPhone}
            </div>
          </td>
          <td>
            ${
              order.paymentScreenshot
                ? `<img src="${order.paymentScreenshot}" alt="Payment Screenshot" class="payment-screenshot-thumb" onclick="viewPaymentScreenshot('${order.paymentScreenshot}')" style="width: 50px; height: 50px; object-fit: cover; cursor: pointer; border-radius: 4px;">`
                : "No screenshot"
            }
          </td>
          <td>
            <button class="action-btn" onclick="viewOrderDetails('${order.id}')">Details</button>
            <button class="action-btn delete-btn" onclick="deleteOrder('${order.id}')">Delete</button>
          </td>
        </tr>
      `,
      )
      .join("")
  }
}

function viewPaymentScreenshot(screenshotUrl) {
  window.open(screenshotUrl, "_blank")
}

function updateOrderStatus(orderId, newStatus) {
  const order = orders.find((o) => o.id === orderId)
  if (order && order.status !== newStatus) {
    const oldStatus = order.status
    order.status = newStatus
    order.statusHistory = order.statusHistory || []
    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      updatedBy: "admin",
    })

    localStorage.setItem("joyfulOrders", JSON.stringify(orders))
    updateOrdersTable()

    // Send notification to customer
    sendOrderStatusNotification(order, oldStatus, newStatus)
    showNotification(`Order #${orderId} status updated to ${newStatus}`, "success")
    showAdminNotification(`Order #${orderId} marked as ${newStatus}`)
  }
}

function deleteOrder(orderId) {
  if (confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
    const index = orders.findIndex((o) => o.id === orderId)
    if (index > -1) {
      orders.splice(index, 1)
      localStorage.setItem("joyfulOrders", JSON.stringify(orders))
      updateOrdersTable()
      updateAdminPanel()
      showNotification("Order deleted successfully!", "success")
    }
  }
}

function viewOrderDetails(orderId) {
  const order = orders.find((o) => o.id === orderId)
  if (!order) return

  const modal = document.getElementById("orderDetailsModal")
  const content = document.getElementById("orderDetailsContent")

  if (!modal || !content) return

  content.innerHTML = `
    <div class="order-details">
      <h3>Order #${order.id}</h3>
      <div class="order-info-grid">
        <div class="order-section">
          <h4>Customer Information</h4>
          <p><strong>Name:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Phone:</strong> ${order.customerPhone}</p>
          <p><strong>Username:</strong> ${order.customerUsername}</p>
        </div>
        
        <div class="order-section">
          <h4>Shipping Address</h4>
          <p>${order.shippingAddress.address}</p>
          <p>${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
          <p>PIN: ${order.shippingAddress.zip}</p>
          ${
            order.deliveryLocation
              ? `
            <p><strong>Coordinates:</strong> ${order.deliveryLocation.lat.toFixed(6)}, ${order.deliveryLocation.lng.toFixed(6)}</p>
            <div id="adminOrderMap" style="height: 200px; margin-top: 10px; border-radius: 8px;"></div>
          `
              : ""
          }
        </div>
        
        <div class="order-section">
          <h4>Order Items</h4>
          ${order.items
            .map(
              (item) => `
            <div class="order-item-detail">
              <span>${item.name} x ${item.quantity}</span>
              <span>₹${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `,
            )
            .join("")}
          <div class="order-total-detail">
            <strong>Total: ₹${order.total.toFixed(2)}</strong>
          </div>
        </div>
        
        <div class="order-section">
          <h4>Order Details</h4>
          <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
          <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
          <p><strong>Payment Method:</strong> QR Code Payment</p>
          <p><strong>Payment ID:</strong> ${order.paymentId}</p>
          ${order.transactionId ? `<p><strong>Transaction ID:</strong> ${order.transactionId}</p>` : ""}
          ${order.paymentNotes ? `<p><strong>Payment Notes:</strong> ${order.paymentNotes}</p>` : ""}
          ${
            order.paymentScreenshot
              ? `
            <div class="payment-screenshot-section">
              <h5>Payment Screenshot</h5>
              <div class="screenshot-display">
                <img src="${order.paymentScreenshot}" alt="Payment Screenshot" onclick="window.open('${order.paymentScreenshot}', '_blank')">
                <p>Click to view full size</p>
              </div>
            </div>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `

  modal.classList.add("show")

  // Show delivery location on map if available
  if (order.deliveryLocation && typeof L !== "undefined") {
    setTimeout(() => {
      const adminMap = L.map("adminOrderMap").setView([order.deliveryLocation.lat, order.deliveryLocation.lng], 15)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(adminMap)
      L.marker([order.deliveryLocation.lat, order.deliveryLocation.lng])
        .addTo(adminMap)
        .bindPopup("Delivery Location")
        .openPopup()
    }, 100)
  }
}

function closeOrderDetailsModal() {
  const modal = document.getElementById("orderDetailsModal")
  if (modal) modal.classList.remove("show")
}

function updateUsersTable() {
  const tbody = document.getElementById("usersTableBody")
  if (!tbody) return

  const customerUsers = users.filter((u) => u.role === "customer")

  if (customerUsers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="no-orders">No users found.</td></tr>'
  } else {
    tbody.innerHTML = customerUsers
      .map((user) => {
        const userOrders = orders.filter((o) => o.customerUsername === user.username)
        return `
          <tr>
            <td>${user.username}</td>
            <td>${user.fullName || "Not provided"}</td>
            <td>${user.email}</td>
            <td>${new Date(user.registrationDate).toLocaleDateString()}</td>
            <td>${userOrders.length}</td>
            <td>
              <button class="action-btn delete-btn" onclick="deleteUser('${user.username}')">
                <i class="fas fa-trash"></i> Delete
              </button>
            </td>
          </tr>
        `
      })
      .join("")
  }
}

function deleteUser(username) {
  if (confirm("Are you sure you want to delete this user? This will also delete all their orders and data.")) {
    // Remove user
    const userIndex = users.findIndex((u) => u.username === username)
    if (userIndex > -1) {
      users.splice(userIndex, 1)
      localStorage.setItem("joyfulUsers", JSON.stringify(users))
    }

    // Remove user's orders
    const userOrders = orders.filter((o) => o.customerUsername === username)
    userOrders.forEach((order) => {
      const orderIndex = orders.findIndex((o) => o.id === order.id)
      if (orderIndex > -1) {
        orders.splice(orderIndex, 1)
      }
    })
    localStorage.setItem("joyfulOrders", JSON.stringify(orders))

    // Remove user's addresses
    localStorage.removeItem(`addresses_${username}`)

    // Remove user's notifications
    const notifications = JSON.parse(localStorage.getItem("customerNotifications")) || []
    const filteredNotifications = notifications.filter((n) => n.customerUsername !== username)
    localStorage.setItem("customerNotifications", JSON.stringify(filteredNotifications))

    updateUsersTable()
    updateAdminPanel()
    showNotification("User deleted successfully!", "success")
  }
}

function updateMessagesTable() {
  const tbody = document.getElementById("messagesTableBody")
  if (!tbody) return

  if (messages.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="no-orders">No messages received.</td></tr>'
  } else {
    tbody.innerHTML = messages
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(
        (message) => `
        <tr class="${message.read ? "" : "unread-message"}">
          <td>${message.name}</td>
          <td>${message.email}</td>
          <td>${new Date(message.date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}</td>
          <td class="message-preview">${message.message.substring(0, 50)}${message.message.length > 50 ? "..." : ""}</td>
          <td>
            <button class="action-btn" onclick="viewMessage('${message.id}')">View</button>
            <button class="action-btn delete-btn" onclick="deleteMessage('${message.id}')">Delete</button>
          </td>
        </tr>
      `,
      )
      .join("")
  }
}

function viewMessage(messageId) {
  const message = messages.find((m) => m.id === messageId)
  if (!message) return

  // Mark message as read
  message.read = true
  localStorage.setItem("joyfulMessages", JSON.stringify(messages))
  updateMessagesTable()

  // Show message in modal or alert
  alert(
    `From: ${message.name} (${message.email})\nDate: ${new Date(message.date).toLocaleString()}\n\nMessage:\n${message.message}`,
  )
}

function deleteMessage(messageId) {
  if (confirm("Are you sure you want to delete this message?")) {
    const index = messages.findIndex((m) => m.id === messageId)
    if (index > -1) {
      messages.splice(index, 1)
      localStorage.setItem("joyfulMessages", JSON.stringify(messages))
      updateMessagesTable()
      showNotification("Message deleted successfully!", "success")
    }
  }
}

function showAdminTab(tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll(".admin-tab-content")
  tabContents.forEach((content) => content.classList.remove("active"))

  // Remove active class from all tab buttons
  const tabBtns = document.querySelectorAll(".admin-tab-btn")
  tabBtns.forEach((btn) => btn.classList.remove("active"))

  // Show selected tab
  const targetTab = document.getElementById(`admin${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Tab`)
  if (targetTab) targetTab.classList.add("active")

  // Add active class to clicked button
  if (event && event.target) event.target.classList.add("active")

  // Load appropriate data
  if (tabName === "products") {
    updateProductsTable()
  } else if (tabName === "categories") {
    updateMessagesTable()
  }
}

// ========== PRODUCT MANAGEMENT ==========
function updateProductsTable() {
  const tbody = document.getElementById("productsTableBody")
  if (!tbody) return

  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="no-orders">No products found.</td></tr>'
  } else {
    tbody.innerHTML = products
      .map(
        (product) => `
        <tr>
          <td><img src="${product.image}" alt="${product.name}" class="product-image-cell"></td>
          <td>${product.name}</td>
          <td>${getCategoryName(product.category)}</td>
          <td>₹${product.price}</td>
          <td>${product.description}</td>
          <td><span class="product-status status-${product.status}">${product.status}</span></td>
          <td>
            <button class="action-btn" onclick="editProduct('${product.id}')">Edit</button>
            <button class="action-btn delete-btn" onclick="deleteProduct('${product.id}')">Delete</button>
          </td>
        </tr>
      `,
      )
      .join("")
  }
}

function getCategoryName(categoryId) {
  const category = categories.find((cat) => cat.id === categoryId)
  return category ? category.name : categoryId
}

function showAddProductModal() {
  const modal = document.getElementById("addProductModal")
  const title = document.getElementById("productModalTitle")
  const form = document.getElementById("productForm")
  const editId = document.getElementById("editProductId")
  const imagePreview = document.getElementById("imagePreview")

  if (title) title.textContent = "Add New Product"
  if (form) form.reset()
  if (editId) editId.value = ""
  if (imagePreview) imagePreview.innerHTML = ""

  populateProductCategories()
  if (modal) modal.classList.add("show")
}

function closeAddProductModal() {
  const modal = document.getElementById("addProductModal")
  if (modal) modal.classList.remove("show")
}

function populateProductCategories() {
  const categorySelect = document.getElementById("productCategory")
  if (categorySelect) {
    categorySelect.innerHTML = categories
      .map((category) => `<option value="${category.id}">${category.name}</option>`)
      .join("")
  }
}

function editProduct(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const fields = {
    productModalTitle: "Edit Product",
    editProductId: product.id,
    productName: product.name,
    productCategory: product.category,
    productPrice: product.price,
    productDescription: product.description,
    productStatus: product.status,
  }

  Object.entries(fields).forEach(([id, value]) => {
    const element = document.getElementById(id)
    if (element) {
      if (id === "productModalTitle") {
        element.textContent = value
      } else {
        element.value = value
      }
    }
  })

  // Show current image
  const imagePreview = document.getElementById("imagePreview")
  if (product.image && imagePreview) {
    imagePreview.innerHTML = `<img src="${product.image}" alt="Current image">`
  }

  populateProductCategories()
  const modal = document.getElementById("addProductModal")
  if (modal) modal.classList.add("show")
}

function handleProductImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const imagePreview = document.getElementById("imagePreview")
    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Product image">`
  }
  reader.readAsDataURL(file)
}

function generateProductId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

// ========== DYNAMIC PRODUCT & CATEGORY MANAGEMENT ==========
function initializeProductDisplay() {
  renderCategoryTabs()
  renderProductCategories()

  // Set first category as active by default
  if (categories.length > 0) {
    const firstCategory = categories.sort((a, b) => a.order - b.order)[0]
    showCategory(firstCategory.id)
  }
}

function renderCategoryTabs() {
  const tabsContainer = document.getElementById("categoryTabs")
  if (!tabsContainer) return

  const sortedCategories = categories.sort((a, b) => a.order - b.order)

  tabsContainer.innerHTML = sortedCategories
    .map((category) => `<button class="tab-btn" onclick="showCategory('${category.id}')">${category.name}</button>`)
    .join("")
}

function renderProductCategories() {
  const container = document.getElementById("dynamicProductCategories")
  if (!container) return

  const sortedCategories = categories.sort((a, b) => a.order - b.order)

  container.innerHTML = sortedCategories
    .map((category) => {
      const categoryProducts = products.filter((p) => p.category === category.id && p.status === "active")

      return `
      <div id="${category.id}" class="category-content">
        <div class="products-grid">
          ${categoryProducts
            .map(
              (product) => `
            <div class="product-card" data-product-id="${product.id}">
              <img src="${product.image}" alt="${product.name}" class="product-img">
              <h3>${product.name}</h3>
              <p>${product.description}</p>
              <div class="product-price">₹${product.price}</div>
              <button class="add-to-cart-btn" onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            </div>
          `,
            )
            .join("")}
          ${categoryProducts.length === 0 ? '<p class="no-products">No products available in this category.</p>' : ""}
        </div>
      </div>
    `
    })
    .join("")
}

function refreshProductDisplay() {
  renderCategoryTabs()
  renderProductCategories()

  // Maintain active category if it still exists
  const activeCategory = document.querySelector(".category-content.active")
  if (activeCategory) {
    const categoryId = activeCategory.id
    if (categories.find((c) => c.id === categoryId)) {
      showCategory(categoryId)
    } else {
      // If active category was deleted, show first available category
      if (categories.length > 0) {
        const firstCategory = categories.sort((a, b) => a.order - b.order)[0]
        showCategory(firstCategory.id)
      }
    }
  }
}

// Update the existing updateCustomerProducts function
function updateCustomerProducts() {
  refreshProductDisplay()
}

// Enhanced product form handler
function handleProductForm(event) {
  event.preventDefault()

  const editId = document.getElementById("editProductId").value
  const productData = {
    name: document.getElementById("productName").value,
    category: document.getElementById("productCategory").value,
    price: Number.parseFloat(document.getElementById("productPrice").value),
    description: document.getElementById("productDescription").value,
    status: document.getElementById("productStatus").value,
    image: document.getElementById("imagePreview").querySelector("img")?.src || "/placeholder.svg?height=200&width=200",
  }

  if (editId) {
    // Edit existing product
    const index = products.findIndex((p) => p.id === editId)
    if (index > -1) {
      products[index] = { ...products[index], ...productData }
      showNotification("Product updated successfully!", "success")
    }
  } else {
    // Add new product
    const newProduct = {
      id: generateProductId(productData.name),
      ...productData,
    }
    products.push(newProduct)
    showNotification("Product added successfully!", "success")
  }

  localStorage.setItem("joyfulProducts", JSON.stringify(products))
  updateProductsTable()
  refreshProductDisplay() // Update customer-facing display immediately
  closeAddProductModal()
}

// Enhanced product deletion
function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    const index = products.findIndex((p) => p.id === productId)
    if (index > -1) {
      products.splice(index, 1)
      localStorage.setItem("joyfulProducts", JSON.stringify(products))
      updateProductsTable()
      refreshProductDisplay() // Update customer-facing display immediately
      showNotification("Product deleted successfully!", "success")
    }
  }
}

// Enhanced category form handler
function handleCategoryForm(event) {
  event.preventDefault()

  const editId = document.getElementById("editCategoryId").value
  const categoryData = {
    name: document.getElementById("categoryName").value,
    id: document.getElementById("categoryId").value,
    description: document.getElementById("categoryDescription").value,
    order: Number.parseInt(document.getElementById("categoryOrder").value),
  }

  if (editId && editId !== categoryData.id) {
    // If category ID changed, update all products with old category ID
    products.forEach((product) => {
      if (product.category === editId) {
        product.category = categoryData.id
      }
    })
    localStorage.setItem("joyfulProducts", JSON.stringify(products))
  }

  if (editId) {
    // Edit existing category
    const index = categories.findIndex((c) => c.id === editId)
    if (index > -1) {
      categories[index] = { ...categories[index], ...categoryData }
      showNotification("Category updated successfully!", "success")
    }
  } else {
    // Add new category
    categories.push(categoryData)
    showNotification("Category added successfully!", "success")
  }

  localStorage.setItem("joyfulCategories", JSON.stringify(categories))
  updateCategoriesGrid()
  populateProductCategories()
  refreshProductDisplay() // Update customer-facing display immediately
  closeAddCategoryModal()
}

// Enhanced category deletion
function deleteCategory(categoryId) {
  const productsInCategory = products.filter((p) => p.category === categoryId)
  if (productsInCategory.length > 0) {
    if (
      !confirm(
        `This category has ${productsInCategory.length} products. Deleting it will also delete all products in this category. Continue?`,
      )
    ) {
      return
    }

    // Remove products in this category
    const productsInCategoryIndices = []
    products.forEach((product, index) => {
      if (product.category === categoryId) {
        productsInCategoryIndices.push(index)
      }
    })

    // Remove products in reverse order to avoid index issues
    productsInCategoryIndices.sort((a, b) => b - a)
    productsInCategoryIndices.forEach((index) => {
      products.splice(index, 1)
    })

    localStorage.setItem("joyfulProducts", JSON.stringify(products))
  }

  const index = categories.findIndex((c) => c.id === categoryId)
  if (index > -1) {
    categories.splice(index, 1)
    localStorage.setItem("joyfulCategories", JSON.stringify(categories))
    updateCategoriesGrid()
    updateProductsTable()
    populateProductCategories()
    refreshProductDisplay() // Update customer-facing display immediately
    showNotification("Category and associated products deleted successfully!", "success")
  }
}

// ========== CATEGORY MANAGEMENT ==========
function updateCategoriesGrid() {
  const grid = document.getElementById("categoriesGrid")
  if (!grid) return

  if (categories.length === 0) {
    grid.innerHTML = '<p class="no-orders">No categories found.</p>'
  } else {
    grid.innerHTML = categories
      .sort((a, b) => a.order - b.order)
      .map((category) => {
        const productCount = products.filter((p) => p.category === category.id).length
        return `
          <div class="category-card">
            <h4>
              ${category.name}
              <div class="category-actions">
                <button class="edit-btn" onclick="editCategory('${category.id}')">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteCategory('${category.id}')">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </h4>
            <div class="category-info">ID: ${category.id}</div>
            <div class="category-info">${category.description || "No description"}</div>
            <div class="category-products-count">${productCount} products</div>
          </div>
        `
      })
      .join("")
  }
}

function showAddCategoryModal() {
  const modal = document.getElementById("addCategoryModal")
  const title = document.getElementById("categoryModalTitle")
  const form = document.getElementById("categoryForm")
  const editId = document.getElementById("editCategoryId")

  if (title) title.textContent = "Add New Category"
  if (form) form.reset()
  if (editId) editId.value = ""
  if (modal) modal.classList.add("show")
}

function closeAddCategoryModal() {
  const modal = document.getElementById("addCategoryModal")
  if (modal) modal.classList.remove("show")
}

function editCategory(categoryId) {
  const category = categories.find((c) => c.id === categoryId)
  if (!category) return

  const fields = {
    categoryModalTitle: "Edit Category",
    editCategoryId: category.id,
    categoryName: category.name,
    categoryId: category.id,
    categoryDescription: category.description || "",
    categoryOrder: category.order,
  }

  Object.entries(fields).forEach(([id, value]) => {
    const element = document.getElementById(id)
    if (element) {
      if (id === "categoryModalTitle") {
        element.textContent = value
      } else {
        element.value = value
      }
    }
  })

  const modal = document.getElementById("addCategoryModal")
  if (modal) modal.classList.add("show")
}

// ========== CONTACT FORM ==========
function handleContactForm(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const message = {
    id: "MSG" + Date.now(),
    name: formData.get("name") || event.target.querySelector('input[type="text"]').value,
    email: formData.get("email") || event.target.querySelector('input[type="email"]').value,
    message: formData.get("message") || event.target.querySelector("textarea").value,
    date: new Date().toISOString(),
    read: false,
  }

  messages.push(message)
  localStorage.setItem("joyfulMessages", JSON.stringify(messages))

  event.target.reset()
  showNotification("Message sent successfully! We will get back to you soon.", "success")
}

// Correct the undeclared variable 'L'
if (typeof L === "undefined") {
  console.error("Leaflet library is not loaded. Please include Leaflet in your HTML.")
}
