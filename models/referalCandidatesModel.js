module.exports = (sequelize, Sequelize, DataTypes) => {
    const ReferralCandidate = sequelize.define("ReferralCandidate", {
        referralId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        }
    });

    ReferralCandidate.associate = function (models) {
        ReferralCandidate.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: {
                name: 'createdById'
            }
        });

        ReferralCandidate.belongsTo(models.User, {
            as: 'modifiedBy',
            foreignKey: {
                name: 'lastModifiedById'
            }
        });

        ReferralCandidate.belongsTo(models.Candidate, {
            as: 'candidate',
            foreignKey: {
                name: 'candidateId'
            }
        });

        ReferralCandidate.belongsTo(models.User, {
            as: 'user',
            foreignKey: {
                name: 'userId'
            }
        });
        
        ReferralCandidate.belongsTo(models.JobRequisition, {
            as: 'jobTitle',
            foreignKey: {
              name: 'jobId',
              type: DataTypes.STRING(50)
            }
          });

    };


    return ReferralCandidate;
}