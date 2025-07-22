// ===== DASHBOARD SPECIFIC FUNCTIONALITY =====
// Simplified version - No form listeners or fetch requests

class Dashboard {
  constructor() {
    // Clean up any orphaned tooltips first
    this.cleanupOrphanedElements()

    this.initDashboard()
    this.initStats()
    this.initTooltips()
  }

  cleanupOrphanedElements() {
    // Remove any floating tooltip elements
    const orphanedTooltips = document.querySelectorAll(
      '.tooltip, .dashboard-tooltip, [class*="tooltip"]'
    )
    orphanedTooltips.forEach(element => {
      // Only remove if it's clearly an orphaned tooltip
      if (
        element.style.position === 'absolute' &&
        element.style.zIndex >= '1000'
      ) {
        element.remove()
      }
    })

    // Clean up any elements with tooltip-like properties that might be orphaned
    const suspiciousElements = document.querySelectorAll('div')
    suspiciousElements.forEach(element => {
      const style = window.getComputedStyle(element)
      if (
        style.position === 'absolute' &&
        (style.backgroundColor === 'rgb(31, 41, 55)' ||
          style.backgroundColor === '#1f2937') &&
        style.zIndex >= '1000' &&
        !element.closest('.card, .container, .header') &&
        element.textContent.length < 50
      ) {
        // Likely a tooltip
        element.remove()
      }
    })
  }

  initDashboard() {
    // Initialize tooltips
    this.initTooltips()

    // Initialize visual enhancements only
    this.initVisualFeatures()
  }

  initStats() {
    this.animateCounters()
  }

  initVisualFeatures() {
    // QR Code generation
    const qrButtons = document.querySelectorAll('.qr-btn')
    qrButtons.forEach(btn => {
      btn.addEventListener('click', this.generateQR.bind(this))
    })

    // Analytics modal (demo only)
    const analyticsButtons =
      document.querySelectorAll('.analytics-btn')
    analyticsButtons.forEach(btn => {
      btn.addEventListener('click', this.showAnalytics.bind(this))
    })
  }

  initTooltips() {
    const tooltipElements =
      document.querySelectorAll('[data-tooltip]')
    tooltipElements.forEach(el => {
      el.addEventListener('mouseenter', this.showTooltip.bind(this))
      el.addEventListener('mouseleave', this.hideTooltip.bind(this))
    })
  }

