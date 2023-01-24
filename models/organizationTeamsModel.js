module.exports = (sequelize, Sequelize, DataTypes) => {
    const OrganizationTeam = sequelize.define('OrganizationTeam', {
        organizationTeamId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        organizationTeamName: {
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
        tableName: 'organizationteams',
        createdAt: 'createdDate',
        updatedAt: 'lastModifiedDate',
        indexes: [
            {
                fields: ['organizationTeamName', 'status']
            }
        ]
    });

    OrganizationTeam.associate = function(models) {
        OrganizationTeam.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: {
                name: 'createdById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        OrganizationTeam.belongsTo(models.User, {
            as: 'lastModifiedBy',
            foreignKey: {
                name: 'lastModifiedById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        OrganizationTeam.hasMany(models.Role, {
            as: 'roles',
            foreignKey: {
                name: 'organizationTeamId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });
    };

    return OrganizationTeam;
};