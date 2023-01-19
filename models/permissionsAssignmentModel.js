module.exports = (sequelize, Sequelize, DataTypes) => {
    const PermissionAssignment = sequelize.define('PermissionAssignment', {
        permissionAssignmentId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        status: {
            type: DataTypes.STRING(10),
            defaultValue: 'Active'
        }
    }, {
        tableName: 'PermissionAssignments',
        createdAt: 'createdDate',
        updatedAt: 'lastModifiedDate'
    });

    PermissionAssignment.associate = function(models) {
        PermissionAssignment.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: {
                name: 'createdById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        PermissionAssignment.belongsTo(models.User, {
            as: 'lastModifiedBy',
            foreignKey: {
                name: 'lastModifiedById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        PermissionAssignment.belongsTo(models.Role, {
            as: 'role',
            foreignKey: {
                name: 'roleId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });

        PermissionAssignment.belongsTo(models.Permission, {
            as: 'permission',
            foreignKey: {
                name: 'permissionId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });
    };

    return PermissionAssignment;
};