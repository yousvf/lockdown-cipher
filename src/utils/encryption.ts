export type Algorithm = 'playfair' | 'railfence' | 'monoalphabetic' | 'polyalphabetic' | 'hill' | 'otp' | 'caesar' | 'rowcolumn';

export interface EncryptionResult {
  result: string;
  key?: string;
  metadata?: any;
}

// PLAYFAIR CIPHER
export function createPlayfairMatrix(key: string): string[][] {
  key = key.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  const seen = new Set<string>();
  const matrix: string[][] = [];
  let letters = '';

  // add key letters first
  for (const ch of key) {
    if (!seen.has(ch)) {
      letters += ch;
      seen.add(ch);
    }
  }

  // add remaining letters A-Z (skip J)
  for (let i = 0; i < 26; i++) {
    const ch = String.fromCharCode(65 + i);
    if (ch === 'J') continue;
    if (!seen.has(ch)) {
      letters += ch;
      seen.add(ch);
    }
  }

  // build 5x5 matrix
  for (let r = 0; r < 5; r++) {
    matrix.push(letters.slice(r * 5, r * 5 + 5).split(''));
  }
  return matrix;
}

// Preprocess text into digraphs (handle repeated letters and odd length)
function preprocessPlayfairText(text: string): string {
  text = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  let result = '';
  let i = 0;

  while (i < text.length) {
    const char1 = text[i];
    let char2 = text[i + 1] || 'X';

    if (char1 === char2) {
      char2 = 'X';
      i++; // only advance by 1
    } else {
      i += 2; // advance past both letters
    }

    result += char1 + char2;
  }

  if (result.length % 2 !== 0) result += 'X';
  return result;
}

export function playfairEncrypt(text: string, key: string = 'KEY'): EncryptionResult {
  const matrix = createPlayfairMatrix(key);
  text = preprocessPlayfairText(text);

  let result = '';

  for (let i = 0; i < text.length; i += 2) {
    const char1 = text[i];
    const char2 = text[i + 1];

    let row1 = -1, col1 = -1, row2 = -1, col2 = -1;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (matrix[r][c] === char1) { row1 = r; col1 = c; }
        if (matrix[r][c] === char2) { row2 = r; col2 = c; }
      }
    }

    if (row1 === row2) {
      result += matrix[row1][(col1 + 1) % 5] + matrix[row2][(col2 + 1) % 5];
    } else if (col1 === col2) {
      result += matrix[(row1 + 1) % 5][col1] + matrix[(row2 + 1) % 5][col2];
    } else {
      result += matrix[row1][col2] + matrix[row2][col1];
    }
  }

  return { result, key };
}

export function playfairDecrypt(text: string, key: string = 'KEY'): EncryptionResult {
  const matrix = createPlayfairMatrix(key);

  // Make sure we mirror encrypt preprocessing: map J -> I and strip non-letters
  text = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');

  // If ciphertext is odd-length, make it even (prevents undefined char access)
  if (text.length % 2 !== 0) text += 'X';

  // Build fast lookup map: letter -> [row, col]
  const pos = new Map<string, [number, number]>();
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      pos.set(matrix[r][c], [r, c]);
    }
  }

  // Defensive: ensure every letter in text exists in the matrix (should, after J->I)
  for (const ch of text) {
    if (!pos.has(ch)) {
      // Return a friendly, non-crashing message so UI won't die
      return { result: `Invalid character in ciphertext: '${ch}'. Playfair matrix uses I instead of J.`, key };
    }
  }

  let result = '';

  for (let i = 0; i < text.length; i += 2) {
    const char1 = text[i];
    const char2 = text[i + 1];

    // We already ensured both are present in pos
    const [row1, col1] = pos.get(char1)!;
    const [row2, col2] = pos.get(char2)!;

    if (row1 === row2) {
      // same row: move left
      result += matrix[row1][(col1 - 1 + 5) % 5] + matrix[row2][(col2 - 1 + 5) % 5];
    } else if (col1 === col2) {
      // same column: move up
      result += matrix[(row1 - 1 + 5) % 5][col1] + matrix[(row2 - 1 + 5) % 5][col2];
    } else {
      // rectangle swap
      result += matrix[row1][col2] + matrix[row2][col1];
    }
  }

  // optional: remove trailing padding X (if it was added)
  if (result.endsWith('X')) result = result.slice(0, -1);

  return { result, key };
}

