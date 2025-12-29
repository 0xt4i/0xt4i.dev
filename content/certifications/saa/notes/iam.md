# IAM (Identity and Access Management)

## Overview

IAM allows you to manage access to AWS services and resources securely.

## Core Components

### Users

- Represents a person or service
- Permanent credentials (password, access keys)
- Should follow principle of least privilege
- Max 5,000 users per account

### Groups

- Collection of users
- Users inherit permissions from groups
- Cannot be nested (no groups within groups)
- A user can be in multiple groups

### Roles

- Temporary credentials for entities (users, services, applications)
- No permanent credentials
- Can be assumed by AWS services (EC2, Lambda, etc.)
- Can enable cross-account access

#### Common Role Use Cases

1. **EC2 Instance Role**: Allow EC2 to access S3, DynamoDB
2. **Lambda Execution Role**: Permissions for Lambda function
3. **Cross-Account Role**: Access resources in another AWS account

### Policies

JSON documents that define permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

#### Policy Types

1. **Managed Policies**
   - AWS Managed: Created and maintained by AWS
   - Customer Managed: Created by you, reusable

2. **Inline Policies**: Embedded directly in user, group, or role

#### Policy Elements

- **Effect**: Allow or Deny
- **Action**: What actions are allowed/denied
- **Resource**: Which resources the policy applies to
- **Condition**: When the policy is in effect (optional)

## Best Practices

### 1. Enable MFA for Root Account

```bash
# Root account should:
- Have MFA enabled
- Not be used for daily tasks
- Have strong password
- Have access keys deleted
```

### 2. Principle of Least Privilege

Grant only the permissions needed to perform a task.

### 3. Use Roles Instead of Users

For AWS services and applications, use roles (temporary credentials) instead of users (permanent credentials).

### 4. Rotate Credentials Regularly

- Change passwords periodically
- Rotate access keys
- Use IAM credential reports to audit

### 5. Use Policy Conditions

Add conditions for extra security:

```json
{
  "Condition": {
    "IpAddress": {
      "aws:SourceIp": "203.0.113.0/24"
    },
    "DateGreaterThan": {
      "aws:CurrentTime": "2024-01-01T00:00:00Z"
    }
  }
}
```

## Permission Boundaries

- Set maximum permissions a user/role can have
- Prevent privilege escalation
- Useful in delegated administration scenarios

## Service Control Policies (SCPs)

- Part of AWS Organizations
- Define maximum permissions for accounts in organization
- Do not grant permissions, only limit them
- Apply to all users and roles, including root

## IAM Identity Center (SSO)

- Centrally manage SSO access to AWS accounts
- Integration with external identity providers (Azure AD, Okta)
- SAML 2.0 based authentication

## Security Tools

### IAM Credentials Report

- Account-level report
- Lists all users and status of credentials
- Helps with compliance audits

### IAM Access Advisor

- User-level report
- Shows services accessed and last access time
- Helps reduce permissions (least privilege)

## Policy Evaluation Logic

When evaluating permissions, AWS follows this logic:

1. **Default**: Deny everything
2. **Explicit Allow**: Check if any policy allows
3. **Explicit Deny**: Check if any policy denies (deny always wins)
4. **Final Decision**: Allow only if allowed and not denied

### Evaluation Order

```
1. Deny evaluation (SCP, Permission Boundary, Session Policy, Identity-based)
2. Organizations SCPs
3. Resource-based policies
4. IAM permission boundaries
5. Session policies
6. Identity-based policies
```

## Common Exam Scenarios

### Scenario 1: EC2 Access to S3

**Question**: How to allow EC2 instance to access S3 bucket?

**Answer**:
1. Create IAM role with S3 permissions
2. Attach role to EC2 instance
3. Use AWS SDK/CLI from EC2 (credentials automatic)

### Scenario 2: Cross-Account Access

**Question**: How to allow users from Account A to access resources in Account B?

**Answer**:
1. In Account B: Create role with trust policy for Account A
2. In Account B: Attach permissions to access resources
3. In Account A: Give users permission to assume the role

### Scenario 3: Multi-Factor Authentication

**Question**: How to require MFA for sensitive operations?

**Answer**: Use policy condition:

```json
{
  "Condition": {
    "Bool": {
      "aws:MultiFactorAuthPresent": "true"
    }
  }
}
```

## IAM Best Practices Checklist

- [ ] Root account MFA enabled
- [ ] Root access keys deleted
- [ ] Individual users created (no sharing)
- [ ] Groups used for permissions
- [ ] Least privilege applied
- [ ] Roles used for applications
- [ ] Credentials rotated regularly
- [ ] MFA enabled for privileged users
- [ ] Policy conditions used where appropriate
- [ ] Regular access reviews conducted

## Common Policy Examples

### S3 Read-Only Access

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-bucket",
        "arn:aws:s3:::my-bucket/*"
      ]
    }
  ]
}
```

### EC2 Start/Stop Only

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:StartInstances",
        "ec2:StopInstances",
        "ec2:DescribeInstances"
      ],
      "Resource": "*"
    }
  ]
}
```

## Exam Tips

1. **Roles are for AWS services and applications**, not for people
2. **Groups cannot be nested**
3. **Explicit deny always wins** over allow
4. **Resource-based policies** can allow cross-account access
5. **IAM is global** (not region-specific)
6. **Root account** should not be used for daily tasks
7. **Permission boundaries** set maximum permissions
8. **Use IAM Access Analyzer** to identify resources shared with external entities

## Resources

- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [IAM Policy Reference](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html)
- [IAM Identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html)
