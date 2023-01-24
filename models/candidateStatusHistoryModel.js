module.exports = (sequelize, Sequelize, DataTypes) => {
    const CandidateStatusHistory = sequelize.define('CandidateStatusHistory', {
        candidateStatusHistoryId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        status: {
            type: DataTypes.STRING(10),
            defaultValue: 'Active'
        }
    }, {
        tableName: 'candidatestatushistory',
        createdAt: 'createdDate',
        updatedAt: 'lastModifiedDate',
        timestamps: true
    });

    CandidateStatusHistory.associate = function(models) {
        CandidateStatusHistory.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: {
                name: 'createdById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        CandidateStatusHistory.belongsTo(models.User, {
            as: 'lastModifiedBy',
            foreignKey: {
                name: 'lastModifiedById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        CandidateStatusHistory.belongsTo(models.MetaData, {
            as: 'candidateStatus',
            foreignKey: {
                name: 'candidateStatusId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });

        CandidateStatusHistory.belongsTo(models.Candidate, {
            as: 'candidate',
            foreignKey: {
                name: 'candidateId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });
    };

    return CandidateStatusHistory;
}