// RAIL FENCE CIPHER
export function railFenceEncrypt(text: string, rails: number = 3): EncryptionResult {
  if (rails < 2) rails = 2;
  text = text.toUpperCase().replace(/[^A-Z]/g, '');

  const fence: string[][] = Array(rails).fill(null).map(() => []);
  let rail = 0;
  let direction = 1;

  for (const char of text) {
    fence[rail].push(char);
    if (rail === 0) direction = 1;
    else if (rail === rails - 1) direction = -1;
    rail += direction;
  }

  const result = fence.flat().join('');
  return { result, key: rails.toString() };
}

export function railFenceDecrypt(text: string, rails: number = 3): EncryptionResult {
  if (rails < 2) rails = 2;
  text = text.toUpperCase().replace(/[^A-Z]/g, '');

  const len = text.length;
  if (len === 0) return { result: '', key: rails.toString() };

  const pattern: number[] = new Array(len);
  let rail = 0;
  let dir = 1;
  for (let i = 0; i < len; i++) {
    pattern[i] = rail;
    if (rail === 0) dir = 1;
    else if (rail === rails - 1) dir = -1;
    rail += dir;
  }

  const counts = Array(rails).fill(0);
  for (let i = 0; i < len; i++) counts[pattern[i]]++;

  const fence: string[][] = Array.from({ length: rails }, () => []);
  let idx = 0;
  for (let r = 0; r < rails; r++) {
    for (let k = 0; k < counts[r]; k++) {
      fence[r].push(text[idx++]);
    }
  }

  const pos = Array(rails).fill(0);
  let result = '';
  for (let i = 0; i < len; i++) {
    const r = pattern[i];
    result += fence[r][pos[r]++];
  }

  return { result, key: rails.toString() };
}

// MONOALPHABETIC CIPHER
export function monoalphabeticEncrypt(text: string, key: string = 'QWERTYUIOPASDFGHJKLZXCVBNM'): EncryptionResult {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  key = key.toUpperCase().replace(/[^A-Z]/g, '');

  let result = '';
  for (const char of text) {
    const idx = alphabet.indexOf(char);
    result += idx >= 0 ? key[idx] : char;
  }
  return { result, key };
}

export function monoalphabeticDecrypt(text: string, key: string = 'QWERTYUIOPASDFGHJKLZXCVBNM'): EncryptionResult {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  key = key.toUpperCase().replace(/[^A-Z]/g, '');

  let result = '';
  for (const char of text) {
    const idx = key.indexOf(char);
    result += idx >= 0 ? alphabet[idx] : char;
  }
  return { result, key };
}

// POLYALPHABETIC CIPHER
export function polyalphabeticEncrypt(text: string, key: string = 'KEY'): EncryptionResult {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  key = key.toUpperCase().replace(/[^A-Z]/g, '');

  let result = '';
  let keyIdx = 0;
  for (const char of text) {
    const charIdx = alphabet.indexOf(char);
    const keyShift = alphabet.indexOf(key[keyIdx % key.length]);
    result += alphabet[(charIdx + keyShift) % 26];
    keyIdx++;
  }
  return { result, key };
}

export function polyalphabeticDecrypt(text: string, key: string = 'KEY'): EncryptionResult {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  key = key.toUpperCase().replace(/[^A-Z]/g, '');

  let result = '';
  let keyIdx = 0;
  for (const char of text) {
    const charIdx = alphabet.indexOf(char);
    const keyShift = alphabet.indexOf(key[keyIdx % key.length]);
    result += alphabet[(charIdx - keyShift + 26) % 26];
    keyIdx++;
  }
  return { result, key };
}

