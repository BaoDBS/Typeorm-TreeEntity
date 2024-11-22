import {
  Entity,
  Tree,
  Column,
  PrimaryGeneratedColumn,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('closure-table')
export class Building {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  buildingName: string;

  @Column({ nullable: true })
  locationName: string;

  @Column({ nullable: true })
  locationNumber: string;

  @Column({ nullable: true })
  area: string;

  @TreeChildren()
  children: Building[];

  @TreeParent()
  parent: Building;
}
