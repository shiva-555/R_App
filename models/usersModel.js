module.exports = (sequelize, Sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userId: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },
        displayName: {
            type: DataTypes.STRING(100),
            defaultValue: null
        },
        email: {
            type: DataTypes.STRING(100),
            defaultValue: null
        },
        mobile: {
            type: DataTypes.STRING(10),
            defaultValue: null
        },
        city: {
            type: DataTypes.STRING(10),
            defaultValue: null
        },
        status: {
            type: DataTypes.STRING(10),
            defaultValue: 'Active'
        }
    }, {
        tableName: 'Users',
        createdAt: 'createdDate',
        updatedAt: 'lastModifiedDate',
        indexes: [
            {
                fields: ['email', 'status']
            },
            {
                fields: ['mobile', 'status']
            },
            {
                fields: ['city', 'status']
            }
        ]
    });

    User.associate = function(models) {
        User.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: {
                name: 'createdById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        User.belongsTo(models.User, {
            as: 'lastModifiedBy',
            foreignKey: {
                name: 'lastModifiedById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        User.belongsTo(models.User, {
            as: 'parent',
            foreignKey: {
                name: 'parentId',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        User.hasMany(models.User, {
            as: 'childerens',
            foreignKey: {
                name: 'parentId',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        User.hasMany(models.Candidate, {
            as: 'createdCandidates',
            foreignKey: {
                name: 'createdById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        User.hasMany(models.Candidate, {
            as: 'modifiedCandidates',
            foreignKey: {
                name: 'lastModifiedById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        User.hasMany(models.JobAssignment, {
            as: 'jobAssignments',
            foreignKey: {
                name: 'userId',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        User.hasMany(models.RoleAssignment, {
            as: 'roleAssignments',
            foreignKey: {
                name: 'userId',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });
    };

    return User;
};