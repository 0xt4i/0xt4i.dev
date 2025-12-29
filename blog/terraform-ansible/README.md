# Automating Infrastructure with Terraform & Ansible

![Terraform Ansible](https://via.placeholder.com/1200x400/7C3AED/FFFFFF?text=Terraform+%26+Ansible)

## The Perfect Combination

Terraform and Ansible complement each other perfectly:
- **Terraform**: Infrastructure provisioning (immutable)
- **Ansible**: Configuration management (mutable)

Together, they create a powerful automation workflow.

## Architecture

```
Terraform (Provision)     →    Ansible (Configure)
├─ VPC & Networking            ├─ Install packages
├─ EC2 Instances               ├─ Configure services
├─ Load Balancers              ├─ Deploy applications
└─ Database Clusters           └─ Security hardening
```

## Quick Example

**Terraform creates infrastructure:**

```hcl
resource "aws_instance" "web" {
  count         = 3
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.medium"

  tags = {
    Name = "web-${count.index}"
    Role = "web-server"
  }
}

output "web_ips" {
  value = aws_instance.web[*].public_ip
}
```

**Ansible configures servers:**

```yaml
- hosts: web_servers
  become: yes
  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: latest

    - name: Deploy application
      copy:
        src: app/
        dest: /var/www/html/
```

Stay tuned for the full walkthrough!
