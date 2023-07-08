import { hash, hmac }     from './hash.js'
import { Bech32 }         from './encode/bech32.js'
import { Base58C }        from './encode/base58.js'
import { Base64, B64URL } from './encode/base64.js'
import * as fmt           from './format/index.js'
import * as util          from './utils.js'

import {
  Bytes,
  Json,
  HashTypes,
  HmacTypes,
  Endian
} from './types.js'

export class Buff extends Uint8Array {
  static num    = numToBuff
  static big    = bigToBuff
  static bin    = binToBuff
  static raw    = rawToBuff
  static str    = strToBuff
  static hex    = hexToBuff
  static bytes  = bytesToBuff
  static json   = jsonToBuff
  static base64 = base64ToBuff
  static b64url = b64urlToBuff
  static bech32 = bech32ToBuff
  static b58chk = b58chkToBuff
  static encode = fmt.strToBytes
  static decode = fmt.bytesToStr

  static random (size = 32) : Buff {
    const rand = util.random(size)
    return new Buff(rand, size)
  }

  constructor (
    data   : Bytes | ArrayBufferLike,
    size  ?: number
  ) {
    let bytes = fmt.buffer(data)
    if (typeof size === 'number') {
      bytes = util.pad_array(bytes, size)
    }
    super(bytes)
  }

  get arr () : number[] {
    return [ ...this ]
  }

  get num () : number {
    return this.toNum()
  }

  get big () : bigint {
    return this.toBig()
  }

  get str () : string {
    return this.toStr()
  }

  get hex () : string {
    return this.toHex()
  }

  get raw () : Uint8Array {
    return new Uint8Array(this)
  }

  get bin () : string {
    return this.toBin()
  }

  get b58chk () : string {
    return this.tob58chk()
  }

  get base64 () : string {
    return this.toBase64()
  }

  get b64url () : string {
    return this.toB64url()
  }

  get digest () : Buff {
    return this.toHash()
  }

  get id () : string {
    return this.toHash().hex
  }

  get stream () : Stream {
    return new Stream(this)
  }

  toNum (endian : Endian = 'be') : number {
    const bytes = (endian === 'be')
      ? this.reverse()
      : this
    return fmt.bytesToNum(bytes)
  }

  toBin () : string {
    return fmt.bytesToBin(this)
  }

  toBig (endian : Endian = 'be') : bigint {
    const bytes = (endian === 'be')
      ? this.reverse()
      : this
    return fmt.bytesToBig(bytes)
  }

  toHash (type ?: HashTypes) : Buff {
    const digest = hash(this, type)
    return new Buff(digest)
  }

  toHmac (key : Bytes, type : HmacTypes) : Buff {
    const digest = hmac(key, this, type)
    return new Buff(digest)
  }

  toJson () : Json {
    const str = fmt.bytesToStr(this)
    return JSON.parse(str)
  }

  toBech32 (hrp : string, version = 0) : string {
    return Bech32.encode(this, hrp, version)
  }

  toStr    () : string     { return fmt.bytesToStr(this)    }
  toHex    () : string     { return fmt.bytesToHex(this)    }
  toBytes  () : Uint8Array { return new Uint8Array(this)    }
  tob58chk () : string     { return Base58C.encode(this)    }
  toBase64 () : string     { return Base64.encode(this)     }
  toB64url () : string     { return B64URL.encode(this)     }

  prepend (data : Bytes) : Buff {
    return Buff.join([ Buff.bytes(data), this ])
  }

  append (data : Bytes) : Buff {
    return Buff.join([ this, Buff.bytes(data) ])
  }

  slice (start ?: number, end ?: number) : Buff {
    const arr = new Uint8Array(this).slice(start, end)
    return new Buff(arr)
  }

  subarray (begin ?: number, end ?: number) : Buff {
    const arr = new Uint8Array(this).subarray(begin, end)
    return new Buff(arr)
  }

  reverse () : Buff {
    const arr = new Uint8Array(this).reverse()
    return new Buff(arr)
  }

