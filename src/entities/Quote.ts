import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Quote {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    text: string;

    @Column()
    author: string;

    @Column("simple-array")
    tags: string[];

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;
} 