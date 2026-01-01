import { KeyManager, NoteSecrets } from "./keys.js";
import { CommitmentBuilder } from "./commitment_builder.js";
import { AssetId } from "../domain/constants.js";

/* ──────────────────────────────────────────────
   Note lifecycle states
────────────────────────────────────────────── */
export type NoteState =
  | "UNSPENT"
  | "PENDING_SPEND"
  | "SPENT";

/* ──────────────────────────────────────────────
   Metadata (immutable)
────────────────────────────────────────────── */
export interface NoteMetadata {
  readonly assetId: AssetId;
  readonly amount: bigint;
  readonly bucketAmount: bigint;
  readonly commitment: bigint;
  readonly createdAt: number;
  readonly state: NoteState;
  readonly nullifierHash?: bigint;
}

export interface Note {
  readonly secrets: NoteSecrets;
  readonly metadata: NoteMetadata;
}

/* ──────────────────────────────────────────────
   Note engine
────────────────────────────────────────────── */
export class NoteEngine {
  constructor(
    private readonly commitmentBuilder: CommitmentBuilder
  ) {}

  async createNote(
    assetId: AssetId,
    amount: bigint
  ): Promise<Note> {
    const secrets = KeyManager.generateSecrets();

    const { commitment, bucketAmount } =
      await this.commitmentBuilder.buildCommitment(
        secrets.secret,
        secrets.nullifier,
        assetId,
        amount
      );

    return Object.freeze({
      secrets,
      metadata: Object.freeze({
        assetId,
        amount,
        bucketAmount,
        commitment,
        createdAt: Date.now(),
        state: "UNSPENT"
      })
    });
  }

  async prepareForSpending(note: Note): Promise<Note> {
    if (note.metadata.state !== "UNSPENT") {
      throw new Error("Note not spendable");
    }

    const nullifierHash =
      await this.commitmentBuilder.calculateNullifierHash(
        note.secrets.nullifier,
        note.secrets.secret
      );

    return Object.freeze({
      secrets: note.secrets,
      metadata: Object.freeze({
        ...note.metadata,
        state: "PENDING_SPEND",
        nullifierHash
      })
    });
  }

  markSpent(note: Note): Note {
    if (note.metadata.state !== "PENDING_SPEND") {
      throw new Error("Invalid spend transition");
    }

    return Object.freeze({
      secrets: note.secrets,
      metadata: Object.freeze({
        ...note.metadata,
        state: "SPENT"
      })
    });
  }
}
