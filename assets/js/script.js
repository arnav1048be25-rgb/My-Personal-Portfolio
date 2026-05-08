'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}


// page navigation variables
const navLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navLinks.forEach((link) => {

  link.addEventListener("click", function () {

    const target = this.innerText.trim().toLowerCase();

    // remove active everywhere
    navLinks.forEach((item) => item.classList.remove("active"));
    pages.forEach((page) => page.classList.remove("active"));

    // active clicked button
    this.classList.add("active");

    // active matching page
    pages.forEach((page) => {
      if (page.dataset.page === target) {
        page.classList.add("active");
      }
    });

  });

});

/*-----------------------------------*\
  #BLOG SEARCH AND FILTER FUNCTIONALITY
\*-----------------------------------*/

// Blog search and filter variables
const blogSearchInput = document.querySelector("#blogSearchInput");
const searchClearBtn = document.querySelector("#searchClearBtn");
const searchVoiceBtn = document.querySelector("#searchVoiceBtn");
const searchResultsInfo = document.querySelector("#searchResultsInfo");
const blogPostsList = document.querySelector("#blogPostsList");
const blogPostItems = document.querySelectorAll(".blog-post-item");
const tagFilters = document.querySelectorAll(".tag-filter");

// Update search results counter
function updateSearchResults() {
  const visiblePosts = Array.from(blogPostItems).filter(post => !post.classList.contains("hidden")).length;
  const totalPosts = blogPostItems.length;
  
  if (blogSearchInput && blogSearchInput.value.trim()) {
    searchResultsInfo.textContent = `Found ${visiblePosts} of ${totalPosts} posts`;
    searchResultsInfo.classList.add("active");
  } else {
    searchResultsInfo.textContent = '';
    searchResultsInfo.classList.remove("active");
  }
}

function restorePostText(post) {
  const title = post.querySelector(".blog-item-title");
  const text = post.querySelector(".blog-text");
  
  if (title.innerHTML.includes("<mark")) {
    title.textContent = title.textContent;
  }
  if (text.innerHTML.includes("<mark")) {
    text.textContent = text.textContent;
  }
}

