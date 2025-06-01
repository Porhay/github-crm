import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateRepositoriesTable1710000000001 implements MigrationInterface {
    name = 'CreateRepositoriesTable1710000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "repositories",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "owner",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "name",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "url",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "stars",
                        type: "int",
                        default: 0,
                        isNullable: false
                    },
                    {
                        name: "forks",
                        type: "int",
                        default: 0,
                        isNullable: false
                    },
                    {
                        name: "open_issues",
                        type: "int",
                        default: 0,
                        isNullable: false
                    },
                    {
                        name: "github_created_at",
                        type: "timestamp",
                        isNullable: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false
                    },
                    {
                        name: "user_id",
                        type: "uuid",
                        isNullable: true
                    }
                ]
            }),
            true
        );

        await queryRunner.createIndex(
            "repositories",
            new TableIndex({
                name: "IDX_REPOSITORIES_USER",
                columnNames: ["user_id"]
            })
        );

        await queryRunner.createForeignKey(
            "repositories",
            new TableForeignKey({
                name: "FK_REPOSITORIES_USER",
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("repositories");
        const foreignKey = table?.foreignKeys.find(fk => fk.name === "FK_REPOSITORIES_USER");
        if (foreignKey) {
            await queryRunner.dropForeignKey("repositories", foreignKey);
        }
        await queryRunner.dropIndex("repositories", "IDX_REPOSITORIES_USER");
        await queryRunner.dropTable("repositories");
    }
} 