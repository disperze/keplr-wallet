import { Message } from "@keplr-wallet/router";
import { cosmos } from "@keplr-wallet/cosmos";
import { ChainInfo, KeplrSignOptions, Key } from "@keplr-wallet/types";
import { AminoSignResponse, StdSignature, StdSignDoc } from "@cosmjs/launchpad";

export class EnableAccessMsg extends Message<void> {
  public static type() {
    return "enable-access";
  }

  constructor(public readonly chainIds: string[]) {
    super();
  }

  validateBasic(): void {
    if (!this.chainIds || this.chainIds.length === 0) {
      throw new Error("chain id not set");
    }
  }

  route(): string {
    return "permission";
  }

  type(): string {
    return EnableAccessMsg.type();
  }
}

export class GetKeyMsg extends Message<Key> {
  public static type() {
    return "get-key";
  }

  constructor(public readonly chainId: string) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }
  }

  route(): string {
    return "keyring";
  }

  type(): string {
    return GetKeyMsg.type();
  }
}

export class SuggestChainInfoMsg extends Message<void> {
  public static type() {
    return "suggest-chain-info";
  }

  constructor(public readonly chainInfo: ChainInfo) {
    super();
  }

  validateBasic(): void {
    if (!this.chainInfo) {
      throw new Error("chain info not set");
    }
  }

  route(): string {
    return "chains";
  }

  type(): string {
    return SuggestChainInfoMsg.type();
  }
}

export class SuggestTokenMsg extends Message<void> {
  public static type() {
    return "suggest-token";
  }

  constructor(
    public readonly chainId: string,
    public readonly contractAddress: string,
    public readonly viewingKey?: string
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("Chain id is empty");
    }

    if (!this.contractAddress) {
      throw new Error("Contract address is empty");
    }
  }

  route(): string {
    return "tokens";
  }

  type(): string {
    return SuggestTokenMsg.type();
  }
}

// Return the tx hash
export class SendTxMsg extends Message<Uint8Array> {
  public static type() {
    return "send-tx-to-background";
  }

  constructor(
    public readonly chainId: string,
    public readonly tx: unknown,
    public readonly mode: "async" | "sync" | "block"
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id is empty");
    }

    if (!this.tx) {
      throw new Error("tx is empty");
    }

    if (
      !this.mode ||
      (this.mode !== "sync" && this.mode !== "async" && this.mode !== "block")
    ) {
      throw new Error("invalid mode");
    }
  }

  route(): string {
    return "background-tx";
  }

  type(): string {
    return SendTxMsg.type();
  }
}

export class GetSecret20ViewingKey extends Message<string> {
  public static type() {
    return "get-secret20-viewing-key";
  }

  constructor(
    public readonly chainId: string,
    public readonly contractAddress: string
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("Chain id is empty");
    }

    if (!this.contractAddress) {
      throw new Error("Contract address is empty");
    }
  }

  route(): string {
    return "tokens";
  }

  type(): string {
    return GetSecret20ViewingKey.type();
  }
}

export class RequestSignAminoMsg extends Message<AminoSignResponse> {
  public static type() {
    return "request-sign-amino";
  }

  constructor(
    public readonly chainId: string,
    public readonly signer: string,
    public readonly signDoc: StdSignDoc,
    public readonly signOptions: KeplrSignOptions = {}
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }

    if (!this.signer) {
      throw new Error("signer not set");
    }

    // It is not important to check this on the client side as opposed to increasing the bundle size.
    // Validate bech32 address.
    // Bech32Address.validate(this.signer);

    if (this.signDoc.chain_id !== this.chainId) {
      throw new Error(
        "Chain id in the message is not matched with the requested chain id"
      );
    }

    if (!this.signOptions) {
      throw new Error("Sign options are null");
    }
  }

  route(): string {
    return "keyring";
  }

  type(): string {
    return RequestSignAminoMsg.type();
  }
}

export class RequestSignDirectMsg extends Message<{
  // Bytes of the sign doc
  readonly signedBytes: Uint8Array;
  readonly signature: StdSignature;
}> {
  public static type() {
    return "request-sign-direct";
  }

  constructor(
    public readonly chainId: string,
    public readonly signer: string,
    public readonly signDocBytes: Uint8Array,
    public readonly signOptions: KeplrSignOptions = {}
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }

    if (!this.signer) {
      throw new Error("signer not set");
    }

    // It is not important to check this on the client side as opposed to increasing the bundle size.
    // Validate bech32 address.
    // Bech32Address.validate(this.signer);

    const signDoc = cosmos.tx.v1beta1.SignDoc.decode(this.signDocBytes);

    if (signDoc.chainId !== this.chainId) {
      throw new Error(
        "Chain id in the message is not matched with the requested chain id"
      );
    }

    if (!this.signOptions) {
      throw new Error("Sign options are null");
    }
  }

  route(): string {
    return "keyring";
  }

  type(): string {
    return RequestSignDirectMsg.type();
  }
}

export class GetPubkeyMsg extends Message<Uint8Array> {
  public static type() {
    return "get-pubkey-msg";
  }

  constructor(public readonly chainId: string) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }
  }

  route(): string {
    return "secret-wasm";
  }

  type(): string {
    return GetPubkeyMsg.type();
  }
}

export class ReqeustEncryptMsg extends Message<Uint8Array> {
  public static type() {
    return "request-encrypt-msg";
  }

  constructor(
    public readonly chainId: string,
    public readonly contractCodeHash: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    public readonly msg: object
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }

    if (!this.contractCodeHash) {
      throw new Error("contract code hash not set");
    }

    if (!this.msg) {
      throw new Error("msg not set");
    }
  }

  route(): string {
    return "secret-wasm";
  }

  type(): string {
    return ReqeustEncryptMsg.type();
  }
}

export class RequestDecryptMsg extends Message<Uint8Array> {
  public static type() {
    return "request-decrypt-msg";
  }

  constructor(
    public readonly chainId: string,
    public readonly cipherText: Uint8Array,
    public readonly nonce: Uint8Array
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }

    if (!this.cipherText || this.cipherText.length === 0) {
      throw new Error("ciphertext not set");
    }

    if (!this.nonce || this.nonce.length === 0) {
      throw new Error("nonce not set");
    }
  }

  route(): string {
    return "secret-wasm";
  }

  type(): string {
    return RequestDecryptMsg.type();
  }
}

export class GetTxEncryptionKeyMsg extends Message<Uint8Array> {
  public static type() {
    return "get-tx-encryption-key-msg";
  }

  constructor(
    public readonly chainId: string,
    public readonly nonce: Uint8Array
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }

    if (!this.nonce) {
      // Nonce of zero length is permitted.
      throw new Error("nonce is null");
    }
  }

  route(): string {
    return "secret-wasm";
  }

  type(): string {
    return GetTxEncryptionKeyMsg.type();
  }
}