// Blog search function with highlighting
function searchBlogPosts(searchTerm) {
  const term = searchTerm.toLowerCase().trim();
  let matchCount = 0;
  let firstMatch = null;
  
  blogPostItems.forEach((post, index) => {
    restorePostText(post);
    const title = post.querySelector(".blog-item-title");
    const text = post.querySelector(".blog-text");
    const tags = post.querySelector(".blog-tags-list");
    
    const titleText = title.textContent.toLowerCase();
    const textContent = text.textContent.toLowerCase();
    const tagsContent = tags.textContent.toLowerCase();
    
    const isMatch = titleText.includes(term) || textContent.includes(term) || tagsContent.includes(term);
    
    if (isMatch) {
      post.classList.remove("hidden");
      post.style.display = "block";
      post.style.animation = "none";
      post.offsetHeight; // Trigger reflow
      post.style.animation = "fadeInUp 0.3s ease forwards";
      post.style.animationDelay = `${matchCount * 0.03}s`;
      
      if (term && titleText.includes(term)) {
        const regex = new RegExp(`(${term})`, 'gi');
        const highlighted = title.textContent.replace(regex, '<mark class="search-highlight">$1</mark>');
        title.innerHTML = highlighted;
      }
      
      if (term && textContent.includes(term)) {
        const regex = new RegExp(`(${term})`, 'gi');
        const highlighted = text.textContent.replace(regex, '<mark class="search-highlight">$1</mark>');
        text.innerHTML = highlighted;
      }
      
      matchCount++;
      if (!firstMatch) {
        firstMatch = post;
      }
    } else {
      post.classList.add("hidden");
      post.style.display = "none";
    }
  });
  
  if (firstMatch && term) {
    firstMatch.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  updateSearchResults();
  
  if (matchCount === 0 && term) {
    showNoResultsMessage();
  } else {
    clearNoResultsMessage();
  }
}

// Show no results message
function showNoResultsMessage() {
  let noResultsMsg = document.querySelector(".no-results-message");
  if (!noResultsMsg) {
    noResultsMsg = document.createElement("div");
    noResultsMsg.className = "no-results-message";
    noResultsMsg.innerHTML = '<ion-icon name="search-outline"></ion-icon><p>No blog posts found. Try a different search term!</p>';
    blogPostsList.appendChild(noResultsMsg);
  }
}

// Clear no results message
function clearNoResultsMessage() {
  const noResultsMsg = document.querySelector(".no-results-message");
  if (noResultsMsg) {
    noResultsMsg.remove();
  }
}

// Blog filter by category function
function filterBlogByCategory(category) {
  blogPostItems.forEach(post => {
    const postCategory = post.dataset.blogCategory;
    
    // Restore original text (remove highlights)
    const title = post.querySelector(".blog-item-title");
    const text = post.querySelector(".blog-text");
    if (title.innerHTML.includes("<mark")) {
      const originalTitle = title.innerHTML.replace(/<mark class="search-highlight">|<\/mark>/g, '');
      title.textContent = originalTitle;
    }
    if (text.innerHTML.includes("<mark")) {
      const originalText = text.innerHTML.replace(/<mark class="search-highlight">|<\/mark>/g, '');
      text.textContent = originalText;
    }
    
    if (category === "all" || postCategory === category) {
      post.classList.remove("hidden");
      post.style.display = "block";
      post.style.animation = "fadeInUp 0.3s ease";
    } else {
      post.classList.add("hidden");
      post.style.display = "none";
    }
  });
}

// Add event listeners for blog search
if (blogSearchInput) {
  blogSearchInput.addEventListener("input", function() {
    if (this.value.trim()) {
      searchBlogPosts(this.value);
    } else {
      // Restore original text and show all posts
      blogPostItems.forEach(post => {
        const title = post.querySelector(".blog-item-title");
        const text = post.querySelector(".blog-text");
        
        if (title.innerHTML.includes("<mark")) {
          title.textContent = title.textContent;
        }
        if (text.innerHTML.includes("<mark")) {
          text.textContent = text.textContent;
        }
        
        post.classList.remove("hidden");
        post.style.display = "block";
      });
      searchResultsInfo.textContent = '';
      searchResultsInfo.classList.remove("active");
      clearNoResultsMessage();
    }
  });
  
  // Clear button functionality
  if (searchClearBtn) {
    searchClearBtn.addEventListener("click", function() {
      blogSearchInput.value = '';
      blogSearchInput.focus();
      
      // Restore original text
      blogPostItems.forEach(post => {
        const title = post.querySelector(".blog-item-title");
        const text = post.querySelector(".blog-text");
        
        if (title.innerHTML.includes("<mark")) {
          title.textContent = title.textContent;
        }
        if (text.innerHTML.includes("<mark")) {
          text.textContent = text.textContent;
        }
        
        post.classList.remove("hidden");
        post.style.display = "block";
        post.style.animation = "none";
      });
      
      searchResultsInfo.textContent = '';
      searchResultsInfo.classList.remove("active");
      clearNoResultsMessage();
      this.style.display = 'none';
    });
  }
}

// Voice search functionality
if (searchVoiceBtn) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    searchVoiceBtn.addEventListener("click", function() {
      if (!this.classList.contains("active")) {
        recognition.start();
        this.classList.add("active");
      } else {
        recognition.stop();
        this.classList.remove("active");
      }
    });
    
    recognition.addEventListener("result", function(event) {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + ' ';
      }
      
      if (transcript.trim()) {
        blogSearchInput.value = transcript.trim();
        blogSearchInput.dispatchEvent(new Event('input'));
      }
    });
    
    recognition.addEventListener("end", function() {
      searchVoiceBtn.classList.remove("active");
    });
    
    recognition.addEventListener("error", function(event) {
      console.error('Speech recognition error:', event.error);
      searchVoiceBtn.classList.remove("active");
    });
  } else {
    searchVoiceBtn.style.display = 'none';
  }
}

// Add event listeners for tag filters
tagFilters.forEach(filter => {
  filter.addEventListener("click", function() {
    // Remove active class from all filters
    tagFilters.forEach(f => f.classList.remove("active"));
    
    // Add active class to clicked filter
    this.classList.add("active");
    
    // Use combined search filter to maintain search highlights
    combinedSearchFilter();
  });
});

