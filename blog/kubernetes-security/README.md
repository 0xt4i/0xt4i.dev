# Kubernetes Security Best Practices for 2024

![K8s Security](https://via.placeholder.com/1200x400/06B6D4/FFFFFF?text=Kubernetes+Security)

## Introduction

Kubernetes has become the de facto standard for container orchestration, but with great power comes great responsibility. Securing a Kubernetes cluster requires a multi-layered approach covering everything from pod security to network policies.

In this guide, I'll share battle-tested security practices I've implemented in production environments.

## The Kubernetes Security Hierarchy

```
┌─────────────────────────────────────┐
│     Cluster Security Layers         │
├─────────────────────────────────────┤
│  1. API Server Authentication       │
│  2. RBAC Authorization              │
│  3. Admission Controllers           │
│  4. Pod Security Standards          │
│  5. Network Policies                │
│  6. Runtime Security                │
│  7. Supply Chain Security           │
└─────────────────────────────────────┘
```

## 1. RBAC: The Foundation

Role-Based Access Control is your first line of defense. Always follow the principle of least privilege.

### Example: Developer Role

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: development
  name: developer
rules:
- apiGroups: ["", "apps"]
  resources: ["pods", "deployments", "services"]
  verbs: ["get", "list", "watch", "create", "update"]
- apiGroups: [""]
  resources: ["pods/log"]
  verbs: ["get", "list"]
```

### Bind Role to User

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: developer-binding
  namespace: development
subjects:
- kind: User
  name: jane.doe@company.com
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: developer
  apiGroup: rbac.authorization.k8s.io
```

**Audit RBAC regularly:**

```bash
# Check who can do what
kubectl auth can-i --list --as jane.doe@company.com -n development

# Review all cluster role bindings
kubectl get clusterrolebindings -o wide
```

## 2. Pod Security Standards

Replace deprecated PodSecurityPolicy with Pod Security Standards (PSS).

### Apply Namespace-Level Security

```bash
# Restricted (most secure)
kubectl label namespace production \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/warn=restricted \
  pod-security.kubernetes.io/audit=restricted

# Baseline (middle ground)
kubectl label namespace staging \
  pod-security.kubernetes.io/enforce=baseline
```

### Secure Pod Specification

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-app
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
    seccompProfile:
      type: RuntimeDefault

  containers:
  - name: app
    image: myapp:1.0
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      runAsNonRoot: true
      capabilities:
        drop:
          - ALL
        add:
          - NET_BIND_SERVICE  # Only if needed

    resources:
      limits:
        memory: "512Mi"
        cpu: "500m"
      requests:
        memory: "256Mi"
        cpu: "250m"
```

## 3. Network Policies: Zero Trust

Implement network segmentation using NetworkPolicies.

### Default Deny All

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

### Allow Specific Traffic

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: frontend-to-backend
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
```

### Allow DNS

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: UDP
      port: 53
```

## 4. Secrets Management

Never store secrets in plain text!

### Use Sealed Secrets

```bash
# Install sealed-secrets controller
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Create sealed secret
echo -n 'supersecret' | kubectl create secret generic mysecret \
  --dry-run=client --from-file=password=/dev/stdin -o yaml | \
  kubeseal -o yaml > sealed-secret.yaml

# Apply sealed secret (safe to commit to git)
kubectl apply -f sealed-secret.yaml
```

### Use External Secrets Operator

```yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-secrets-manager
spec:
  provider:
    aws:
      service: SecretsManager
      region: us-east-1
      auth:
        jwt:
          serviceAccountRef:
            name: external-secrets
---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: database-credentials
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets-manager
    kind: SecretStore
  target:
    name: db-secret
  data:
  - secretKey: password
    remoteRef:
      key: prod/database/password
```

## 5. Runtime Security with Falco

Monitor suspicious activity in real-time.

### Install Falco

```bash
helm repo add falcosecurity https://falcosecurity.github.io/charts
helm install falco falcosecurity/falco \
  --namespace falco-system \
  --create-namespace \
  --set falcosidekick.enabled=true \
  --set falcosidekick.webui.enabled=true
```

### Custom Falco Rules

```yaml
# /etc/falco/rules.d/custom_rules.yaml
- rule: Unauthorized Process in Container
  desc: Detect unexpected process execution
  condition: >
    spawned_process and container and
    not proc.name in (node, npm, python, java)
  output: >
    Unexpected process started in container
    (user=%user.name command=%proc.cmdline container=%container.name)
  priority: WARNING

- rule: Write to Non-Temp Directory
  desc: Detect writes outside /tmp
  condition: >
    open_write and container and
    not fd.name startswith /tmp
  output: >
    File write to non-temp directory
    (file=%fd.name container=%container.name)
  priority: WARNING

- rule: Outbound Connection to Suspicious IP
  desc: Detect connections to known bad IPs
  condition: >
    outbound and container and
    fd.sip in (suspicious_ips)
  output: >
    Suspicious outbound connection detected
    (dest=%fd.sip container=%container.name)
  priority: CRITICAL
```

## 6. Supply Chain Security

Protect your container images.

### Image Scanning

```bash
# Scan with Trivy
trivy image myapp:1.0

# Integrate with CI/CD
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:latest image myapp:1.0 \
  --severity HIGH,CRITICAL \
  --exit-code 1
```

### Image Signing with Cosign

```bash
# Sign image
cosign sign --key cosign.key myregistry/myapp:1.0

# Verify image
cosign verify --key cosign.pub myregistry/myapp:1.0
```

### Admission Controller for Image Verification

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kyverno-policy
data:
  verify-images.yaml: |
    apiVersion: kyverno.io/v1
    kind: ClusterPolicy
    metadata:
      name: verify-images
    spec:
      validationFailureAction: enforce
      rules:
      - name: verify-signature
        match:
          any:
          - resources:
              kinds:
              - Pod
        verifyImages:
        - imageReferences:
          - "*"
          attestors:
          - entries:
            - keys:
                publicKeys: |-
                  -----BEGIN PUBLIC KEY-----
                  <your-public-key>
                  -----END PUBLIC KEY-----
```

## 7. Audit Logging

Enable and monitor API server audit logs.

```yaml
# /etc/kubernetes/audit-policy.yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: Metadata
  resources:
  - group: ""
    resources: ["secrets", "configmaps"]
- level: RequestResponse
  verbs: ["create", "update", "patch", "delete"]
- level: Metadata
  omitStages:
  - RequestReceived
```

## Security Checklist

Before going to production, verify:

- [ ] RBAC configured with least privilege
- [ ] Pod Security Standards enforced
- [ ] Network policies deny-all by default
- [ ] Secrets encrypted at rest (etcd encryption)
- [ ] TLS enabled for all cluster components
- [ ] Runtime security monitoring active (Falco)
- [ ] Image scanning integrated in CI/CD
- [ ] Regular security audits scheduled
- [ ] Backup & disaster recovery tested
- [ ] Security updates applied regularly

## Tools & Resources

**Security Scanning:**
- [Trivy](https://github.com/aquasecurity/trivy)
- [Grype](https://github.com/anchore/grype)
- [Snyk](https://snyk.io/)

**Policy Enforcement:**
- [Kyverno](https://kyverno.io/)
- [OPA Gatekeeper](https://open-policy-agent.github.io/gatekeeper/)

**Runtime Security:**
- [Falco](https://falco.org/)
- [Tetragon](https://tetragon.io/)

**Benchmarking:**
- [kube-bench](https://github.com/aquasecurity/kube-bench) - CIS Kubernetes Benchmark
- [kube-hunter](https://github.com/aquasecurity/kube-hunter) - Penetration testing

## Conclusion

Kubernetes security is not a one-time task—it's an ongoing process. Start with the basics (RBAC, PSS, Network Policies), then layer on advanced controls (runtime security, supply chain security).

Remember: **Security is everyone's responsibility!**

---

**Want to learn more?** Check out my [Kubernetes Security Workshop](https://github.com/0xT4I/k8s-security-workshop) on GitHub.
