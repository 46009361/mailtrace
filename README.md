# Quantum-Safe Extension IDs

Recently, I emailed the Chrome Web Store developer support team suggesting to lengthen the extension IDs. This is because Google blogged about the quantum computing era recently and they are working on updating their systems.

Currently, Manifest V3 Chrome extension IDs are calculated from the SHA-256 hash of either the DER-encoded binary of the public key the developer uses for signing or the local absolute filepath encoded as UTF-16 (SHA-1 in older "CRX# file" versions often matching the manifest v#). This hash is mapped from a hexadecimal string to lowercase a–p, but only the first 32 characters (128 bits) of the string are used.

The problem is that a computer can easily go through 4 294 967 296 combinations, the birthday paradox means any two IDs have a one-in-2<sup>64</sup> chance of randomly colliding, and quantum computers could easily find a collision in only 2<sup>32</sup> combinations (≈ 4.3 × 10<sup>9</sup>). (That's "billion" in short scale and "milliard" in long scale.) By mapping the full 256 bits of the SHA-256 hash to the 64 characters in my proposed longer extension IDs, the quantum computers would have a hard time going through an average of 18 446 744 073 709 551 616 combinations.

To ensure it's extra clear what I meant, I've created this minimal demo.

Paste the link of any public Chrome extension and you'll get what the longer ID will be! The rest of the ID is not random; it's the same every time, even on different devices.