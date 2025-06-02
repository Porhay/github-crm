import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateRefreshTokensTable1710000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "refresh_tokens",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "token",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "expires_at",
                        type: "timestamp",
                        isNullable: false
                    },
                    {
                        name: "user_id",
                        type: "uuid",
                        isNullable: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false
                    }
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            "refresh_tokens",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("refresh_tokens");
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("user_id") !== -1);
        await queryRunner.dropForeignKey("refresh_tokens", foreignKey);
        await queryRunner.dropTable("refresh_tokens");
    }
} 