// HILL CIPHER (simplified 2x2)
export function hillEncrypt(text: string, keyMatrix: number[][] = [[6, 24], [1, 8]]): EncryptionResult {
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  if (text.length % 2 !== 0) text += 'X';

  let result = '';
  for (let i = 0; i < text.length; i += 2) {
    const x = text.charCodeAt(i) - 65;
    const y = text.charCodeAt(i + 1) - 65;

    const encX = (keyMatrix[0][0] * x + keyMatrix[0][1] * y) % 26;
    const encY = (keyMatrix[1][0] * x + keyMatrix[1][1] * y) % 26;

    result += String.fromCharCode(encX + 65) + String.fromCharCode(encY + 65);
  }
  return { result, key: JSON.stringify(keyMatrix) };
}

const mod26 = (n: number) => ((n % 26) + 26) % 26;

export function hillDecrypt(text: string, keyMatrix: number[][] = [[6, 24], [1, 8]]): EncryptionResult {
  text = text.toUpperCase().replace(/[^A-Z]/g, '');

  const det = ((keyMatrix[0][0] * keyMatrix[1][1] - keyMatrix[0][1] * keyMatrix[1][0]) % 26 + 26) % 26;
  const detInv = modInverse(det, 26);

  const invMatrix = [
    [mod26(keyMatrix[1][1] * detInv), mod26(-keyMatrix[0][1] * detInv)],
    [mod26(-keyMatrix[1][0] * detInv), mod26(keyMatrix[0][0] * detInv)]
  ];

  return hillEncrypt(text, invMatrix);
}

function modInverse(a: number, m: number): number {
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  return 1;
}

// ONE-TIME PAD CIPHER
export function otpEncrypt(text: string): EncryptionResult {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  text = text.toUpperCase().replace(/[^A-Z]/g, '');

  const key = Array(text.length).fill(0).map(() =>
    alphabet[Math.floor(Math.random() * 26)]
  ).join('');

  let result = '';
  for (let i = 0; i < text.length; i++) {
    const textIdx = alphabet.indexOf(text[i]);
    const keyIdx = alphabet.indexOf(key[i]);
    result += alphabet[(textIdx + keyIdx) % 26];
  }

  return { result, key };
}

export function otpDecrypt(text: string, key: string): EncryptionResult {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  key = key.toUpperCase().replace(/[^A-Z]/g, '');

  let result = '';
  for (let i = 0; i < text.length; i++) {
    const textIdx = alphabet.indexOf(text[i]);
    const keyIdx = alphabet.indexOf(key[i % key.length]);
    result += alphabet[(textIdx - keyIdx + 26) % 26];
  }

  return { result, key };
}

// CAESAR CIPHER
export function caesarEncrypt(text: string, shift: number = 3): EncryptionResult {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  text = text.toUpperCase().replace(/[^A-Z]/g, '');

  let result = '';
  for (let i = 0; i < text.length; i++) {
    const textIdx = alphabet.indexOf(text[i]);
    result += alphabet[(textIdx + shift) % 26];
  }

  return { result, key: shift.toString() };
}

export function caesarDecrypt(text: string, shift: number = 3): EncryptionResult {
  return caesarEncrypt(text, 26 - shift);
}

function isValidPermutation(perm: number[]): boolean {
  if (perm.length === 0) return false;
  const sorted = [...perm].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] !== i + 1) return false;
  }
  return true;
}

function parsePermutation(keyStr: string): number[] | null {
  const nums = keyStr.trim().split(/[\s,]+/).map(n => parseInt(n)).filter(n => !isNaN(n));
  if (isValidPermutation(nums)) return nums;
  return null;
}

// ROW COLUMN TRANSPOSITION
export function rowColumnEncrypt(text: string, key: string = '1 2 3 4 5 6'): EncryptionResult {
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  const perm = parsePermutation(key);

  if (!perm) {
    return { result: 'Invalid permutation. Use numbers 1 to n separated by spaces or commas.', key: '' };
  }

  const cols = perm.length;
  const rows = Math.ceil(text.length / cols);

  while (text.length < rows * cols) text += 'X';

  const matrix: string[][] = [];
  for (let i = 0; i < rows; i++) {
    matrix[i] = text.substring(i * cols, (i + 1) * cols).split('');
  }

  let result = '';
  for (let i = 0; i < cols; i++) {
    const colIdx = perm.indexOf(i + 1);
    for (let row = 0; row < rows; row++) {
      result += matrix[row][colIdx];
    }
  }

  return { result, key };
}

