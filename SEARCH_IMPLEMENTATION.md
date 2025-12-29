# Search Feature Implementation Guide

## Overview
This search feature allows users to search across all portfolio content (Projects, Hands-On Labs, Blog Posts) with results grouped by category.

## Architecture

### 1. Data Structure (`search-data.js`)
```
searchData = {
    projects: [...],    // 6 projects
    handsOn: [...],     // 3 hands-on labs
    blog: [...]         // Loaded dynamically from blog-index.json
}
```

### 2. Search Implementation Steps

#### Step 1: Add Fuse.js CDN (Already available in certification pages)
Add this in `<head>` if not present:
```html
<script src="https://cdn.jsdelivr.net/npm/fuse.js@6.6.2"></script>
```

#### Step 2: Add Search Data Script
Add before closing `</body>`:
```html
<script src="search-data.js"></script>
```

#### Step 3: Add Search UI in Navigation
Insert search button in navigation (line ~250):
```html
<button id="search-toggle" class="text-gray-300 hover:text-secondary transition-colors duration-200 cursor-pointer" aria-label="Search">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
    </svg>
</button>
```

#### Step 4: Add Search Modal/Overlay
Add before closing `</body>`:
```html
<!-- Search Modal -->
<div id="search-modal" class="fixed inset-0 bg-dark-900/90 backdrop-blur-lg z-50 hidden">
    <div class="max-w-4xl mx-auto px-4 py-8 h-full flex flex-col">
        <!-- Search Header -->
        <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-mono font-bold text-gray-100">
                    <span class="text-secondary">#</span> Search Portfolio
                </h2>
                <button id="search-close" class="text-gray-400 hover:text-gray-100 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <!-- Search Input -->
            <div class="relative">
                <input
                    type="text"
                    id="search-input"
                    placeholder="Search projects, tutorials, blog posts... (e.g., 'kubernetes', 'terraform', 'security')"
                    class="w-full bg-dark-800 border border-primary/30 rounded-lg px-4 py-3 pl-12 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary font-mono"
                    autocomplete="off"
                />
                <svg class="w-5 h-5 absolute left-4 top-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
            </div>

            <!-- Quick Filters -->
            <div class="flex flex-wrap gap-2 mt-4">
                <span class="text-gray-400 text-sm font-mono">Quick filters:</span>
                <button class="filter-btn bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1 rounded text-xs font-mono transition-colors" data-filter="DevOps">DevOps</button>
                <button class="filter-btn bg-secondary/20 hover:bg-secondary/30 text-secondary px-3 py-1 rounded text-xs font-mono transition-colors" data-filter="Security">Security</button>
                <button class="filter-btn bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1 rounded text-xs font-mono transition-colors" data-filter="Kubernetes">Kubernetes</button>
                <button class="filter-btn bg-secondary/20 hover:bg-secondary/30 text-secondary px-3 py-1 rounded text-xs font-mono transition-colors" data-filter="Terraform">Terraform</button>
                <button class="filter-btn bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1 rounded text-xs font-mono transition-colors" data-filter="CI/CD">CI/CD</button>
            </div>
        </div>

        <!-- Search Results -->
        <div id="search-results" class="flex-1 overflow-y-auto">
            <div class="text-center py-12 text-gray-400 font-mono">
                Type to search across all content...
            </div>
        </div>
    </div>
</div>
```

#### Step 5: Add Search Logic JavaScript
Add before closing `</body>`:
```javascript
<script>
// Initialize search functionality
let fuseInstance = null;

async function initSearch() {
    // Load blog posts for search
    await loadBlogPostsForSearch();

    // Get all searchable content
    const allContent = getAllSearchableContent();

    // Configure Fuse.js
    const fuseOptions = {
        keys: [
            { name: 'title', weight: 0.4 },
            { name: 'description', weight: 0.3 },
            { name: 'tags', weight: 0.2 },
            { name: 'category', weight: 0.1 }
        ],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 2
    };

    fuseInstance = new Fuse(allContent, fuseOptions);
}

// Open/Close search modal
document.getElementById('search-toggle').addEventListener('click', () => {
    document.getElementById('search-modal').classList.remove('hidden');
    document.getElementById('search-input').focus();
});

document.getElementById('search-close').addEventListener('click', () => {
    document.getElementById('search-modal').classList.add('hidden');
    document.getElementById('search-input').value = '';
    document.getElementById('search-results').innerHTML = '<div class="text-center py-12 text-gray-400 font-mono">Type to search across all content...</div>';
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.getElementById('search-modal').classList.contains('hidden')) {
        document.getElementById('search-close').click();
    }
});

// Perform search
document.getElementById('search-input').addEventListener('input', (e) => {
    const query = e.target.value.trim();

    if (query.length < 2) {
        document.getElementById('search-results').innerHTML = '<div class="text-center py-12 text-gray-400 font-mono">Type to search across all content...</div>';
        return;
    }

    performSearch(query);
});

// Quick filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        document.getElementById('search-input').value = filter;
        performSearch(filter);
    });
});

function performSearch(query) {
    if (!fuseInstance) return;

    const results = fuseInstance.search(query);
    displayResults(results, query);
}

function displayResults(results, query) {
    const resultsContainer = document.getElementById('search-results');

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="text-center py-12">
                <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-gray-400 font-mono">No results found for "${query}"</p>
                <p class="text-gray-500 text-sm font-mono mt-2">Try different keywords or use quick filters</p>
            </div>
        `;
        return;
    }

    // Group results by type
    const grouped = groupResultsByType(results);

    let html = `<div class="space-y-8">`;

    // Projects Section
    if (grouped.projects.length > 0) {
        html += `
            <div>
                <h3 class="text-xl font-mono font-semibold text-primary mb-4">
                    Projects <span class="text-gray-500 text-sm">(${grouped.projects.length})</span>
                </h3>
                <div class="space-y-4">
                    ${grouped.projects.map(item => createResultCard(item)).join('')}
                </div>
            </div>
        `;
    }

    // Hands-On Labs Section
    if (grouped.handsOn.length > 0) {
        html += `
            <div>
                <h3 class="text-xl font-mono font-semibold text-secondary mb-4">
                    Hands-On Labs & Tutorials <span class="text-gray-500 text-sm">(${grouped.handsOn.length})</span>
                </h3>
                <div class="space-y-4">
                    ${grouped.handsOn.map(item => createResultCard(item)).join('')}
                </div>
            </div>
        `;
    }

    // Blog Posts Section
    if (grouped.blog.length > 0) {
        html += `
            <div>
                <h3 class="text-xl font-mono font-semibold text-accent mb-4">
                    Blog Posts <span class="text-gray-500 text-sm">(${grouped.blog.length})</span>
                </h3>
                <div class="space-y-4">
                    ${grouped.blog.map(item => createResultCard(item)).join('')}
                </div>
            </div>
        `;
    }

    html += `</div>`;
    resultsContainer.innerHTML = html;
}

