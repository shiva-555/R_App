module.exports = (sequelize, Sequelize, DataTypes) => {
    const MetaData = sequelize.define('MetaData', {
        metaDataId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        metaDataType: {
            type: DataTypes.STRING(50),
            defaultValue: null
        },
        displayText: {
            type: DataTypes.JSON,
            defaultValue: null
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        status: {
            type: DataTypes.STRING(10),
            defaultValue: 'Active'
        }
    }, {
        tableName: 'MetaData',
        createdAt: 'createdDate',
        updatedAt: 'lastModifiedDate',
        timestamps: true,
        indexes: [
            {
                fields: ['metaDataType', 'status']
            },
            {
                fields: ['order']
            }
        ]
    });

    MetaData.associate = function(models) {
        MetaData.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: {
                name: 'createdById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        MetaData.belongsTo(models.User, {
            as: 'lastModifiedById',
            foreignKey: {
                name: 'lastModifiedBy',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });
    };

    return MetaData;
};