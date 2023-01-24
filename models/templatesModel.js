module.exports = (sequelize, Sequelize, DataTypes) => {
    const Template = sequelize.define('Template', {
        templateId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        templateType: {
            type: DataTypes.STRING(20),
            defaultValue: null
        },
        sentTo: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        subject: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        body: {
            type: DataTypes.TEXT,
            defaultValue: null
        },
        duration: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        status: {
            type: DataTypes.STRING(10),
            defaultValue: 'Active'
        }
    }, {
        tableName: 'templates',
        createdAt: 'createdDate',
        updatedAt: 'lastModifiedDate',
        timestamps: true
    });

    Template.associate = function(models) {
        Template.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: {
                name: 'createdById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        Template.belongsTo(models.User, {
            as: 'lastModifiedBy',
            foreignKey: {
                name: 'lastModifiedById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        Template.belongsTo(models.Role, {
            as: 'role',
            foreignKey: {
                name: 'roleId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });

        Template.belongsTo(models.MetaData, {
            as: 'candidateStatus',
            foreignKey: {
                name: 'candidateStatusId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });
    };

    return Template;
};