function createResultCard(item) {
    const typeColor = {
        'project': 'primary',
        'hands-on': 'secondary',
        'blog': 'accent'
    }[item.type];

    const typeLabel = {
        'project': 'Project',
        'hands-on': 'Hands-On',
        'blog': 'Blog'
    }[item.type];

    return `
        <a href="${item.link}" class="block bg-dark-800/50 border border-${typeColor}/20 rounded-lg p-4 hover:bg-dark-800 hover:border-${typeColor}/40 transition-all cursor-pointer">
            <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="bg-${typeColor}/20 text-${typeColor} px-2 py-1 rounded text-xs font-mono">${typeLabel}</span>
                        <span class="bg-dark-700 text-gray-300 px-2 py-1 rounded text-xs font-mono">${item.category}</span>
                    </div>
                    <h4 class="text-lg font-mono font-semibold text-gray-100 mb-2">${item.title}</h4>
                    <p class="text-gray-400 text-sm mb-3">${item.description}</p>
                    <div class="flex flex-wrap gap-2">
                        ${item.tags.slice(0, 5).map(tag => `
                            <span class="bg-dark-700/50 text-gray-400 px-2 py-1 rounded text-xs font-mono">${tag}</span>
                        `).join('')}
                        ${item.tags.length > 5 ? `<span class="text-gray-500 text-xs font-mono">+${item.tags.length - 5} more</span>` : ''}
                    </div>
                </div>
                ${item.readTime ? `
                    <div class="ml-4 text-gray-500 text-xs font-mono whitespace-nowrap">${item.readTime}</div>
                ` : ''}
            </div>
        </a>
    `;
}

// Initialize search when page loads
document.addEventListener('DOMContentLoaded', initSearch);
</script>
```

## Search Features

### 1. **Fuzzy Search**
- Uses Fuse.js for intelligent fuzzy matching
- Searches across: title (40%), description (30%), tags (20%), category (10%)
- Minimum 2 characters to trigger search

### 2. **Grouped Results**
Results are automatically grouped into 3 categories:
- **Projects** (purple/primary color)
- **Hands-On Labs & Tutorials** (cyan/secondary color)
- **Blog Posts** (light purple/accent color)

### 3. **Quick Filters**
Pre-defined filter buttons for common searches:
- DevOps
- Security
- Kubernetes
- Terraform
- CI/CD

### 4. **Keyboard Shortcuts**
- `Escape` - Close search modal

### 5. **Visual Feedback**
- Loading states
- Empty states with helpful messages
- Result count badges
- Color-coded type indicators

## Search Logic Flow

```
User Input → Fuse.js Search → Results Array → Group by Type → Display in Sections
     ↓                                                              ↓
Quick Filters                                              Click → Navigate to Content
```

## Customization

### Adjust Search Weights
Modify `fuseOptions.keys` in the search logic:
```javascript
keys: [
    { name: 'title', weight: 0.4 },      // Higher = more important
    { name: 'description', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'category', weight: 0.1 }
]
```

### Adjust Fuzzy Threshold
Lower threshold = stricter matching (0.0 - 1.0):
```javascript
threshold: 0.3  // Default is good balance
```

### Add More Quick Filters
```html
<button class="filter-btn ..." data-filter="YourTag">YourTag</button>
```

## Performance Considerations

1. **Blog posts loaded once** on page load via async
2. **Fuse.js instance created once** and reused
3. **Debouncing** can be added if needed for slower devices
4. **Results limited** to most relevant matches (Fuse.js handles this)

## Mobile Responsive
- Full-screen modal on mobile
- Scrollable results container
- Touch-friendly filter buttons
- Larger tap targets

## Browser Compatibility
- Modern browsers (ES6+)
- Requires Fuse.js CDN
- No external dependencies beyond Fuse.js
