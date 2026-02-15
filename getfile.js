import protobuf from "https://esm.sh/protobufjs";

const getPublicKeys = async (buf) => {
    const view = new DataView(buf);
    if (buf.byteLength < 12) throw new Error("Buffer too small");
    if (view.getUint32(0, true) !== 0x34327243) throw new Error("Not a CRX3 file");

    const headerLen = view.getUint32(8, true);
    const headerBytes = new Uint8Array(buf.slice(12, 12 + headerLen));

    const root = protobuf.Root.fromJSON({
        nested: {
            P: { fields: { k: { type: "bytes", id: 1 } } },
            H: { fields: { r: { rule: "repeated", type: "P", id: 2 } } }
        }
    });

    const HType = root.lookupType("H");
    const message = HType.toObject(HType.decode(headerBytes), { bytes: Uint8Array });

    if (!message.r || !Array.isArray(message.r) || message.r.length === 0) {
        throw new Error("No proofs found in CRX3 header.");
    }

    // Return the array of all public keys found
    return message.r.map(proof => proof.k).filter(k => k && k.length > 0);
};

const crx3 = async (url) => {
    const idMatch = url.match(/([a-p]{32})/);
    if (!idMatch) throw new Error("Invalid ID");
    const id = idMatch[1];

    const googleUrl = `https://clients2.google.com/service/update2/crx?` + 
        `response=redirect&acceptformat=crx2,crx3&prodversion=131.0.0.0&` +
        `x=id%3D${id}%26uc`;
    const toFetch = `https://corsproxy.io/?url=${encodeURIComponent(googleUrl)}&key=🤣🤣🤣🤣`;
    const response = await fetch(toFetch);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    return [await response.arrayBuffer(), id];
}
const main = async (event) => {
    try {
        event.preventDefault();
        const result = document.querySelector("#result");
        const inputVal = document.querySelector("#input").value;
        const [buffer, originalId] = await crx3(inputVal);
        
        const keys = await getPublicKeys(buffer);
        console.info(`Found ${keys.length} proof(s). Checking hashes...`);

        let matched = false;

        for (let i = 0; i < keys.length; i++) {
            const binary = keys[i];
            const hashBuffer = await crypto.subtle.digest('SHA-256', binary);
            const hashArray = new Uint8Array(hashBuffer);

            // Map all 256 bits (64 nibbles) to a-p
            const quantumSafeId = Array.from(hashArray)
                .flatMap(byte => [(byte >> 4) & 0x0f, byte & 0x0f])
                .map(n => String.fromCharCode(n + 97))
                .join("");

            const standardId = quantumSafeId.substring(0, 32);

            if (standardId === originalId) {
                result.textContent = quantumSafeId;
                matched = true;
                break; 
            } else {
                console.log(`Mismatched Proof #${i}`, `Got: ${standardId}\nExp: ${originalId}\nFull: ${quantumSafeId}`);
            }
        }

        if (!matched) {
            result.textContent = "No keys in this CRX match the provided Extension ID. This usually happens with Store extensions where the Identity Key is not bundled in the CRX proofs.";
        }

    } catch (e) { result.textContent = e; }
};

document.querySelector("#form").addEventListener("submit", main);
