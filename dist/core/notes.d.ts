import { NoteSecrets } from './keys.js';
import { CommitmentBuilder } from './commitment_builder.js';
import { AssetId } from '../domain/constants.js';
export interface NoteMetadata {
    assetId: AssetId;
    amount: bigint;
    bucketAmount: bigint;
    timestamp: number;
    spent: boolean;
    commitment: bigint;
    nullifierHash?: bigint;
}
export interface Note {
    secrets: NoteSecrets;
    metadata: NoteMetadata;
}
export declare class NoteEngine {
    private commitmentBuilder;
    constructor(commitmentBuilder: CommitmentBuilder);
    /**
     * Create a complete note with commitment
     */
    createNote(assetId: AssetId, amount: bigint): Promise<Note>;
    /**
     * Prepare note for spending
     */
    prepareForSpending(note: Note): Promise<Note>;
}
//# sourceMappingURL=notes.d.ts.map