export function rowColumnDecrypt(text: string, key: string = '1 2 3 4 5 6'): EncryptionResult {
  const perm = parsePermutation(key);

  if (!perm) {
    return { result: 'Invalid permutation. Use numbers 1 to n separated by spaces or commas.', key: '' };
  }

  const cols = perm.length;
  const rows = Math.ceil(text.length / cols);
  
  const matrix: string[][] = Array(rows).fill(null).map(() => Array(cols).fill(''));
  let idx = 0;

  for (let i = 0; i < cols; i++) {
    const colIdx = perm.indexOf(i + 1);
    for (let row = 0; row < rows; row++) {
      if (idx < text.length) {
        matrix[row][colIdx] = text[idx++];
      }
    }
  }

  let result = '';
  for (let row = 0; row < rows; row++) {
    result += matrix[row].join('');
  }

  return { result, key };
}

export const algorithmInfo: Record<Algorithm, { name: string; description: string; needsKey: boolean }> = {
  playfair: {
    name: 'Playfair Cipher',
    description: '5x5 grid substitution using keyword',
    needsKey: true
  },
  railfence: {
    name: 'Rail Fence Cipher',
    description: 'Zigzag transposition cipher',
    needsKey: true
  },
  monoalphabetic: {
    name: 'Monoalphabetic Cipher',
    description: 'Single substitution mapping',
    needsKey: true
  },
  polyalphabetic: {
    name: 'Polyalphabetic Cipher',
    description: 'Multiple substitution mappings',
    needsKey: true
  },
  hill: {
    name: 'Hill Cipher',
    description: 'Matrix-based encryption',
    needsKey: false
  },
  otp: {
    name: 'One-Time Pad',
    description: 'Theoretically unbreakable cipher',
    needsKey: false
  },
  caesar: {
    name: 'Caesar Cipher',
    description: 'Letter shifting substitution',
    needsKey: true
  },
  rowcolumn: {
    name: 'Row Column Transposition',
    description: 'Column-based rearrangement',
    needsKey: true
  }
};

export function encrypt(algorithm: Algorithm, text: string, key?: string): EncryptionResult {
  switch (algorithm) {
    case 'playfair':
      return playfairEncrypt(text, key || 'KEY');
    case 'railfence':
      return railFenceEncrypt(text, key ? parseInt(key) : 3);
    case 'monoalphabetic':
      return monoalphabeticEncrypt(text, key || 'QWERTYUIOPASDFGHJKLZXCVBNM');
    case 'polyalphabetic':
      return polyalphabeticEncrypt(text, key || 'KEY');
    case 'hill':
      return hillEncrypt(text);
    case 'otp':
      return otpEncrypt(text);
    case 'caesar':
      return caesarEncrypt(text, key ? parseInt(key) : 3);
    case 'rowcolumn':
      return rowColumnEncrypt(text, key || 'CIPHER');
    default:
      return { result: text };
  }
}

export function decrypt(algorithm: Algorithm, text: string, key?: string): EncryptionResult {
  switch (algorithm) {
    case 'playfair':
      return playfairDecrypt(text, key || 'KEY');
    case 'railfence':
      return railFenceDecrypt(text, key ? parseInt(key) : 3);
    case 'monoalphabetic':
      return monoalphabeticDecrypt(text, key || 'QWERTYUIOPASDFGHJKLZXCVBNM');
    case 'polyalphabetic':
      return polyalphabeticDecrypt(text, key || 'KEY');
    case 'hill':
      return hillDecrypt(text);
    case 'otp':
      return otpDecrypt(text, key || '');
    case 'caesar':
      return caesarDecrypt(text, key ? parseInt(key) : 3);
    case 'rowcolumn':
      return rowColumnDecrypt(text, key || 'CIPHER');
    default:
      return { result: text };
  }
}
