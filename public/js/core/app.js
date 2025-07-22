// ===== MAIN APPLICATION JAVASCRIPT =====
// Simplified version - No form validation or fetch requests to avoid backend conflicts

class URLShortener {
  constructor() {
    this.initAnimations()
    this.initCopyFeature()
    this.initPasswordToggle()
  }

  // Initialize page animations
  initAnimations() {
    // Fade in elements on page load
    const elements = document.querySelectorAll('.fade-in')
    elements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.1}s`
    })

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in')
        }
      })
    }, observerOptions)

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el)
    })
  }

  // Initialize copy feature
  initCopyFeature() {
    // Check if clipboard API is supported
    if (!navigator.clipboard) {
      console.warn('Clipboard API not supported')
      return
    }

    // Initialize copy functionality when DOM is ready
    setTimeout(() => {
      this.initCopyButtons()
    }, 100)
  }

  // Initialize copy buttons
  initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn')
    copyButtons.forEach(btn => {
      btn.addEventListener('click', this.handleCopy.bind(this))
    })
  }

  // Handle copy to clipboard
  async handleCopy(e) {
    const button = e.target.closest('.copy-btn')
    const textToCopy = button.dataset.copy
    const originalText = button.textContent

    try {
      await navigator.clipboard.writeText(textToCopy)

      // Visual feedback
      button.classList.add('copy-success')
      button.textContent = 'Copied!'

      setTimeout(() => {
        button.classList.remove('copy-success')
        button.textContent = originalText
      }, 2000)

      this.showNotification('Copied to clipboard!', 'success')
    } catch (error) {
      console.error('Copy failed:', error)
      this.showNotification('Failed to copy to clipboard', 'error')
    }
  }

  // Show notification (simplified version)
  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification')
    if (existing) existing.remove()

    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `

    // Add notification styles
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `

    // Type-specific colors
    const colors = {
      success: { bg: '#10b981', color: '#ffffff' },
      error: { bg: '#ef4444', color: '#ffffff' },
      warning: { bg: '#f59e0b', color: '#ffffff' },
      info: { bg: '#3b82f6', color: '#ffffff' },
    }

    const typeColor = colors[type] || colors.info
    notification.style.backgroundColor = typeColor.bg
    notification.style.color = typeColor.color

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)'
    }, 10)

    // Close button functionality
    notification
      .querySelector('.notification-close')
      .addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)'
        setTimeout(() => notification.remove(), 300)
      })

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(400px)'
        setTimeout(() => notification.remove(), 300)
      }
    }, 5000)
  }

  // Utility function to format numbers
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  // Utility function to format dates
  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Password toggle functionality
  initPasswordToggle() {
    const passwordContainers = document.querySelectorAll(
      '.password-input-container'
    )

    passwordContainers.forEach(container => {
      const passwordInput = container.querySelector('.password-field')
      const toggleButton = container.querySelector('.password-toggle')
      const showIcon = container.querySelector('.show-icon')
      const hideIcon = container.querySelector('.hide-icon')

      if (!passwordInput || !toggleButton || !showIcon || !hideIcon)
        return

      // Click event for toggle button
      toggleButton.addEventListener('click', e => {
        e.preventDefault() // Prevent form submission
        this.togglePassword(
          passwordInput,
          showIcon,
          hideIcon,
          toggleButton
        )
      })

      // Keyboard accessibility
      toggleButton.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          this.togglePassword(
            passwordInput,
            showIcon,
            hideIcon,
            toggleButton
          )
        }
      })

      // Prevent toggle button from interfering with form submission
      toggleButton.addEventListener('mousedown', e => {
        e.preventDefault()
      })
    })
  }

  // Helper method to toggle password visibility
  togglePassword(passwordInput, showIcon, hideIcon, toggleButton) {
    const isPassword = passwordInput.type === 'password'

    // Toggle input type
    passwordInput.type = isPassword ? 'text' : 'password'

    // Toggle icons with smooth transition
    if (isPassword) {
      showIcon.style.display = 'none'
      hideIcon.style.display = 'inline'
      toggleButton.setAttribute('aria-label', 'Hide password')
      toggleButton.title = 'Hide password'
    } else {
      showIcon.style.display = 'inline'
      hideIcon.style.display = 'none'
      toggleButton.setAttribute('aria-label', 'Show password')
      toggleButton.title = 'Show password'
    }

    // Maintain focus on input after toggle
    passwordInput.focus()
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new URLShortener()
})

// Export for use in other files
window.URLShortener = URLShortener
