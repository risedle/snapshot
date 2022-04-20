import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from "typeorm";

@Entity()
export class RiseTokenSnapshot {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    timestamp: Date;

    @Column()
    address: string;

    @Column({ type: "float" })
    cps: number;

    @Column({ type: "float" })
    dps: number;

    @Column({ type: "float" })
    lr: number;

    @Column({ type: "float" })
    nav: number;

    @Column({ type: "float" })
    totalSupply: number;

    @Column({ type: "float" })
    totalCollateral: number;

    @Column({ type: "float" })
    totalDebt: number;

    @Column({ type: "int", nullable: true })
    blockNumber: number;
}
