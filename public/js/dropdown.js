document.addEventListener('DOMContentLoaded', function() {
  // Handle user dropdown menu
  const userMenuButton = document.getElementById('user-menu-button');
  const userDropdown = document.getElementById('userDropdown');
  
  if (userMenuButton && userDropdown) {
    // Toggle user dropdown menu when clicking the button
    userMenuButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      userDropdown.classList.toggle('hidden');
    });
    
    // Log for debugging
    console.log('User dropdown menu initialized');
  } else {
    console.log('User dropdown elements not found');
    if (!userMenuButton) console.log('Missing: user-menu-button');
    if (!userDropdown) console.log('Missing: userDropdown');
  }
  
  // Handle mobile menu
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileMenuButton && mobileMenu) {
    // Toggle mobile menu when clicking the button
    mobileMenuButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      mobileMenu.classList.toggle('hidden');
    });
    
    console.log('Mobile menu initialized');
  }
  
  // Close all dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    // Close user dropdown if clicked outside
    if (userDropdown && userMenuButton && !userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.add('hidden');
    }
    
    // Close mobile menu if clicked outside
    if (mobileMenu && mobileMenuButton && !mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden');
    }
  });
  
  console.log('Dropdown script loaded');
});
