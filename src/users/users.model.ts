import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface UserCreationAttrs {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password_hash: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  banned: boolean;

  @Column({ type: DataType.STRING })
  ban_reason: string;

  @Column({ type: DataType.STRING })
  oauth_provider: string;

  @Column({ type: DataType.STRING })
  oauth_id: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'ADMIN' })
  role: string;
}
