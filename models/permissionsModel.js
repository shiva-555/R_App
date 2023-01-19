module.exports = (sequelize, Sequelize, DataTypes) => {
    const Permission = sequelize.define('Permission', {
        permissionId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        permissionName: {
            type: DataTypes.STRING(50),
            defaultValue: null
        },
        status: {
            type: DataTypes.STRING(10),
            defaultValue: 'Active'
        }
    }, {
        tableName: 'Permissions',
        createdAt: 'createdDate',
        updatedAt: 'lastModifiedDate',
        indexes: [
            {
                fields: ['permissionName', 'status']
            }
        ]
    });

    Permission.associate = function(models) {
        Permission.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: {
                name: 'createdById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        Permission.belongsTo(models.User, {
            as: 'lastModifiedBy',
            foreignKey: {
                name: 'lastModifiedById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        Permission.hasMany(models.PermissionAssignment, {
            as: 'permissionAssignments',
            foreignKey: {
                name: 'permissionId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });
    };

    return Permission;
};