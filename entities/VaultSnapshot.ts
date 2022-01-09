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

    @Column({ type: "float" })
    totalAvailableCash: number;

    @Column({ type: "float" })
    utilizationRate: number;

    @Column({ type: "float" })
    totalOutstandingDebt: number;
}
