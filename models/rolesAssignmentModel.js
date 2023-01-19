module.exports = (sequelize, Sequelize, DataTypes) => {
    const RoleAssignment = sequelize.define('RoleAssignment', {
        roleAssignmentId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        status: {
            type: DataTypes.STRING(10),
            defaultValue: 'Active'
        }
    }, {
        tableName: 'RoleAssignments',
        createdAt: 'createdDate',
        updatedAt: 'lastModifiedDate'
    });

    RoleAssignment.associate = function(models) {
        RoleAssignment.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: {
                name: 'createdById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        RoleAssignment.belongsTo(models.User, {
            as: 'lastModifiedBy',
            foreignKey: {
                name: 'lastModifiedById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        RoleAssignment.belongsTo(models.Role, {
            as: 'role',
            foreignKey: {
                name: 'roleId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });

        RoleAssignment.belongsTo(models.User, {
            as: 'user',
            foreignKey: {
                name: 'userId',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        // RoleAssignment.belongsTo(models.Candidate, {
        //     as: 'candidate',
        //     foreignKey: {
        //         name: 'candidateId',
        //         type: DataTypes.UUID,
        //         defaultValue: null
        //     }
        // });
    };

    return RoleAssignment;
};