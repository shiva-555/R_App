module.exports = (sequelize, Sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        roleId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        roleName: {
            type: DataTypes.STRING(50),
            defaultValue: null
        },
        candidatesView: {
            type: DataTypes.JSON,
            defaultValue: null
        },
        jobsView: {
            type: DataTypes.JSON,
            defaultValue: null
        },
        status: {
            type: DataTypes.STRING(10),
            defaultValue: 'Active'
        }
    }, {
        tableName: 'Roles',
        createdAt: 'createdDate',
        updatedAt: 'lastModifiedDate',
        indexes: [
            {
                fields: ['roleName', 'status']
            }
        ]
    });

    Role.associate = function(models) {
        Role.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: {
                name: 'createdById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        Role.belongsTo(models.User, {
            as: 'lastModifiedBy',
            foreignKey: {
                name: 'lastModifiedById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        Role.belongsTo(models.OrganizationTeam, {
            as: 'organizationTeam',
            foreignKey: {
                name: 'organizationTeamId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });

        Role.hasMany(models.PermissionAssignment, {
            as: 'permissionAssignments',
            foreignKey: {
                name: 'roleId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });

        //! not sure
        Role.hasMany(models.RoleAssignment, {
            as: 'roleAssignment',
            foreignKey: {
                name: 'roleAssignmentId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });
    };

    return Role;
};