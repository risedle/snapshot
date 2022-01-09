import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from "typeorm";

@Entity()
export class LeveragedTokenSnapshot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    contractAddress: string;

    @CreateDateColumn()
    timestamp: Date;

    @Column({ type: "float" })
    collateralPerLeveragedToken: number;

    @Column({ type: "float" })
    debtPerLeveragedToken: number;

    @Column({ type: "float" })
    leverageRatio: number;

    @Column({ type: "float" })
    nav: number;
}