  animateCounters() {
    const counters = document.querySelectorAll('.counter')
    counters.forEach(counter => {
      const target = parseInt(counter.textContent)
      const increment = target / 50
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          counter.textContent = target
          clearInterval(timer)
        } else {
          counter.textContent = Math.floor(current)
        }
      }, 50)
    })
  }

  generateQR(e) {
    const url = e.target.dataset.url
    if (!url) return

    // Create modal for QR code
    const modal = document.createElement('div')
    modal.className = 'modal-overlay'
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>QR Code</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body text-center">
                    <div id="qr-code"></div>
                    <p class="text-sm text-muted mt-3">${url}</p>
                    <button class="btn btn-primary mt-3" onclick="this.closest('.modal-overlay').remove()">
                        Close
                    </button>
                </div>
            </div>
        `

    document.body.appendChild(modal)

    // Generate QR code using a service like qr-server.com
    const qrDiv = document.getElementById('qr-code')
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      url
    )}`
    qrDiv.innerHTML = `<img src="${qrUrl}" alt="QR Code" style="max-width: 200px;">`

    // Close modal when clicking outside
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.remove()
      }
    })

    // Close button
    modal
      .querySelector('.modal-close')
      .addEventListener('click', () => {
        modal.remove()
      })
  }

  showAnalytics(e) {
    const button = e.target.closest('.analytics-btn')
    const urlId = button.dataset.urlId
    const actualClicks = parseInt(button.dataset.clicks) || 0

    // console.log(
    //   'Show analytics for URL:',
    //   urlId,
    //   'Clicks:',
    //   actualClicks
    // )

    // Create analytics modal with real data
    const modal = document.createElement('div')
    modal.className = 'modal-overlay'
    modal.innerHTML = `
            <div class="modal-content modal-lg">
                <div class="modal-header">
                    <h3>📊 URL Analytics</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="analytics-overview mb-4">
                        <div class="analytics-summary">
                            <div class="analytics-primary-stat">
                                <h2 class="analytics-main-count">${actualClicks}</h2>
                                <p class="analytics-main-label">Total Clicks</p>
                            </div>
                            <div class="analytics-status ${
                              actualClicks > 0 ? 'active' : 'inactive'
                            }">
                                ${
                                  actualClicks > 0
                                    ? '🟢 Active'
                                    : '⭕ No Clicks Yet'
                                }
                            </div>
                        </div>
                    </div>
                    <div class="analytics-details">
                        <div class="analytics-single-card">
                            <div class="analytics-card-content">
                                <h4>📈 Performance Summary</h4>
                                <div class="analytics-description">
                                    ${
                                      actualClicks > 0
                                        ? `This URL has received <strong>${actualClicks}</strong> total clicks and is actively being used.`
                                        : "This URL hasn't received any clicks yet. Share it to start tracking visits!"
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4">
                        <div class="analytics-note">
                            <p class="text-sm text-secondary text-center">
                                <strong>Real-time Analytics:</strong> Click counts are updated automatically when users visit your shortened URLs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `

    document.body.appendChild(modal)

    // Close modal functionality
    const closeModal = () => modal.remove()
    modal
      .querySelector('.modal-close')
      .addEventListener('click', closeModal)
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal()
    })
  }

  showTooltip(e) {
    const element = e.target
    const tooltipText = element.dataset.tooltip

    // Remove any existing tooltips first
    this.removeAllTooltips()

    if (!tooltipText) return

    const tooltip = document.createElement('div')
    tooltip.className = 'dashboard-tooltip'
    tooltip.innerHTML = `
        <div class="tooltip-content">${tooltipText}</div>
        <div class="tooltip-arrow"></div>
    `
    tooltip.style.cssText = `
            position: absolute;
            background: #1f2937;
            color: white;
            padding: 0.5rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `

    document.body.appendChild(tooltip)

    const rect = element.getBoundingClientRect()
    const tooltipRect = tooltip.getBoundingClientRect()

    // Check if this is an action button in the table
    const isActionButton = element.closest('.action-buttons') !== null

    // Position tooltip above element, centered
    let left = rect.left + rect.width / 2 - tooltipRect.width / 2
    let top = rect.top - tooltipRect.height - 12 // Space for arrow
    let showBelow = false

    // Special positioning for action buttons
    if (isActionButton) {
      // For action buttons, position tooltip more precisely
      left = rect.left + rect.width / 2 - tooltipRect.width / 2
      top = rect.top - tooltipRect.height - 16 // More space above for arrow

      // If tooltip goes off screen to the left
      if (left < 5) {
        left = rect.left - 8 // Align slightly left of button
      }

      // If tooltip goes off screen to the right
      if (left + tooltipRect.width > window.innerWidth - 5) {
        left = rect.right - tooltipRect.width + 8 // Align slightly right of button
      }
    }

    // Keep tooltip within viewport (general rules)
    if (left < 5) left = 5
    if (left + tooltipRect.width > window.innerWidth - 5) {
      left = window.innerWidth - tooltipRect.width - 5
    }
    if (top < 5) {
      top = rect.bottom + 12 // Show below if no space above (space for arrow)
      showBelow = true
    }

    // Add scroll offset
    top += window.scrollY
    left += window.scrollX

    tooltip.style.left = left + 'px'
    tooltip.style.top = top + 'px'

    // Adjust arrow direction based on position
    const arrow = tooltip.querySelector('.tooltip-arrow')
    if (showBelow) {
      arrow.style.bottom = 'auto'
      arrow.style.top = '-4px'
      arrow.style.borderTop = 'none'
      arrow.style.borderBottom = '4px solid #1f2937'
    }

    setTimeout(() => (tooltip.style.opacity = '1'), 10)

    element._tooltip = tooltip
  }

  hideTooltip(e) {
    const element = e.target
    const tooltip = element._tooltip
    if (tooltip) {
      tooltip.style.opacity = '0'
      setTimeout(() => {
        if (tooltip && tooltip.parentNode) {
          tooltip.remove()
        }
      }, 200)
      element._tooltip = null
    }
  }

  removeAllTooltips() {
    const existingTooltips = document.querySelectorAll(
      '.dashboard-tooltip'
    )
    existingTooltips.forEach(tooltip => tooltip.remove())
  }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.dashboard-container')) {
    // Clean up any existing tooltips first
    const existingTooltips = document.querySelectorAll(
      '.dashboard-tooltip, .tooltip'
    )
    existingTooltips.forEach(tooltip => tooltip.remove())

    new Dashboard()
  }
})

// Clean up tooltips when page unloads
window.addEventListener('beforeunload', () => {
  const tooltips = document.querySelectorAll(
    '.dashboard-tooltip, .tooltip'
  )
  tooltips.forEach(tooltip => tooltip.remove())
})

// Export for global use
window.Dashboard = Dashboard