// Combined search and filter with highlighting
function combinedSearchFilter() {
  const searchTerm = blogSearchInput ? blogSearchInput.value.toLowerCase().trim() : "";
  const activeFilter = document.querySelector(".tag-filter.active");
  const activeCategory = activeFilter ? activeFilter.dataset.tag : "all";
  
  let matchCount = 0;
  let firstMatch = null;
  
  blogPostItems.forEach(post => {
    const postCategory = post.dataset.blogCategory;
    restorePostText(post);
    const title = post.querySelector(".blog-item-title");
    const text = post.querySelector(".blog-text");
    
    const titleText = title.textContent.toLowerCase();
    const textContent = text.textContent.toLowerCase();
    
    const matchesSearch = !searchTerm || titleText.includes(searchTerm) || textContent.includes(searchTerm);
    const matchesCategory = activeCategory === "all" || postCategory === activeCategory;
    
    if (matchesSearch && matchesCategory) {
      post.classList.remove("hidden");
      post.style.display = "block";
      post.style.animation = "none";
      post.offsetHeight;
      post.style.animation = `fadeInUp 0.3s ease forwards`;
      post.style.animationDelay = `${matchCount * 0.03}s`;
      
      if (searchTerm && titleText.includes(searchTerm)) {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const highlighted = title.textContent.replace(regex, '<mark class="search-highlight">$1</mark>');
        title.innerHTML = highlighted;
      }
      if (searchTerm && textContent.includes(searchTerm)) {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const highlighted = text.textContent.replace(regex, '<mark class="search-highlight">$1</mark>');
        text.innerHTML = highlighted;
      }
      
      matchCount++;
      if (!firstMatch) {
        firstMatch = post;
      }
    } else {
      post.classList.add("hidden");
      post.style.display = "none";
    }
  });
  
  if (firstMatch && searchTerm) {
    firstMatch.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  updateSearchResults();
  
  if (matchCount === 0 && searchTerm) {
    showNoResultsMessage();
  } else {
    clearNoResultsMessage();
  }
}


/*-----------------------------------*\
  #PROJECT HOVER EFFECTS
\*-----------------------------------*/

// Add hover effects to project items
const projectItems = document.querySelectorAll(".project-item");

projectItems.forEach(item => {
  item.addEventListener("mouseenter", function() {
    this.style.transform = "translateY(-5px)";
    this.style.transition = "all 0.3s ease";
  });
  
  item.addEventListener("mouseleave", function() {
    this.style.transform = "translateY(0)";
  });
});


/*-----------------------------------*\
  #PORTFOLIO STAT ANIMATION
\*-----------------------------------*/

// Animate portfolio stats on scroll
const observerOptions = {
  threshold: 0.5
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = "fadeInUp 0.6s ease";
    }
  });
}, observerOptions);

// Observe stat boxes
const statBoxes = document.querySelectorAll(".stat-box");
statBoxes.forEach(box => observer.observe(box));
const searchInput = document.getElementById("blogSearchInput");
const posts = document.querySelectorAll(".blog-post-item");
const noResults = document.getElementById("noResultsMessage");

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  let visible = 0;

  posts.forEach(post => {
    const text = post.innerText.toLowerCase();

    if (text.includes(value)) {
      post.style.display = "block";
      visible++;
    } else {
      post.style.display = "none";
    }
  });

  noResults.hidden = visible !== 0;
});
const tagButtons = document.querySelectorAll(".tag-filter");

tagButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    document.querySelector(".tag-filter.active")?.classList.remove("active");
    btn.classList.add("active");

    const tag = btn.dataset.tag;

    posts.forEach(post => {
      if (tag === "all" || post.dataset.blogCategory === tag) {
        post.style.display = "block";
      } else {
        post.style.display = "none";
      }
    });
  });
});
document.querySelectorAll(".read-more-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const text = btn.parentElement.querySelector(".blog-text");

    text.classList.toggle("expanded");
    btn.innerText = text.classList.contains("expanded") ? "Read Less" : "Read More";
  });
});
document.querySelector(".form").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("✅ Message sent successfully!");
});
const cards = document.querySelectorAll(".card img");
const popup = document.getElementById("popup");
const popupImg = document.getElementById("popup-img");
const close = document.getElementById("close");

cards.forEach(img => {
  img.onclick = () => {
    popup.style.display = "flex";
    popupImg.src = img.src;
  };
});
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

formInputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  alert("Message sent successfully!");

  form.reset();
  formBtn.setAttribute("disabled", "");

  document.querySelectorAll("[data-page]").forEach((page) => {
    page.classList.remove("active");
  });

  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.classList.remove("active");
  });

  document.querySelector('[data-page="about"]').classList.add("active");
  document.querySelector("[data-nav-link]").classList.add("active");

  window.scrollTo(0, 0);
});
