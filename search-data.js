// Search data index for all portfolio content
const searchData = {
    projects: [
        {
            id: 'project-1',
            type: 'project',
            title: 'LocalStack CI/CD Pipeline',
            description: 'Complete CI/CD infrastructure using LocalStack, Terraform, and Ansible for local AWS development and testing. Includes automated deployment workflows.',
            tags: ['LocalStack', 'Terraform', 'Ansible', 'Docker', 'CI/CD', 'AWS'],
            category: 'DevOps',
            link: '#projects'
        },
        {
            id: 'project-2',
            type: 'project',
            title: 'Kubernetes Security Scanner',
            description: 'Automated security scanning tool for Kubernetes clusters. Detects misconfigurations, vulnerabilities, and compliance issues with detailed reporting.',
            tags: ['Kubernetes', 'Python', 'Security', 'K8s'],
            category: 'Security',
            link: '#projects'
        },
        {
            id: 'project-3',
            type: 'project',
            title: 'Infrastructure Automation Framework',
            description: 'Multi-cloud infrastructure automation framework using Terraform modules and Ansible playbooks for consistent deployments across AWS, Azure, and GCP.',
            tags: ['Terraform', 'Ansible', 'Multi-Cloud', 'AWS', 'Azure', 'GCP'],
            category: 'DevOps',
            link: '#projects'
        },
        {
            id: 'project-4',
            type: 'project',
            title: 'Penetration Testing Toolkit',
            description: 'Custom penetration testing toolkit with automated reconnaissance, vulnerability scanning, and exploitation modules. Built for ethical hacking engagements.',
            tags: ['Python', 'Security', 'Pentesting', 'Ethical Hacking'],
            category: 'Security',
            link: '#projects'
        },
        {
            id: 'project-5',
            type: 'project',
            title: 'Monitoring & Observability Stack',
            description: 'Complete monitoring solution with Prometheus, Grafana, and ELK stack. Custom dashboards for infrastructure metrics, logs, and application performance.',
            tags: ['Prometheus', 'Grafana', 'ELK', 'Monitoring', 'Observability'],
            category: 'DevOps',
            link: '#projects'
        },
        {
            id: 'project-6',
            type: 'project',
            title: 'GitOps Deployment Pipeline',
            description: 'GitOps-based deployment pipeline using ArgoCD and Flux. Automated deployments with Git as the single source of truth for declarative infrastructure.',
            tags: ['GitOps', 'ArgoCD', 'Kubernetes', 'Flux', 'CI/CD'],
            category: 'DevOps',
            link: '#projects'
        }
    ],
    handsOn: [
        {
            id: 'lab-localstack',
            type: 'hands-on',
            title: 'Building LocalStack CI/CD Pipeline from Scratch',
            description: 'Complete walkthrough of setting up a production-grade CI/CD pipeline using LocalStack, Terraform, and Ansible. Includes infrastructure as code, automated testing, and deployment strategies.',
            tags: ['DevOps', 'CI/CD', 'LocalStack', 'Terraform', 'Ansible'],
            category: 'DevOps',
            readTime: '15 min read',
            link: '#hands-on'
        },
        {
            id: 'lab-k8s-security',
            type: 'hands-on',
            title: 'Kubernetes Security Hardening Lab',
            description: 'Step-by-step guide to hardening Kubernetes clusters. Covers RBAC, Network Policies, Pod Security Standards, and runtime security scanning.',
            tags: ['Security', 'Kubernetes', 'RBAC', 'DevSecOps'],
            category: 'Security',
            readTime: '20 min read',
            link: '#hands-on'
        },
        {
            id: 'lab-web-pentesting',
            type: 'hands-on',
            title: 'Web Application Pentesting Lab',
            description: 'Comprehensive web application penetration testing tutorial. Covers reconnaissance, vulnerability discovery, and exploitation of common web vulnerabilities.',
            tags: ['Security', 'Web', 'Pentesting', 'OWASP'],
            category: 'Security',
            readTime: '25 min read',
            link: '#hands-on'
        }
    ],
    blog: [] // Will be loaded dynamically from blog-index.json
};

// Flatten all content into a single searchable array
function getAllSearchableContent() {
    return [
        ...searchData.projects,
        ...searchData.handsOn,
        ...searchData.blog
    ];
}

// Load blog posts from blog-index.json
async function loadBlogPostsForSearch() {
    try {
        const response = await fetch('blog/blog-index.json');
        const posts = await response.json();

        searchData.blog = posts.map(post => ({
            id: post.id,
            type: 'blog',
            title: post.title,
            description: post.excerpt,
            tags: post.tags,
            category: post.category,
            readTime: post.readTime,
            link: `portfolio.html#blog-${post.folder}`
        }));
    } catch (error) {
        console.error('Error loading blog posts for search:', error);
    }
}

// Group search results by type
function groupResultsByType(results) {
    const grouped = {
        projects: [],
        handsOn: [],
        blog: []
    };

    results.forEach(result => {
        const item = result.item || result;
        if (item.type === 'project') {
            grouped.projects.push(item);
        } else if (item.type === 'hands-on') {
            grouped.handsOn.push(item);
        } else if (item.type === 'blog') {
            grouped.blog.push(item);
        }
    });

    return grouped;
}