  write (bytes : Bytes, offset ?: number) : void {
    const b = Buff.bytes(bytes)
    this.set(b, offset)
  }

  prefixSize (endian ?: Endian) : Buff {
    const size = Buff.varInt(this.length, endian)
    return Buff.join([ size, this ])
  }

  static from (data : Uint8Array | number[]) : Buff {
    return new Buff(Uint8Array.from(data))
  }

  static of (...args : number[]) : Buff {
    return new Buff(Uint8Array.of(...args))
  }

  static join (arr : Bytes[]) : Buff {
    const bytes  = arr.map(e => Buff.bytes(e))
    const joined = util.join_array(bytes)
    return new Buff(joined)
  }

  static varInt (num : number, endian ?: Endian) : Buff {
    if (num < 0xFD) {
      return Buff.num(num, 1)
    } else if (num < 0x10000) {
      return Buff.of(0xFD, ...Buff.num(num, 2, endian))
    } else if (num < 0x100000000) {
      return Buff.of(0xFE, ...Buff.num(num, 4, endian))
    } else if (BigInt(num) < 0x10000000000000000n) {
      return Buff.of(0xFF, ...Buff.num(num, 8, endian))
    } else {
      throw new Error(`Value is too large: ${num}`)
    }
  }
}

function numToBuff (
  number : number,
  size  ?: number,
  endian : Endian = 'be'
) : Buff {
  let n = fmt.numToBytes(number)
  if (endian === 'be') n = n.reverse()
  return new Buff(n, size)
}

function binToBuff (
  data : string,
  size ?: number
) : Buff {
  return new Buff(fmt.binToBytes(data), size)
}

function bigToBuff (
    number : bigint,
    size  ?: number,
    endian : Endian = 'be'
  ) : Buff {
    let b = fmt.bigToBytes(number)
    if (endian === 'be') b = b.reverse()
    return new Buff(b, size)
  }

function rawToBuff (
  data  : Uint8Array,
  size ?: number
) : Buff {
  return new Buff(data, size)
}

function strToBuff (
  data  : string,
  size ?: number
) : Buff {
  return new Buff(fmt.strToBytes(data), size)
}

function hexToBuff (
  data  : string,
  size ?: number
) : Buff {
  return new Buff(fmt.hexToBytes(data), size)
}

function bytesToBuff (
  data  : Bytes,
  size ?: number
) : Buff {
  return new Buff(data, size)
}

function jsonToBuff (
  data : Json
) : Buff {
  return new Buff(fmt.jsonToBytes(data))
}

function base64ToBuff (
  data : string
) : Buff {
  return new Buff(Base64.decode(data))
}

function b64urlToBuff (
  data : string
) : Buff {
  return new Buff(B64URL.decode(data))
}

function bech32ToBuff (
  data : string
) : Buff {
  return new Buff(Bech32.decode(data))
}

function b58chkToBuff (
  data : string
) : Buff {
  return new Buff(Base58C.decode(data))
}

export class Stream {
  public size : number
  public data : Uint8Array

  constructor (data : Bytes) {
    this.data = Buff.bytes(data)
    this.size = this.data.length
  }

  peek (size : number) : Buff {
    if (size > this.size) {
      throw new Error(`Size greater than stream: ${size} > ${this.size}`)
    }
    return new Buff(this.data.slice(0, size))
  }

  read (size : number) : Buff {
    size = size ?? this.readSize()
    const chunk = this.peek(size)
    this.data = this.data.slice(size)
    this.size = this.data.length
    return chunk
  }

  readSize (endian ?: Endian) : number {
    const num = this.read(1).num
    switch (true) {
      case (num >= 0 && num < 0xFD):
        return num
      case (num === 0xFD):
        return this.read(2).toNum(endian)
      case (num === 0xFE):
        return this.read(4).toNum(endian)
      case (num === 0xFF):
        return this.read(8).toNum(endian)
      default:
        throw new Error(`Varint is out of range: ${num}`)
    }
  }
}
