
document.addEventListener('DOMContentLoaded', function() {
    // Mobile sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebar = document.getElementById('sidebar');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('show');
    });
    
    sidebarClose.addEventListener('click', function() {
        sidebar.classList.remove('show');
    });
    
    // Make chevron icons rotate when menu is expanded
    document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(function(element) {
        element.addEventListener('click', function() {
            const chevron = this.querySelector('.chevron-icon');
            chevron.classList.toggle('rotate-down');
        });
        
        // Also listen for Bootstrap events
        const targetId = element.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.addEventListener('show.bs.collapse', function() {
                const chevron = element.querySelector('.chevron-icon');
                chevron.classList.add('rotate-down');
            });
            
            targetElement.addEventListener('hide.bs.collapse', function() {
                const chevron = element.querySelector('.chevron-icon');
                chevron.classList.remove('rotate-down');
            });
        }
    });
    
    // Detect current page and set active class
    const currentPage = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(function(link) {
        if (link.getAttribute('href') && currentPage.endsWith(link.getAttribute('href'))) {
            link.classList.add('active');
            
            // If it's in a submenu, expand that menu
            const parentSubmenu = link.closest('.submenu');
            if (parentSubmenu) {
                parentSubmenu.classList.add('show');
                const toggleButton = document.querySelector(`[href="#${parentSubmenu.id}"]`);
                if (toggleButton) {
                    const chevron = toggleButton.querySelector('.chevron-icon');
                    chevron.classList.add('rotate-down');
                }
            }
        }
    });
});