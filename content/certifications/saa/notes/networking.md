# AWS Networking

## VPC (Virtual Private Cloud)

A VPC is a logically isolated network within AWS where you can launch resources.

### Key Concepts

- **CIDR Block**: Define IP range for your VPC (e.g., 10.0.0.0/16)
- **Subnets**: Divide VPC into smaller networks
  - Public subnets: Have route to Internet Gateway
  - Private subnets: No direct internet access
- **Availability Zones**: Distribute subnets across AZs for high availability

### VPC Components

#### Internet Gateway (IGW)
- Allows communication between VPC and the internet
- Horizontally scaled, redundant, and highly available
- One IGW per VPC

#### NAT Gateway
- Allows private subnet instances to access the internet
- Managed by AWS (high availability in single AZ)
- Must be in a public subnet

#### NAT Instance
- EC2 instance configured as NAT
- You manage it (updates, scaling, etc.)
- Can use as bastion host
- Less expensive but requires more management

### Route Tables

Route tables control traffic routing within VPC:

```
Destination         Target
10.0.0.0/16        local
0.0.0.0/0          igw-xxxxx
```

- **Main route table**: Default for all subnets
- **Custom route tables**: Associate with specific subnets

### Best Practices

1. **Use multiple AZs** for high availability
2. **Separate public and private subnets**
3. **Use VPC Flow Logs** for monitoring
4. **Implement least privilege** with security groups and NACLs
5. **Plan CIDR blocks** carefully (avoid overlaps with on-premises)

## Security Groups vs NACLs

### Security Groups

- **Stateful**: Return traffic automatically allowed
- Operate at **instance level**
- Support **allow rules only**
- Evaluate all rules before deciding
- Default: Deny all inbound, allow all outbound

### Network ACLs (NACLs)

- **Stateless**: Must explicitly allow return traffic
- Operate at **subnet level**
- Support both **allow and deny rules**
- Process rules in order (lowest number first)
- Default: Allow all inbound and outbound

### Comparison Table

| Feature | Security Group | NACL |
|---------|---------------|------|
| State | Stateful | Stateless |
| Level | Instance | Subnet |
| Rules | Allow only | Allow & Deny |
| Processing | All rules | Ordered |
| Default | Deny inbound | Allow all |

## VPC Peering

Connect two VPCs to route traffic using private IP addresses:

- VPCs can be in different regions (inter-region peering)
- No transitive peering (A-B, B-C doesn't mean A-C)
- No overlapping CIDR blocks
- Update route tables in both VPCs

## VPN & Direct Connect

### Site-to-Site VPN

- Encrypted connection over the internet
- Virtual Private Gateway (VGW) on AWS side
- Customer Gateway on customer side
- Quick to set up, but dependent on internet quality

### Direct Connect

- Dedicated network connection to AWS
- More consistent network performance
- Lower bandwidth costs at scale
- Takes weeks to set up
- Use with VPN for encrypted connection

## CloudFront

AWS's CDN (Content Delivery Network):

- **Edge Locations**: Cache content closer to users
- **Origin**: S3 bucket, EC2, ELB, or custom origin
- **Distribution**: Configuration for how content is delivered
- **Benefits**: Lower latency, DDoS protection, SSL/TLS

### Use Cases

- Static website hosting
- Video streaming
- API acceleration
- Software distribution

## Route 53

AWS's DNS service with advanced routing capabilities:

### Routing Policies

1. **Simple**: Single resource
2. **Weighted**: Distribute traffic by percentage
3. **Latency**: Route to lowest latency endpoint
4. **Failover**: Active-passive failover
5. **Geolocation**: Route based on user location
6. **Geoproximity**: Route based on resource location
7. **Multi-value answer**: Return multiple IPs (simple load balancing)

### Health Checks

- Monitor endpoint health
- Automatic failover if unhealthy
- Can integrate with CloudWatch alarms

## Exam Tips

1. **VPC CIDR** cannot be changed after creation
2. **One IGW per VPC** rule
3. **NAT Gateway** is highly available in single AZ - use multiple for HA
4. **Security groups are stateful**, NACLs are stateless
5. **VPC Peering is not transitive**
6. **Ephemeral ports** (1024-65535) must be allowed in NACLs for return traffic
7. **Direct Connect** takes time to provision (weeks)

## Common Patterns

### Multi-Tier Architecture

```
Internet
   |
   v
Internet Gateway
   |
   v
Public Subnet (Web Tier)
   |
   v
Private Subnet (App Tier)
   |
   v
Private Subnet (DB Tier)
```

### Hybrid Cloud

```
On-Premises <--VPN/DX--> VGW <--> VPC <--> AWS Services
```

## Resources

- [VPC User Guide](https://docs.aws.amazon.com/vpc/)
- [VPC Peering Guide](https://docs.aws.amazon.com/vpc/latest/peering/)
- [AWS Networking Basics](https://aws.amazon.com/getting-started/hands-on/networking-basics/)
