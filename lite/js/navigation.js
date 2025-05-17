// File: js/navigation.js
$(document).ready(function() {
    // Load the navigation content
    $('#sidebar').load('../../includes/navigation.html', function() {
        // After loading the navigation, set up the event handlers
        setupNavigation();
        
        // Highlight current page in navigation
        highlightCurrentPage();
    });
    
    // Mobile sidebar toggle
    $('#sidebar-toggle').click(function() {
        $('#sidebar').toggleClass('show');
    });
    
    // Close sidebar when clicking outside on mobile
    $(document).click(function(event) {
        if (!$(event.target).closest('#sidebar').length && 
            !$(event.target).closest('#sidebar-toggle').length && 
            $('#sidebar').hasClass('show')) {
            $('#sidebar').removeClass('show');
        }
    });
});

function setupNavigation() {
    // Accordion functionality for submenu items
    $('.nav-link[data-bs-toggle="collapse"]').click(function() {
        const chevron = $(this).find('.chevron-icon');
        chevron.toggleClass('rotate-down');
    });
    
    // Also listen for Bootstrap events
    $('.submenu').on('show.bs.collapse', function() {
        const toggleLink = $(`[href="#${$(this).attr('id')}"]`);
        const chevron = toggleLink.find('.chevron-icon');
        chevron.addClass('rotate-down');
    });
    
    $('.submenu').on('hide.bs.collapse', function() {
        const toggleLink = $(`[href="#${$(this).attr('id')}"]`);
        const chevron = toggleLink.find('.chevron-icon');
        chevron.removeClass('rotate-down');
    });
    
    // Close sidebar on link click in mobile view
    $('.sidebar .nav-link').click(function() {
        if ($(window).width() < 768 && !$(this).attr('data-bs-toggle')) {
            $('#sidebar').removeClass('show');
        }
    });
}

function highlightCurrentPage() {
    // Get current page path
    const currentPage = window.location.pathname;
    
    // Find and mark the active link
    $('.nav-link').each(function() {
        const href = $(this).attr('href');
        if (href && currentPage.endsWith(href)) {
            $(this).addClass('active');
            
            // If it's in a submenu, expand that menu
            const submenu = $(this).closest('.submenu');
            if (submenu.length) {
                submenu.addClass('show');
                const toggleLink = $(`[href="#${submenu.attr('id')}"]`);
                const chevron = toggleLink.find('.chevron-icon');
                chevron.addClass('rotate-down');
            }
        }
    });
}