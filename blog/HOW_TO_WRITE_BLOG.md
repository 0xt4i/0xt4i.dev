# How to Write Blog Posts

Your portfolio now supports writing blog posts in Markdown! Here's how to add new posts:

## Quick Start

### 1. Create a new folder for your blog post

```bash
cd blog/
mkdir my-awesome-post
```

### 2. Write your blog post in README.md

```bash
cd my-awesome-post/
nano README.md
```

Write your content using Markdown syntax:

```markdown
# My Awesome Blog Post Title

![Banner Image](https://via.placeholder.com/1200x400/7C3AED/FFFFFF?text=My+Post)

## Introduction

Your introduction here...

## Main Content

### Subheading

Your content with:
- Bullet points
- **Bold text**
- *Italic text*
- `inline code`

### Code Examples

\`\`\`bash
# Your code here
kubectl get pods
terraform apply
\`\`\`

## Conclusion

Your conclusion here...
```

### 3. Add metadata to blog-index.json

Edit `blog/blog-index.json` and add your post:

```json
{
  "id": "my-awesome-post",
  "title": "My Awesome Blog Post Title",
  "slug": "my-awesome-post",
  "date": "2024-12-29",
  "category": "DevOps",
  "tags": ["Docker", "Kubernetes", "CI/CD"],
  "excerpt": "A brief description of your post (2-3 sentences)",
  "readTime": "10 min read",
  "author": "Tai Huu Nguyen",
  "folder": "my-awesome-post"
}
```

**Optional: Add to a Series**

To organize related posts into a series, add the `series` field:

```json
{
  "id": "my-awesome-post",
  "title": "My Awesome Blog Post Title",
  "slug": "my-awesome-post",
  "date": "2024-12-29",
  "category": "DevOps",
  "tags": ["Docker", "Kubernetes", "CI/CD"],
  "excerpt": "A brief description of your post (2-3 sentences)",
  "readTime": "10 min read",
  "author": "Tai Huu Nguyen",
  "folder": "my-awesome-post",
  "series": {
    "name": "Kubernetes Mastery",
    "part": 1,
    "total": 3
  }
}
```

### 4. Test your post

Open `portfolio.html` in your browser and click on your new blog post!

## Markdown Styling

Your blog automatically styles markdown with the cyberpunk theme:

- **Headings** (H1-H6) - Purple/cyan colors with glow effects
- **Code blocks** - Dark background with syntax highlighting
- **Inline code** - Cyan highlighted text
- **Links** - Cyan with hover effects
- **Blockquotes** - Purple left border
- **Lists** - Properly spaced and indented
- **Tables** - Bordered with dark theme
- **Images** - Rounded corners, full width

## Example Structures

### Tutorial/Guide Structure

```markdown
# Tutorial Title

## Prerequisites
- Thing 1
- Thing 2

## Step 1: Setup
Instructions...

## Step 2: Implementation
Code and explanation...

## Conclusion
Summary and next steps...
```

### Project Showcase Structure

```markdown
# Project Name

## Overview
What the project does...

## Architecture
Diagram and explanation...

## Features
- Feature 1
- Feature 2

## Installation
Step-by-step guide...

## Usage
How to use it...

## Source Code
Link to GitHub...
```

### Security/Technical Post Structure

```markdown
# Vulnerability/Topic Name

⚠️ **DISCLAIMER**: For educational purposes only.

## Introduction
Background and context...

## The Vulnerability
What it is and why it matters...

## Exploitation
How it works (with examples)...

## Mitigation
How to fix/prevent it...

## Conclusion
Key takeaways...
```

## Best Practices

1. **Use descriptive titles** - Clear, specific, SEO-friendly
2. **Add images** - Use placeholder or real screenshots
3. **Include code examples** - Make it hands-on
4. **Structure with headings** - H2 for main sections, H3 for subsections
5. **Keep excerpts short** - 2-3 sentences max
6. **Choose appropriate category** - DevOps or Security
7. **Tag relevant topics** - Helps with organization
8. **Estimate read time** - 200 words per minute average

## Categories

- **DevOps** - CI/CD, Infrastructure, Automation, Cloud
- **Security** - Pentesting, Vulnerabilities, Best Practices

## File Organization

```
blog/
├── blog-index.json           # Metadata for all posts
├── HOW_TO_WRITE_BLOG.md     # This guide
├── localstack-cicd/
│   └── README.md
├── kubernetes-security/
│   └── README.md
├── terraform-ansible/
│   └── README.md
└── web-pentesting/
    └── README.md
```

## Series Organization

### What is a Series?

A series is a collection of related blog posts that should be read in order. For example:
- **Infrastructure Automation Series**: LocalStack CI/CD → Terraform & Ansible
- **Security Deep Dive Series**: Kubernetes Security → Web Pentesting

### How Series Work

When you add a post to a series:
1. **Series badge** appears on the blog card showing "Series Name • Part X/Y"
2. **Series navigation** shows all posts in the series when reading
3. **Prev/Next buttons** allow easy navigation between parts
4. **"You are here"** indicator shows current position

### Creating a Series

1. **Choose a series name** - Keep it concise (e.g., "Infrastructure Automation", "Security Deep Dive")
2. **Plan your parts** - Decide how many posts will be in the series
3. **Add series metadata** to each post:

```json
{
  "series": {
    "name": "Your Series Name",
    "part": 1,
    "total": 3
  }
}
```

4. **Maintain consistency** - All posts in the same series must have the exact same `name`

### Series Best Practices

- Start with Part 1, not Part 0
- Keep series to 2-5 posts (longer series become overwhelming)
- Each post should be readable standalone, but reference others
- Use consistent naming across all posts in the series
- Update `total` if you add more parts later

## Advanced Tips

### Add Images

Save images in your blog folder and reference them:

```markdown
![Description](./image.png)
```

Or use external URLs:

```markdown
![Description](https://example.com/image.png)
```

### Code Syntax Highlighting

Use language specifiers for better formatting:

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

\`\`\`yaml
apiVersion: v1
kind: Pod
\`\`\`

### Callouts/Alerts

Use blockquotes for important notes:

```markdown
> **Pro Tip**: Always test in a development environment first!

> ⚠️ **Warning**: This can be dangerous in production.

> ✓ **Success**: Your cluster is now secure!
```

## Troubleshooting

**Blog post not showing?**
- Check `blog-index.json` syntax (use JSONLint)
- Ensure folder name matches `"folder"` value
- Check console for JavaScript errors

**Markdown not rendering?**
- Verify README.md exists in the folder
- Check file permissions
- Ensure marked.js is loaded (check console)

**Styling looks wrong?**
- Clear browser cache
- Check CSS classes are applied
- Inspect element to debug

---

Happy blogging! 🚀
