# OSCP (Offensive Security Certified Professional) - Plan 2026

## Journey to OSCP

I'm currently on my journey to earn the Offensive Security Certified Professional (OSCP) certification, planning to take the exam in 2026. This page documents my preparation roadmap, labs, notes, and progress.

## Why OSCP?

The OSCP is one of the most respected hands-on penetration testing certifications in the industry. Unlike traditional multiple-choice exams, OSCP requires:

- **24-hour practical exam**: Compromise multiple machines in a controlled environment
- **Hands-on skills**: No theoretical knowledge alone - you must demonstrate actual exploitation skills
- **Detailed reporting**: Professional penetration testing report required

## Certification Overview

- **Certification**: Offensive Security Certified Professional
- **Provider**: Offensive Security (OffSec)
- **Exam Format**: 24-hour practical exam + 24-hour report submission
- **Target Date**: Q3 2026
- **Current Status**: Preparation Phase

## My Preparation Roadmap

### Phase 1: Foundation (Current - Month 6)

**Goal**: Build strong fundamentals in networking, Linux, and Windows.

- [ ] Complete Linux fundamentals
- [ ] Master networking concepts (TCP/IP, subnetting, routing)
- [ ] Learn Windows internals and Active Directory basics
- [ ] Practice basic bash and PowerShell scripting
- [ ] Complete TryHackMe Pre-Security path

**Resources**:
- OverTheWire: Bandit, Natas
- TryHackMe: Complete Beginner path
- HackTheBox: Starting Point

### Phase 2: Core Skills (Month 7-12)

**Goal**: Develop core penetration testing skills.

- [ ] Complete PWK (PEN-200) course material
- [ ] Master enumeration techniques
- [ ] Learn common exploitation techniques
- [ ] Understand privilege escalation (Linux & Windows)
- [ ] Practice buffer overflow attacks
- [ ] Study web application vulnerabilities (OWASP Top 10)

**Resources**:
- OffSec PEN-200 course
- TryHackMe: Offensive Pentesting path
- HackTheBox: Easy and Medium boxes

### Phase 3: Practice Labs (Month 13-18)

**Goal**: Build muscle memory through repetition.

- [ ] Root 40+ HackTheBox machines (mix of Linux/Windows)
- [ ] Complete Proving Grounds Practice (30+ boxes)
- [ ] Practice Active Directory attacks
- [ ] Join and participate in CTF competitions
- [ ] Create detailed write-ups for each machine

**Resources**:
- HackTheBox VIP subscription
- OffSec Proving Grounds
- VulnHub machines
- CTF platforms (PicoCTF, HackThisSite)

### Phase 4: Exam Preparation (Month 19-24)

**Goal**: Exam-specific preparation and speed building.

- [ ] Complete all PWK lab machines
- [ ] Practice in exam-like conditions (timed sessions)
- [ ] Refine note-taking and documentation process
- [ ] Practice report writing
- [ ] Complete Proving Grounds Play (exam-like machines)
- [ ] Mock exams with time constraints

**Resources**:
- OffSec Proving Grounds
- TJNull's OSCP-like boxes list
- Report templates and examples

## Key Skills to Master

### 1. Enumeration

Enumeration is critical - "Try Harder" starts with thorough enumeration.

- Port scanning (nmap, masscan)
- Service enumeration
- Web directory brute-forcing
- SMB enumeration
- DNS enumeration

### 2. Exploitation

- Web vulnerabilities (SQLi, XSS, LFI/RFI, upload bypass)
- Buffer overflow (stack-based)
- Exploit modification
- Public exploit research (searchsploit, ExploitDB)

### 3. Privilege Escalation

- Linux: SUID binaries, kernel exploits, cron jobs, sudo misconfigs
- Windows: Token impersonation, unquoted service paths, weak permissions, kernel exploits

### 4. Active Directory

- Initial foothold in AD environment
- Lateral movement
- Kerberoasting, AS-REP roasting
- Pass-the-hash, pass-the-ticket
- Domain privilege escalation

### 5. Report Writing

- Executive summary
- Technical findings with evidence
- Remediation recommendations
- Professional formatting

