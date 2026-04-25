// Projects Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.projects-filter-btn');
    const projectCards = document.querySelectorAll('.projects-card');
    
    // Initialize filter functionality
    function initializeFilters() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter projects
                filterProjects(filterValue);
            });
        });
    }
    
    // Filter projects based on category
    function filterProjects(category) {
        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.classList.remove('hidden');
                
                // Add fade-in animation
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }, 300);
            }
        });

        // Refresh AOS layout after filtering
        if (typeof AOS !== 'undefined') {
            setTimeout(() => {
                AOS.refresh();
            }, 400);
        }
    }
    
    // Initialize the filter system
    initializeFilters();
    
    // Show all projects initially (if needed, but usually HTML handles initial state)
    // filterProjects('all'); 
});

// Add smooth scrolling for project buttons (if any exist with this class)
document.addEventListener('DOMContentLoaded', function() {
    const projectButtons = document.querySelectorAll('.project-btn');
    
    projectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'translateX(8px) scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = 'translateX(4px) scale(1)';
            }, 150);
            
            // Here you can add navigation to project detail page
            console.log('Navigate to project details');
        });
    });
});