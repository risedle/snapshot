import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from "typeorm";

@Entity()
export class VaultSnapshot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    contractAddress: string;

    @CreateDateColumn()
    timestamp: Date;

    @Column({ type: "float" })
    borrowAPY: number;

    @Column({ type: "float" })
    supplyAPY: number;

    @Column({ type: "integer" })
    totalAvailableCash: number;

    @Column({ type: "float" })
    utilizationRate: number;

    @Column({ type: "integer" })
    totalOutstandingDebt: number;
}