## Tools to Master

### Reconnaissance & Enumeration
- nmap
- gobuster / ffuf / dirbuster
- enum4linux
- nikto
- Burp Suite

### Exploitation
- Metasploit Framework (limited use in exam)
- searchsploit
- msfvenom
- nc (netcat)
- Custom exploit scripts

### Post-Exploitation
- linpeas / winpeas
- LinEnum / WinEnum
- PowerView (AD enumeration)
- Mimikatz (Windows credential dumping)
- BloodHound (AD attack paths)

### Other Essential Tools
- Kali Linux (exam VM)
- tmux / screen (terminal multiplexing)
- CherryTree / Obsidian (note-taking)
- VS Code (script development)

## Progress Tracker

### Completed
- ✅ Decided to pursue OSCP
- ✅ Created study roadmap
- ✅ Set up home lab environment
- ✅ Started TryHackMe beginner path

### In Progress
- 🔄 Completing Linux fundamentals
- 🔄 Practicing with OverTheWire challenges
- 🔄 Building custom penetration testing scripts

### Upcoming
- ⏳ Enroll in PEN-200 course (planned Q1 2025)
- ⏳ HackTheBox VIP subscription
- ⏳ Start Active Directory practice

## Lab Setup

### Home Lab Environment

```
Hypervisor: VirtualBox / VMware
Attacker: Kali Linux 2024.x
Targets:
  - Metasploitable 2/3
  - Windows 10/11 (intentionally vulnerable)
  - Active Directory lab (2-3 machines)
  - Custom web applications (DVWA, OWASP Juice Shop)
```

### Cloud Labs
- TryHackMe subscription
- HackTheBox VIP (planned)
- Proving Grounds Practice (planned with PEN-200)

## Study Schedule

### Weekly Commitment: 20-25 hours

- **Weekdays** (Mon-Fri): 2-3 hours/day
  - Theory and course material
  - Short practice sessions

- **Weekends** (Sat-Sun): 5-6 hours/day
  - Extended lab sessions
  - Machine walkthroughs
  - Write-ups and documentation

## Resources

### Official OffSec
- [PEN-200 Course](https://www.offsec.com/courses/pen-200/)
- [OSCP Certification](https://www.offsec.com/courses/oscp/)
- [Proving Grounds](https://www.offsec.com/labs/)

### Practice Platforms
- [HackTheBox](https://www.hackthebox.com/)
- [TryHackMe](https://tryhackme.com/)
- [VulnHub](https://www.vulnhub.com/)
- [OverTheWire](https://overthewire.org/)

### Community
- [NetSecFocus OSCP Discord](https://discord.gg/netsecfocus)
- [r/oscp subreddit](https://reddit.com/r/oscp)
- [OffSec Discord](https://discord.gg/offsec)

### Recommended Reading
- "The Hacker Playbook" series by Peter Kim
- "Penetration Testing" by Georgia Weidman
- "RTFM: Red Team Field Manual" by Ben Clark

## Tips from the Community

1. **Enumerate, enumerate, enumerate** - Most students fail because they miss something in enumeration
2. **Take detailed notes** - Your notes will be crucial during the exam
3. **Document everything** - Screenshots, commands, outputs
4. **Practice report writing** - The report is part of the exam
5. **Time management** - Practice in timed conditions
6. **Know when to move on** - Don't get stuck on one machine
7. **Try Harder™** - But also know when to take a break
8. **Understand, don't just copy** - Know why exploits work
9. **Build your methodology** - Have a repeatable process
10. **Stay healthy** - Sleep well before the exam

## My Commitment

This is a challenging certification that requires dedication and persistence. I'm committed to:

- Consistent daily practice
- Thorough documentation
- Learning from failures
- Building a strong foundation
- Engaging with the community
- Sharing my journey through write-ups

## Updates

I'll regularly update this page with:
- Lab write-ups
- Study notes
- Tools and scripts developed
- Milestones achieved
- Lessons learned

---

*Started: December 2024*
*Target Exam Date: Q3 2026*
*Last Updated: December 2024*

**Try Harder!** 💪🔓
